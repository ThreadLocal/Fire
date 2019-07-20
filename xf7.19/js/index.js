var jsonData1={"1010":["主教学楼","106.477086",'29.571592'],
    "1011":["第五教学楼","106.473377","29.572584"],
    "1012" :["第八教学楼","106.472102","29.572745"],
    "1013":["行政楼","106.475062","29.571866"],
    "2010":["第二综合楼","106.467707","29.573117"]
};
var mouse_flag = 0;
var jsonData={};
var oneOverlay=[];
var buildingArray=[];
var paraInfo={};//校区数据
$(document).ready(function() {
	 InternetFlag=false;
	   var    campusUrl = "url(\'images/MAP/A区.png\')";
       $("#alarmMapContentMap").css({'background-image': campusUrl});

    liNum=0;//用于存储报警条数，超过300进行决策
    liFlag=false;//用于判断是否累计到了300条
    menuZoom("indexAndCampus");
    getIndexInfo();
    ajaxForBuildingLocation();
    socketPic();
    chartsAjax();
    pictureSlide();
    
    //判断网络连接状态，是否加载百度地图，如果没有百度地图，显示无数据
    getStateInfor();
    skipSubSystem();
    $("#voiceSwitch").click(function(){
       var voiceType = $("#voiceSwitch").attr("status");
        switch (voiceType){
            case "voiceOn":
                $("#voiceSwitch").attr(
                    {
                        "src": "images/voice/voiceOff.png",
                        "status": "voiceOff"
                    }
                );
                break;
            case "voiceOff":
                $("#voiceSwitch").attr(
                    {
                        "src": "images/voice/voiceOn.png",
                        "status": "voiceOn"
                    }
                );
                break;
        }
    });
    $("#totalTableContent").hover(function(){
    	mouse_flag = 1;
    	
    },function(){
    	mouse_flag = 0;
    });
});

/*绑定系统连接*/
function skipSubSystem(){
	$(".metroData").click(function(){
		var url=$(this).attr("urlname");
		location.href=url+".htm";
	});
}
/*
 * 色块部分数据
 * */
function getIndexInfo(){
    if('WebSocket' in window){
        try{
            Montior_Indexpara= new WebSocket(newweb+"Fire/IndexInfo.do");
        }catch (e){
            alert("浏览器不支持WebSocket!");
        }
    }else{
        alert("浏览器不支持WebSocket!");
    }
    //向后端传的数据格式
    function datasend(){
        var flag1 ={"index":"allInfo"};
        Montior_Indexpara.send(flag1);
    }
    //连接成功触发,前端向后端传数据
    Montior_Indexpara.onopen = function(simuRealData){
        datasend();
    };
    Montior_Indexpara.onerror=function(simuRealData){
        alert("连接失败");
    };
    Montior_Indexpara.onmessage=function(simuRealData){
    	var indexInfo=eval('('+simuRealData.data+')');
    	var totalPoint=indexInfo["allNodeNum"];
    	var keyArray=Object.keys(indexInfo);
    	keyArray.splice(0,1);
    	keyArray.splice(4,2);
    	for(var key in indexInfo){
    		if(keyArray.indexOf(key) != -1){}   		
    		$("#"+key).find(".normal").html(indexInfo[key][1]);
    		$("#"+key).find(".unnormal").html(indexInfo[key][0]);
    		var normalNum=parseInt(indexInfo[key][1]);
    		var unnormalNum=parseInt(indexInfo[key][0]);
    		if(normalNum+unnormalNum != 0){
    			$("#"+key).find(".infoRatio").html((normalNum/(unnormalNum+normalNum)*100).toFixed(2)+"%");
    		}
    		else{
    			$("#"+key).find(".infoRatio").html(0+"%");
    		}
    		//console.log((normalNum/(unnormalNum+normalNum)).toFixed(4)*100);
    	}
    	 $("#monitorStation").find(".totalMonitor").text(totalPoint);
    }
}
/*
 * 百度地图位置
 * */
function bmapAjax(){
    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:{"controller":"BuildingMap","enum":"buildingMap"},
        success:function(locationInfo) {
        	jsonData=$.parseJSON(locationInfo);
            mapList(jsonData);
        }
            });
}
function getStateInfor(){
	//发送请求
	//判断lianw
	
	 if('WebSocket' in window){
	        try{
	            Montior_processpara= new WebSocket(newweb+"Fire/RealFaultOfIndex.do");
	        }catch (e){
	            alert("浏览器不支持WebSocket!");
	        }
	    }else{
	        alert("浏览器不支持WebSocket!");
	    }
	    //向后端传的数据格式
	    function dataSend(){
	        var flag1 ={"index":"allInfo"};
	        flag1=JSON.stringify(flag1);
	        Montior_processpara.send(flag1);
	    }
	    //连接成功触发,前端向后端传数据
	    Montior_processpara.onopen = function(simuRealData){
	        dataSend();
	    };
	    Montior_processpara.onerror=function(simuRealData){
	        alert("连接失败");
	    };
	   if(InternetFlag==true){
		   bmapAjax();
		   }else{
			   $('#noInternet').css("display","block");
		    	  Montior_processpara.onmessage=function(simuRealData){
		              var processInfo=eval('('+simuRealData.data+')');

                      /*报警声音*/
                      if($("#voiceSwitch").attr("status") == "voiceOn") {
                          var warning = document.getElementById("warning");
                          warning.currentTime = 0;
                          warning.play();
                      }

		                leftalarmAbList(processInfo);	                
		              }
		   }
}

/*
 * 百度地图和色块共同加载
 * */
function mapList() {
	   mp = new BMap.Map("alarmMapContentMap");
       var poi = new BMap.Point(106.477086, 29.571592);
       mp.enableScrollWheelZoom();
       mp.centerAndZoom(poi, 17);
       //全部加载地图
       mp.clearOverlays();
       complexCustomOverlay=loadMap(mp);
       var  buildingArrayIndex=[];
       var bamplon='';
       var bamplat="";
       var currentPoint={};
       var buildingName=" ";
       var bmapabnormal=0;
       var bmapalarm=0;
       var buildingID="";
       if(jsonObjectIsEmpty(jsonData)==false){
    	   console.log(jsonData);
       for(var key in jsonData){   	
           for(var i=0;i<jsonData[key].length;i++){
                bamplon=jsonData[key][i]["buildingLon"];
                bamplat=jsonData[key][i]["buildingLat"];
                currentPoint=new BMap.Point(bamplon, bamplat);
               buildingName=jsonData[key][i]["buildingName"];
               bulidingID=jsonData[key][i]["buildingID"];
             
              /* ComplexCustomOverlay(point, text,state,bmapabnormal,bmapalarm)*/
               buildingArray[buildingID]=new complexCustomOverlay(currentPoint,buildingName,0,bmapabnormal,bmapalarm);
               mp.addOverlay(buildingArray[buildingID]);
           }
           };
       }
  
    //获取有报警信息的更改
    Montior_processpara.onmessage=function(simuRealData){
          var processInfo=eval('('+simuRealData.data+')');
          leftalarmAbList(processInfo);
        //百度地图部分更新     
            var netSysem=processInfo["netAlarm"];
            if(netSysem!=undefined){
                //重新打覆盖物
                for(var overkey in oneOverlay){
                   oneOverlay[overkey].hide();
                }
                oneOverlay=[];
                for(var n=0;n<netSysem.length;n++){   //表示只是查的报警数据
                    var  buildingId=netSysem[n]["buildingID"];
                  /*  buildingArray[buildingId].hide();*/
                  
                    //寻找对应楼栋ID号  
                    var bamplonone=jsonData1[buildingId][1];
                    var bamplatone=jsonData1[buildingId][2];
                    var buildingoneName=jsonData1[buildingId][0];
                    var currentPointone=new BMap.Point(bamplonone,bamplatone);
                    oneOverlay[buildingId]=new complexCustomOverlay(currentPointone,buildingoneName,1,bmapabnormal,bmapalarm);
                    mp.addOverlay(oneOverlay[buildingId]);
                   
                }     
        }
    }
    
};
/*
 * 实时报警异常
 * */
function leftalarmAbList(processInfo){
	  var alarmInfo="";
     console.log(processInfo);
     for(var system in processInfo){
         var systemTotalInfo=processInfo[system];
         var newSortArray=[];
         for(var i=0;i<systemTotalInfo.length;i++){
      	   newSortArray[systemTotalInfo.length-1-i]=systemTotalInfo[i];
         }
         for(var i=0;i<newSortArray.length;i++){
             var detailUnformal=newSortArray[i];
             if(detailUnformal["faultCategory"] == "火警"){
                 alarmInfo="<li>"+"<span class='iconfont iconred'"+"node_id"+"="+detailUnformal["nodeID"]+">"+"&#xf0d2;"+"火警"+"</span>"+"&nbsp&nbsp"+detailUnformal["faultTime"]+"&nbsp&nbsp"+detailUnformal["unitName"]+"&nbsp&nbsp"+detailUnformal["buildingName"]+"&nbsp&nbsp"+detailUnformal["faultLocation"]+detailUnformal["nodeType"]+"("+detailUnformal["nodeID"]+")"+"&nbsp&nbsp"+"出现"+detailUnformal["faultCategory"]+"</li>";
                 $("#totalTableContent ul").append(alarmInfo);
                 $("ul span[node_id="+detailUnformal["nodeID"]+"]").attr({
                	 "systemName":detailUnformal['systemName'],
                	 "buildingID":detailUnformal['buildingID'],
                	 "faultLocation":detailUnformal['floor'],
                	 "unitName": detailUnformal['unitName']
                 });                 
             }
             else{
                 alarmInfo="<li>"+"<span class='iconfont iconyellow'"+"node_id"+"="+detailUnformal["nodeID"]+">"+"&#xf08f;"+"异常"+"</span>"+"&nbsp&nbsp"+detailUnformal["faultTime"]+"&nbsp&nbsp"+detailUnformal["unitName"]+"&nbsp&nbsp"+detailUnformal["buildingName"]+"&nbsp&nbsp"+detailUnformal["faultLocation"]+detailUnformal["nodeType"]+"("+detailUnformal["nodeID"]+")"+"&nbsp&nbsp"+"出现"+detailUnformal["faultCategory"]+"</li>";
                 $("#totalTableContent ul").append(alarmInfo);
                 $("ul span[node_id="+detailUnformal["nodeID"]+"]").attr({
                	 "systemName":detailUnformal['systemName'],
                	 "buildingID":detailUnformal['buildingID'],
                	 "faultLocation":detailUnformal['floor'],
                	 "unitName": detailUnformal['unitName']
                 }); 
             }
             liNum++;
         }
         if(liFlag == false){
             if(liNum>100){
                 liFlag=true;
                 var declineNum=liNum-100;
                 for(var i=0;i<declineNum;i++){
                     $("#totalTableContent").find("li").eq(i).remove();
                 }
                 liNum=0;
             }
         }
         else{
             for(var i=0;i<liNum;i++){
                 $("#totalTableContent").find("li").eq(i).remove();
             }
             liNum=0;
         }
         if(mouse_flag == 0){
        	 $("#totalTableContent ul").scrollTop($("#totalTableContent ul")[0].scrollHeight ); 
         }        
     }
     $("#totalTableContent li").unbind("click");
    /* $("#totalTableContent li").click(function(){
    	 var system_url=$(this).find("span:eq(0)").attr("systemName");
    	 var building_id=$(this).find("span:eq(0)").attr("buildingID");
    	 var floor_name=$(this).find("span:eq(0)").attr("faultLocation");
    	 var building_area=$(this).find("span:eq(0)").attr("unitName");
    	 var device_node_id=$(this).find("span:eq(0)").attr("node_id");
    	 location.href=system_url+".htm"+"?"+
    	 escape("building_id="+building_id+
    	 "&"+"building_area="+
    	 building_area+"&"+
    	 "floor_name="+
    	 floor_name+
    	 "&device_node_id="+
    	 device_node_id);
     });*/
}
/*
 * 饼状图
 */
function socketPic(){
	var socketflag=false;
	 areaFlag=false;
    if ('WebSocket' in window) {
        try {
            buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } catch (e) {
            alert("not support");
        }
    } else if ('MozWebSocket' in window) {
        buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
    } else {
        alert("not support");
    }

    buildingStatusWS1.onopen = function (evt) {
        console.log("buildingStatusWS Connected",evt);
        buildingStatusWS1.send("give me the building status");//发送请求
    };
    buildingStatusWS1.onmessage = function (evt) {
        paraInfo=eval("(" + evt.data + ")");
        if(areaFlag==false){
        	   paraInfoFun("A区");
        }else{
        	  paraInfoFun(currentArea);
        }       
     
        //判断当前是否为A区

        var pieData={"A区":[0,0,0],
            "B区":[0,0,0],
            "C区":[0,0,0]};
        for(var key in paraInfo){
            pieData[key][0]=parseInt(paraInfo[key]["abnormalNumTotal"]);//异常
            pieData[key][1]=parseInt(paraInfo[key]["alarmNumTotal"]);//报警
            pieData[key][2]=parseInt(paraInfo[key]["monitorNumTotal"])-( pieData[key][0]+ pieData[key][1]);//正常
        }   
      
        $(".campusfont:eq(0)").find("span").text(paraInfo["A区"]["monitorNumTotal"]);
        $(".campusfont:eq(1)").find("span").text(paraInfo["B区"]["monitorNumTotal"]);
        $(".campusfont:eq(2)").find("span").text(paraInfo["C区"]["monitorNumTotal"]);
        if(socketflag==false){
        	//全部赋初值
        	piePic(pieData);
        	for(var pickey1 in option){
        		barPic[pickey1].setOption(option[pickey1]);
        	}
        	socketflag=true;
        }else{ 	
        	//局部赋值
        	 var precentNumber=null;
        	for(var pickey in option){
        	/*	option[pickey]["series"][0]["data"][0].value=pieData[pickey][0];
        		option[pickey]["series"][0]["data"][1].value=pieData[pickey][1];
        		option[pickey]["series"][0]["data"][2].value=pieData[pickey][2]; */
        		//用的正常除以总数
        		if(pieData[pickey][0]+pieData[pickey][1]+pieData[pickey][2]==0){
        			  precentNumber=100;
        		}
        		else{
        			
        		    precentNumber=[pieData[pickey][2]/(pieData[pickey][0]+pieData[pickey][1]+pieData[pickey][2])]*100;
        		    }
        		/*option[pickey]["series"][1]["data"].value=precentNumber.toFixed(2)+"%";  */
        	/*	console.log(option[pickey]);*/
        		option[pickey]["series"]=[
        		                          {
        		                             animation:false,       	    		                    
        		                              data: [
        		                                  {value:pieData[pickey][0], name: '报警'},
        		                                  {value:pieData[pickey][1], name: '异常'},
        		                                  {value:pieData[pickey][2], name: '正常'},
        		                                      ],	
        		                          },
        		                          {
        		                              animation:false,    	    
        		                              data: [
        		                                  {
        		                                      value: precentNumber.toFixed(2),
        		                                      name:'正常率'+"\n"
        		                                  },

        		                              ]
        		                          }
        		                      ],
        		
        	
        	barPic[pickey].setOption(option[pickey]);        		
        	}
        }        
    };
    buildingStatusWS1.onerror = function(evt){
        console.log("buildingStatusWS Error:",evt);
        if ('WebSocket' in window) {
            try {
                buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
            } catch (e) {
                alert("not support");
            }
        } else if ('MozWebSocket' in window) {
            buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } else {
            alert("not support");
        }
    };
    buildingStatusWS1.onclose = function(evt){
        console.log("buildingStatusWS closed",evt.wasClean,evt.code);
        if ('WebSocket' in window) {
            try {
                buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
            } catch (e) {
                alert("not support");
            }
        } else if ('MozWebSocket' in window) {
            buildingStatusWS1 = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } else {
            alert("not support");
        }
    };

}

function piePic(pieData) {
    var textArea={"A区":"A区节点状态",
        "B区":'B区节点状态',
        "C区":'C区节点状态'};
    var pieColor = {"A区": ['rgba(188, 137, 251, 0.31)','rgb(188,137,251)','rgb(118,67,181)',"rgba(255, 255, 255, 0)"],
        "B区":['rgba(134,200,169,0.31)','rgb(134,200,169)','rgb(74,140,109)',"rgba(255, 255, 255, 0)"],
        "C区":['rgba(151,195,235,0.31)','rgb(151,195,235)','rgb(91,135,175)',"rgba(255, 255, 255, 0)"]};
    var pieid={"A区":"AcampusBar",
        "B区":'BcampusBar',
        "C区":'CcampusBar'};
    var i=0;
    barPic=[];
    option=[];
    var dataStyle = {
        normal: {
            label: {show:false},
            labelLine: {show:false},
            shadowBlur: 8,
            shadowColor: 'rgba(40, 40, 40, 0.2)'
        }
    };
    
    var precentNumber=null;
    for(var key in pieData){
        barPic[key]=echarts.init(document.getElementById(pieid[key]));
        //数组求和
        if((pieData[key][0]+pieData[key][1]+pieData[key][2])==0){
        	precentNumber=100;
        }else{
        var precentNumber=[pieData[key][2]/(pieData[key][0]+pieData[key][1]+pieData[key][2])]*100;}
        precentNumber=precentNumber.toFixed(2);
        console.log(precentNumber);
        option[key]={
            title: {
                text: textArea[key],
                textStyle: {
                    fontSize: 15,
                    fontWeight: "lighter"
                },
                left: 55
            },
            tooltip: {
                show:true,
                trigger: 'item',
                formatter:function(params){

                    var   res="";

                    if(params.seriesName=="正常率"){
                        res='';
                    }else{
                        res=params.name+':<br/>';
                        res+=params.value+"("+params.percent+"%)";
                    }
                    return res;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '30px',
                containLabel: true
            },
            legend: {
                show: true,
                data: [
                    {
                        name: "正常",
                        icon: "roundRect",
                        textStyle: {
                            fontSize: 8
                        }
                    },
                    {
                        name: "异常",
                        icon: "roundRect",
                        textStyle: {
                            fontSize: 8
                        }
                    },
                    {
                        name: "报警",
                        icon: "roundRect",
                        textStyle: {
                            fontSize: 8
                        }

                    },

                ],

                right: '1%',
                top: '70%',
                orient: 'vertical',
                itemWidth: 9,
                itemHeight: 7,
                itemGap: 5,
                selectedMode: false

            },
            series: [
                {
                    animation:true,
                    name: textArea[key],
                    type: 'pie',
                    cursor:'default',
                    radius: ['45%', '70%'],
                    center: ['50%', '55%'],
                    avoidLabelOverlap: false,
                    data: [
                        {value: pieData[key][0], name: '报警'},
                        {value: pieData[key][1], name: '异常'},
                        {value: pieData[key][2], name: '正常'},
                    ],
                    itemStyle: dataStyle,
                    /*,
                     label: {
                     normal: {
                     show: true,
                     position: 'center'

                     }
                     emphasis: {
                     formatter: "{b}:{c}",
                     show: true,
                     textStyle: {
                     fontSize: '14',
                     color:"#03548f"
                     }
                     }
                     },*/
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    hoverAnimation: false

                },
                {
                    animation:true,
                    name: '正常率',
                    type: 'pie',
                    radius: ['0', '42%'],
                    center: ['50%', '55%'],
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: "{b} {c}%",//自定义数据
                            textStyle: {
                                fontSize: '14',
                                color:"black"
                            }

                        },
                        emphasis: {
                            show: true,
                            position: 'center',
                            formatter: "{b} {c}%",//自定义数据
                            textStyle: {
                                fontSize: '14',
                                color:"black"
                            }
                        }
                    },
                    hoverAnimation: false,
                    data: [
                        {
                            value: precentNumber,
                            name:'正常率'+"\n"
                        }

                    ]
                }
            ],
            color:  pieColor[key]
        }     
    }
}
/*
 * 柱形图和折线图
 * */
function chartsAjax(){
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller":"HomePage"},
        dataType: "json",
        success: function (simuData) {
        	var chartsData=simuData;
            var xAxis=chartsData["date"];
            var water=chartsData["waterpressure"];
            var network=chartsData["networkAlarm"];
            var waterPump=chartsData["fireInspection"];
            linePic(xAxis,water,network,waterPump);//线性图
            var alarm=chartsData["warmingTotal"];
            var fault=chartsData["exceptionTotal"];
            alarmChartHistory(fault,alarm,xAxis);//柱状图
        }
    });
}
function linePic(xAxis,water,network,waterPump){
   var linePic=echarts.init(document.getElementById('PicContentline'));
     option1 = {
       title:{
           show:true,
           text:"近一周警情统计—子系统",
           textAlign:'center',
           x:"50%",
           y:'3%',
           textStyle:{
               fontWeight:"normal",
               fontSize:16
           }
       },
       tooltip: {
           trigger: 'item',
           //浮动框自定义,显示对应点的数据和异常报警的个数
           formatter:function(params){
               console.log(params);
               var res=params.seriesName+'<br/>';
               switch (params.seriesName){
                   case "水压监控":
                       res+="异常:"+params.data;
                       return res;
                   case "联网报警":
                       res+="异常:"+network["exception"][params.dataIndex]+'<br/>';
                       res+="报警:"+network["warming"][params.dataIndex];
                       return res;
                   case "消防巡检":
                       res+="异常:"+params.data;
                       return res;

               }
           }
       },
       legend: {
           data:['水压监控','联网报警','消防巡检'],
           right:'1%',
           top:'1%',
           orient: 'vertical',
           itemWidth:15,
           itemHeight:10,
           textStyle:{
               fontSize:10
           }
       },
       grid: {
           show:true,
           left: '3%',
           right: '6%',
           top:'25%',
           bottom:'2%',
           containLabel: true

       },

       xAxis: {
           type: 'category',
           boundaryGap: false,
           data: xAxis,
           name:"时间",
           nameGap:5
       },
       yAxis: {
           type: 'value',
           name:"数量",
           nameGap:10
       },
       series: [
           {
               smooth:true,
               name:'水压监控',
               type:'line',
               cursor:'default',
               data: water["subTotal"]
           },
           {
               smooth:true,
               name:'联网报警',
               type:'line',
               cursor:'default',
               data:network["subTotal"]
           },
           {
               smooth:true,
               name:'消防巡检',
               type:'line',
               cursor:'default',
               data:waterPump["subTotal"]
           }

       ]
   };
   linePic.setOption(option1,true);
}
function alarmChartHistory(fault,alarm,xAxis){
    var myChart = echarts.init(document.getElementById('PicContent'));
    optionbar = {
        title:{
            show:true,
            text:"近一周警情统计—类型",
            textAlign:'center',
            x:"50%",
            y:'3%',
            textStyle:{
                fontWeight:"normal",
                fontSize:16
            }
        },
         tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            show:true,
            data:['报警','异常'],
            right:'1%',
            top:'1%',
            orient: 'vertical',
             itemWidth:15,
            itemHeight:10,
            textStyle:{
                fontSize:10

            }
        },
        grid: {
            show:true,
            left: '3%',
            right: '6%',
            top:'25%',
            bottom:'2%',
            containLabel: true

        },
        xAxis : [
            {
                type : 'category',
                data :xAxis,
                name:"时间",
                nameGap:5,
                nameTextStyle:{
                    fontSize:8
                }
            }
        ],
            yAxis : [
            {

                type : 'value',
                name:"数量",
                nameGap:10,
              /*  nameTextStyle:{
                    fontSize: 8
                }*/

            }
        ],
        series : [
            {
                name:'报警',
                type:'bar',
                data:alarm,
                cursor:'default',
                //设置颜色，红色
                barWidth: "25%",
                color:['rgba(220, 93, 68, 1)'],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值',cursor:'default',}
                    ]
                }//显示最大值

            },

            {
                name:'异常',
                type:'bar',
                data:fault,
                cursor:'default',
                //设置颜色橙色
                barWidth: "25%",
                color:["rgba(243, 180, 97,1)"],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值',cursor:'default',}
                    ]
                }//显示最大值
            }
        ]
    };

    myChart.setOption(optionbar);
}
function pictureSlide(){
    $(".slider-nav__control").click(function(){
        areaFlag=true;
        $(this).addClass("is-active");
        $(this).siblings().removeClass("is-active");
       var  pictureindex=["A区","B区","C区"];
       var control=parseInt($(this).attr("data-ikslider-control"));
        var campusUrl = "url(\'images/MAP/"+pictureindex[control]+".png\')";
        $("#alarmMapContentMap").css({'background-image': campusUrl});
        currentArea=pictureindex[control];
        $(".sliderTitle").text("重庆大学"+currentArea);
        pointOfBuildingLocation(pictureindex[control]);
        paraInfoFun(pictureindex[control]);

    });
   function _reslide(){
    var controlNumber=parseInt($(".is-active").attr("data-ikslider-control"));
       var  pictureindex=["A区","B区","C区"];
       var    campusUrl="";
       if(controlNumber<3){
           controlNumber++;

           $(".slider-nav__control").each(function(){
               if(parseInt($(this).attr("data-ikslider-control"))== controlNumber){
                   $(this).addClass("is-active");
                   $(this).siblings().removeClass("is-active");
               }
           });

       }else if(controlNumber==3) {
           controlNumber=0;
           $(".slider-nav__control:eq(0)").addClass("is-active").siblings().removeClass("is-active");

       }
       var    campusUrl = "url(\'images/MAP/"+pictureindex[controlNumber]+".png\')";
       $("#alarmMapContentMap").css({'background-image': campusUrl});
       $(".sliderTitle").text("重庆大学"+pictureindex[controlNumber]);
    }
}
buildingStatusColor = {
    "0": "#29D73B",  //0 为正常 绿色
    "1": "#ED1331",  //1 为报警 红色
    "2": "#EDCE13"   //2 为异常 黄色
};
function paraInfoFun(area){
    var currentBuildingInfo=paraInfo[area];
    var buildingStatus =currentBuildingInfo["buildingStatus"];/*获取楼栋的状态*/
    var buildingData =currentBuildingInfo["buildingDetailInfo"];/*获取楼栋节点数据*/

    $(".buildingPoint").css("backgroundColor",buildingStatusColor["0"]);
    $(".buildingPoint").css("display","none");
    for (var i in buildingStatus){
        $("#"+i).css("backgroundColor",buildingStatusColor[buildingStatus[i]]);
        $("#"+i).css("display","block");
        $("#"+i).text(parseInt(buildingData[i]["total"]["abnormalNumTotal"])+parseInt(buildingData[i]["total"]["alarmNumTotal"]));
    }

    $("#normalBuilding").text(currentBuildingInfo["buildingNum"]-Object.keys(buildingStatus).length);
    $("#abnormalBuilding").text(Object.keys(buildingStatus).length);
    $("#monitorNode").text(currentBuildingInfo["monitorNumTotal"]);
    $("#abnormalNode").text(currentBuildingInfo["abnormalNumTotal"]);
    $("#alarmNode").text(currentBuildingInfo["alarmNumTotal"]);
    $("#normalRate").text(((currentBuildingInfo["monitorNumTotal"]-currentBuildingInfo["abnormalNumTotal"]-currentBuildingInfo["alarmNumTotal"])/currentBuildingInfo["monitorNumTotal"]*100).toFixed(2)+"%");
	
}
/*获取楼栋位置信息*/
function ajaxForBuildingLocation() {
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": "BuildingMap", "enum": "buildingMap"},
        success: function (locationInfo) {
            locationJson = $.parseJSON(locationInfo);

            pointOfBuildingLocation("A区");
        }
    });
}
/*楼栋定点*/
function pointOfBuildingLocation(currentCampus) {
    for (var i in locationJson[currentCampus]) {
        var newPoint = document.createElement("span");
        newPoint.id = locationJson[currentCampus][i]["buildingID"];
        newPoint.className = "point buildingPoint";
        newPoint.style.backgroundColor = "#29D73B";
        newPoint.style.display = "none";

        if (locationJson[currentCampus][i]["svgy"] != "") {
            newPoint.style.top = locationJson[currentCampus][i]["svgy"]/878*100+"%";
            newPoint.style.left = locationJson[currentCampus][i]["svgx"]/1693*100+"%";
            $("#alarmMapContentMap").append(newPoint);
            $("#" + locationJson[currentCampus][i]["buildingID"]).attr({
                "name": locationJson[currentCampus][i]["buildingName"],
                "buildingId": locationJson[currentCampus][i]["buildingID"]
            });
        }
    }
}

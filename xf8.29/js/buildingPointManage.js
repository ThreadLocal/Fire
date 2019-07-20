
$(document).ready(function() {
 websocketflag=0;
 pointBuildingId="";
 pointBuildingFloor="";
 total_deviceLogo_json={
			"00-未定义":"e929",
			"00-点型感烟":"e909",
			"01-光栅测温":"e92f",
			"02-点型感温":"e908",
			"03-点型感烟":"e909",
			"04-报警接口":"e93a",
			"05-复合火焰":"e93b",
			"06-光束感烟":"e93c",
			"07-紫外火焰":"e93d",
			"08-线型感温":"e92a",
			"09-吸气感烟":"e93e",
			"10-复合探测":"e93f",
		        "11-手动按钮":"e90a",
			"12-消防广播":"e90b",
			"13-讯响器":"e90c",
			"14-消防电话":"e940",
			"15-消火栓":"e90d",
		        "16-消火栓泵":"e927",
			"17-喷淋泵":"e926",
			"18-稳压泵":"e941",
			"19-排烟机":"e924",
			"20-送风机":"e923",
			"21-新风机":"e942",
	     	        "22-防火阀":"e921",
			"23-排烟阀":"e920",
			"24-送风阀":"e91f",
			"25-电磁阀":"e943",
			"26-卷帘门中":"e91e",
		        "27-卷帘门下":"e91d",
			"28-防火门":"e944",
			"29-压力开关":"e91c",
			"30-水流指示":"e91b",
		  	"31-电梯":"e91a",
		       "32-空调机组":"e919",
			"33-柴油发电":"e945",
			"34-照明配电":"e92d",
			"35-动力配电":"e946",
			"36-水幕电磁":"e947",
			"37-气体启动":"e918",
			"38-气体停动":"e917",
			 "39-从机":"e948",
			"40-火灾显示":"e949",
			"41-闸阀":"e94a",
			"42-干粉灭火":"e94b",
			"43-泡沫泵":"e94c",
			"44-消防电源":"e916",
			"45-紧急照明":"e94d",
			"46-疏导指示":"e94e",
			"47-喷洒指示":"e95f",
		 	"48-防盗模块":"e960",
	         	"49-信号碟阀":"e907",
			"50-防排烟阀":"e961",
			"51-水幕泵":"e962",
			"52-层号灯":"e963",
			"53-设备停动":"e915",
			"54-泵故障":"e976",
			"55-急启按钮":"e910",
			"56-急停按钮":"e977",
			"57-雨淋泵":"e97c",
			"58-上位机":"e97d",
			"59-回路":"e97e",
			"60-空压机":"e980",
			"61-移动电源":"e981",
			"62-电话插孔":"e90f",
			"63-自定义":"e906",
			"71-门灯":"e982",
			"72-备用工作":"e993",
			"99-内部设备":"e996",
			"测试":"e994",
			"未知":"e928"
		};
 systemCode="2";
noticeExist=false;
 zoomSvg=false;
svgSize=1;// 初始化svg原始大小标志
 statecolor={'正常':'#6bb92d','火警':'red','异常':'orange'};//状态颜色
 var treeCreate=new treeList();
    treeCreate.systemSelect();
});
/*
 * 树状菜单"TreeList","treeList","2",
 */
function treeList(){
	this.system_array = {"2":"NetAlarmDetailInfo","1":"WaterPressureDetailInfo","7":"PumpDetailInfoServer"};
	this.system_id = "2";
	this.jsonBuilding="";
}
treeList.prototype={
    /* 生成树形图 */
    systemSelect:function(){
        var that=this;
        this.treeAjax("2");
          $(".inputClick").click(function(){
        	  if(typeof buildstair !== "undefined"){
        		  buildstair.close(); 
        		  websocketflag = 0;
        	  }  
        	  $("#informationPicture").css("background","url('')");
        	  $("#informationPicture").empty();
              $(this).attr("class","inputClick input");
              $(this).parent().siblings().find("input").attr("class","inputClick");
              var systemNum=$(this).attr("name");
              that.system_id = systemNum;
              that.treeAjax(systemNum);
              $(".tree-folder").remove();
          });
    },
    treeAjax:function(systemNum){
        var that=this;
        $.ajax({
            type: "post",
            url: "../servlet/DispatchServlet",
            data: {"controller": "TreeList", "enum":"treeList","systemID":systemNum},
            dataType: "json",
            success: function (simuData) {
               that.jsonBuilding=simuData;
               that.SystemJudge();
               that.treeClick();
               that.treeItem();
                that.treeSearch();
            }
        });
    },
    areaSort:function(){
   	 var  keyArray=Object.keys(this.jsonBuilding);
        keyArray.sort(function(a,b){
     	   var aAac=a.substring(0,1).charCodeAt(); 
     	   var bAac=b.substring(0,1).charCodeAt(); 
              return   aAac-bAac;   	   
        });
        return keyArray;
   },
   SystemJudge:function(){
   	var keyArray=this.areaSort(this.jsonBuilding);
 
   	 if(this.system_id=="7"){/*消防特殊情况*/
   		 this.createInspectionTree(keyArray);  
   		
   		  }else{
   		 this.createTree(keyArray);
   		  }
   		},
   createInspectionTree:function(keyArray){
       var tree= document.getElementById("tree1");
       var treefolder=this.folderCreate(tree, "重庆大学", "100111");
           treefolder.style.display = "none";
      /*排序*/
       for(var i=0;i<keyArray.length;i++){
    	   var keyRebuild=keyArray[i].substring(0,1);
    	   var folderContentArea = this.folderCreate(treefolder,keyArray[i],keyRebuild);
    	   folderContentArea.style.display="none";
    	   var floorTest="";
           for (var key1 in this.jsonBuilding[keyArray[i]]) {// 楼遍历
           	floorTest=this.jsonBuilding[keyArray[i]][key1].buildingName;
           	this.itemCreate(floorTest,key1,folderContentArea);
                //增加类名便于搜索
           	
           }
       }
   },	
   /*中间层生成*/
   folderCreate:function(tree, key, id){
   	 var folder = document.createElement("div");
        folder.className = "tree-folder";
        tree.appendChild(folder);
        var folderHeader = document.createElement("div");
        var folderContent = document.createElement("div");
        folderContent.className = "tree-folder-content";
        folderHeader.className = "tree-folder-header";
        folderHeader.setAttribute("id", id);
        folder.appendChild(folderHeader);
        folder.appendChild(folderContent);
        var folderHeaderImg = document.createElement("i");
        folderHeaderImg.className = "icon-plus";
        folderHeader.appendChild(folderHeaderImg);
        var folderHeaderName = document.createElement("div");
        folderHeaderName.className = "tree-folder-name";
        folderHeader.appendChild(folderHeaderName);
        folderHeaderName.innerHTML = key;// 传入值为输入的内容
        return folderContent;// 返回的div,向其中添加下一层数据
   },
   /*最底层生成*/
   itemCreate:function(floorTest,key,folderContentBuilding){
   	 var treeItem = document.createElement("div");
        treeItem.id=key;
        treeItem.className = "tree-item";
        treeItem.setAttribute("class","tree-item "+floorTest);
        var itemHeaderImg = document.createElement("img");
        itemHeaderImg.className = "icon-building";
        itemHeaderImg.src = "images/Bmap/icon-building.png";
        treeItem.appendChild(itemHeaderImg);
        var itemHeaderName = document.createElement("div");
        itemHeaderName.className = "tree-item-name";
        treeItem.appendChild(itemHeaderName);
        itemHeaderName.innerHTML=floorTest;// 传入值为输入的内容
        folderContentBuilding.appendChild(treeItem);/*从哪里加入*/
   },
   /* 生成树形图 */
   createTree:function(keyArray){
             
              var tree= document.getElementById("tree1");
              var treefolder=this.folderCreate(tree, "重庆大学", "100111");
                  treefolder.style.display = "none";
             /*排序*/
              for(var i=0;i<keyArray.length;i++){
           	 
           	   var keyRebuild=keyArray[i].substring(0,1);
           	   var folderContentArea = this.folderCreate(treefolder,keyArray[i],keyRebuild);
           	   folderContentArea.style.display="none";
                  for (var key1 in this.jsonBuilding[keyArray[i]]) {// 楼遍历
           
                      var folderContentBuilding=this.folderCreate(folderContentArea ,this.jsonBuilding[keyArray[i]][key1].buildingName,key1);// 装楼层的框，并且要为每个楼层添加类名
                      folderContentBuilding.parentNode.firstChild.setAttribute("class","tree-folder-header buildingSelect");
                      folderContentBuilding.style.display = "none";
                      // 为每个楼层遍历添加类名，便于选中
                      var floorTest="";
                      for(var j=0;j<this.jsonBuilding[keyArray[i]][key1]["nodeFloor"].length;j++){/*生成最底层*/
                     
                     	 floorTest=this.jsonBuilding[keyArray[i]][key1]["nodeFloor"][j];
                     	 var key=" ";
                         this.itemCreate(floorTest,key,folderContentBuilding);
                      }
                  }
              }       
                },
               /* 树形图点击 */   
    /* 树形图点击 */
    treeClick:function(){
        var that=this;
        $(".tree-folder-header").on("click", function () {
            var $this = $(this);
            that.treeClickResult($this);
        });
    },
    treeItem:function(){
    	var that = this;
    	$(".tree-item").on("click",function(){
    		pointBuildingId=$(this).parent().prev().attr("id");
    		pointBuildingFloor=$(this).find(".tree-item-name:eq(0)").text();
        	$("#noticeDiv").remove();
        	//$("#informationPictureTitle").text(buildingTitle+" "+$(this).text()+" "+"消防示意图");           
            //判断当前是否存在通道
        	  if(websocketflag==0){
                  startmessage($(this).parent().prev().attr("id"),$(this).find(".tree-item-name:eq(0)").text(),newweb+"Fire/"+that.system_array[that.system_id]+".do");
                  websocketflag++;
              }
            else{
                //清除点位
                $("#informationPicture .iconfont").remove();
                var flag1 = {"buildingID":$(this).parent().prev().attr("id"),"floor":$(this).find(".tree-item-name:eq(0)").text(),"enum":"floorMap"};
                buildstair.send(JSON.stringify(flag1));
            }
        });
    	function startmessage(buildingID,floor,weburl){
    	    if('WebSocket' in window){
    	        try{
    	            buildstair= new WebSocket(weburl);
    	        }catch (e){
    	            alert("浏览器不支持WebSocket!");
    	        }
    	    }else{
    	        alert("浏览器不支持WebSocket!");
    	    }
    	    //向后端传的数据格式
    	    function dataSend(){
    	        var flag1 = {"buildingID":buildingID,"floor":floor,"enum":"floorMap"};
    	        buildstair.send(JSON.stringify(flag1));
    	    }
    	    //连接成功触发,前端向后端传数据
    	    buildstair.onopen = function(simuRealData){
    	        dataSend();
    	    };
    	    buildstair.onerror=function(simuRealData){
    	        //alert("连接失败");
    	    };
    	    buildstair.onclose=function(){
    	        console.log("close")
    	    };
    	    buildstair.onmessage = function(simuRealData){
    	        var buildmessage=eval('('+simuRealData.data+')');
    	        console.log(buildmessage);
    	        if(buildmessage.tableHeader == undefined  || buildmessage.polling.tableHeader == undefined){
    	            stateinfor(buildmessage);
    	        }
    	        else{
    	        	$(".pointArea").removeClass("bigtransition");	//去掉所有闪烁
                     for(var key in buildmessage["tableContent"]){
                    	 if(buildmessage["tableContent"][key][3] == "火警" || buildmessage["tableContent"][key][3] == "异常"){              
                     		$("#"+key+'point').addClass("bigtransition");
                     	}
                    	 $("#"+key+'point').css('color',statecolor[buildmessage["tableContent"][key][3]]);
                    	 $("#"+key+'point').attr({"location":buildmessage["tableContent"][key][2],"state":buildmessage["tableContent"][key][3],"sort":buildmessage["tableContent"][key][1]});//为点位增加信息属性              	 
                     }
    	        	 $(".pointArea").unbind("dblclick");
    	        	    clickPoint();//点位点击事件
    	        	    function clickPoint(){
    	        	    	$(".pointArea").css("cursor","pointer");
    	        	    	$(".pointArea").dblclick(function(e){
    	        	    		var position_state=$(this).attr("positionState");
    	        	    		var deviceSort=$(this).attr("sort");
    	        	    	    var deviceState=$(this).attr("state");
    	        	    	    var deviceLocation=$(this).attr("location");
    	        	    	    	var noticeDiv_X=e.pageX;
    	        	    		    var noticeDiv_Y=e.pageY; 	    
    	        	    	    var userCode=$(this).attr("userCode");
    	        	    	    var deviceValue=$(this).attr("value");
    	        	    	    var deviceNum=parseInt($(this).attr("id"));
    	        	    	    noticeWindow(userCode,noticeDiv_X,noticeDiv_Y,deviceSort,deviceState,deviceLocation,deviceValue,deviceNum,position_state);
    	        	    	    
    	        	    	});
    	        	    }
    	        }
    	    };
    	}
    	function stateinfor(buildmessage){
    		if(buildmessage.pictureAddress == ''){
    			$(".pointArea").remove();
    			$("#informationPicture").css("background",'');
    			$("#subsystemSel").css("display","none");
    			
    			  nopicture("informationPicture","当前楼层消防图不存在");
    		}
    		else{
    			 $('#noPicture').remove();
    			$('#noPicture').css("display","none");
    			$("#informationPicture").empty();
    			$(".pointArea").remove();
    	        $("#informationPicture").css("background","url"+"("+"../xf5.19/"+buildmessage.pictureAddress+")");
    	        $("#informationPicture").css("background-repeat","no-repeat");
    	        $("#informationPicture").css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));
    	        	for(var key in buildmessage.nodeAddress){
    	                var point=document.createElement('div');
    	                point.id=key+'point';
    	                point.className="pointArea";
    	                point.style.position='absolute';
    	                point.style.top=parseFloat(buildmessage.nodeAddress[key][1])*100+'%';
    	                point.style.left=parseFloat(buildmessage.nodeAddress[key][0])*874+218+'px';
    	                $(point).addClass("iconfont");                
    	                $(point).attr("userCode",buildmessage.nodeAddress[key][2]);
    	                $(point).attr("positionState",buildmessage.nodeAddress[key][3]);//储存标点出错类型
    	                $(point).css("font-weight","bolder");
    	                $("#informationPicture").append(point);
    	                if(buildmessage.nodeAddress[key].length == 5){
    	                	$(point).attr("device_sort",buildmessage.nodeAddress[key][4]);
    	                	point.innerHTML='&#x'+total_deviceLogo_json[buildmessage.nodeAddress[key][4]]+';';//引用图标
    	                }               
    	            }
    	        	var pointArrayx=[];
    	            var pointArrayy=[];
    	            for(var i=0;i<$(".pointArea").length;i++){
    	            	pointArrayx[i]=$(".pointArea").eq(i).position().left;
    	            	pointArrayy[i]=$(".pointArea").eq(i).position().top;
    	  		     }
    	        window.onmousewheel=function(){ //缩放svg时禁用滚动功能
    	        	if(zoomSvg == true){
    	        		zoomSvg=false;
    	        		return false;
    	        	}			
    	  			};
    	  			/*$("#informationPicture").draggable("disable");
    	  			$("#informationPicture").draggable("enable");*/
    	  			   $("#informationPicture").draggable({cursor:"move",start:function(event,ui){
    	  				starPositonX=event.pageX;starPositonY=event.pageY;},
    	  				drag:function(event,ui){var dragX=event.pageX;var dragY=event.pageY;var offsetx=parseFloat((dragX-starPositonX));var offsety=parseFloat((dragY-starPositonY));starPositonX=event.pageX;starPositonY=event.pageY;
    	  			if(offsetx<0&&Math.abs(offsetx)>=Math.abs(parseFloat(ui.helper.css("background-size").split(" ")[0])-Math.abs(parseFloat(ui.helper.css("background-position-x")))-parseFloat(ui.helper.css("width"))))
    	  				{   				
    	  				//$("#informationPicture").draggable("disable");
    	  				}
    	  			else if(offsetx>0&&Math.abs(offsetx)>=Math.abs(parseFloat(ui.helper.css("background-position-x")))){   		
    	  			}
    	  			else{
    	  				for(var i=0;i<$(".pointArea").length;i++){
    	   		    	 var pointX=$(".pointArea").eq(i).position().left;
    	   		    	 pointX=pointX+offsetx;
    	   		    	 $(".pointArea").eq(i)[0].style.left=pointX+'px';
    	   		     }
    	  				ui.helper.css("background-position-x",parseFloat(ui.helper.css("background-position-x"))+offsetx+"px");
    	  				
    	  			}
    	  			if(offsety<0&&Math.abs(offsety)>=Math.abs(parseFloat(ui.helper.css("background-size").split(" ")[1])-Math.abs(parseFloat(ui.helper.css("background-position-y")))-parseFloat(ui.helper.css("height"))))
    	  				{  				
    	  				//$("#informationPicture").draggable("disable")
    	  				}
    	  			else if(offsety>0&&Math.abs(offsety)>=Math.abs(parseFloat(ui.helper.css("background-position-y")))){
    	  				
    	  			}
    	  			else{
    	  				for(var i=0;i<$(".pointArea").length;i++){
    	      		    	 var pointY=$(".pointArea").eq(i).position().top;  
    	      		    	pointY=pointY+offsety;
    	      		    	 $(".pointArea").eq(i)[0].style.top=pointY+'px';
    	      		     }
    	  				ui.helper.css("background-position-y",parseFloat(ui.helper.css("background-position-y"))+offsety+"px");    				
    	  			}
    	  			}});
    	  			$("#informationPicture").css("cursor","move");
    	  			
    	  			$("#informationPicture").unbind("mousewheel");
    	  			$("#informationPicture").bind("mousewheel",function(){
    	        		zoomSvg=true;
    	  var X=parseFloat($(this).css("background-size").split(" ")[0]);
    	  var Y=parseFloat($(this).css("background-size").split(" ")[1]); 
    	  var v=event.wheelDelta;
    	  var backgoundPostion_x=parseFloat($(this).css("background-position-x"));
    	  var backgoundPostion_y=parseFloat($(this).css("background-position-y"));
    	  var svgx=(event.pageX-$(this).offset().left-backgoundPostion_x)*0.1;
    	  var svgy=(event.pageY-$(this).offset().top-backgoundPostion_y)*0.1;
    	  var svgxx=(event.pageX-$(this).offset().left-backgoundPostion_x)*0.1/1.1;
    	  var svgyy=(event.pageY-$(this).offset().top-backgoundPostion_y)*0.1/1.1;
    	  var newSvgxBig=backgoundPostion_x-svgx;
    	  var newSvgyBig=backgoundPostion_y-svgy;
    	  var newSvgxSmall=backgoundPostion_x+svgxx;
    	  var newSvgySmall=backgoundPostion_y+svgyy;     
    	  var pointSize=$(".pointArea").css("font-size");    
    	        		if(v>0){    
    	        			$(".pointArea").css("font-size",parseFloat(pointSize)*1.1+"px");
    	        			$(this).css("background-size",X*1.1+"px"+" "+Y*1.1+"px");	
    	        			$(this).css("background-position",newSvgxBig+"px"+" "+newSvgyBig+"px");
    	        			for(var i=0;i<$(".pointArea").length;i++){
    	        		    	 var pointX=$(".pointArea").eq(i).position().left;
    	        		    	 var pointY=$(".pointArea").eq(i).position().top;
    	        		    	 pointX=(pointX-backgoundPostion_x)*1.1+newSvgxBig;
    	        		    	 pointY=(pointY-backgoundPostion_y)*1.1+newSvgyBig;
    	        		    	 $(".pointArea").eq(i)[0].style.left=pointX+'px';
    	        		    	 $(".pointArea").eq(i)[0].style.top=pointY+'px';
    	        		     }
    	        		}
    	        		else if(X/1.1<=parseFloat($('#informationPicture').css('width'))){
    	        			$(this).css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));
    	        			$(".pointArea").css("font-size","12px");
    	        			$(this).css("background-position","0px 0px");
    	        			for(var i=0;i<$(".pointArea").length;i++){
    	        		    	 var pointX=pointArrayx[i];
    	        		    	 var pointY=pointArrayy[i]; 
    	        		    	 $(".pointArea").eq(i)[0].style.left=pointX+'px';
    	        		    	 $(".pointArea").eq(i)[0].style.top=pointY+'px';
    	        		     }
    	        		}
    	        		else{
    	        			$(".pointArea").css("font-size",parseFloat(pointSize)/1.1+"px");
    	        			$(this).css("background-size",X/1.1+"px"+" "+Y/1.1+"px");
    	        			$(this).css("background-position",newSvgxSmall+"px"+" "+newSvgySmall+"px");
    	        			for(var i=0;i<$(".pointArea").length;i++){
    	        		    	 var pointX=$(".pointArea").eq(i).position().left;
    	        		    	 var pointY=$(".pointArea").eq(i).position().top;
    	        		    	 pointX=(pointX-backgoundPostion_x)/1.1+newSvgxSmall;
    	        		    	 pointY=(pointY-backgoundPostion_y)/1.1+newSvgySmall;
    	        		    	 $(".pointArea").eq(i)[0].style.left=pointX+'px';
    	        		    	 $(".pointArea").eq(i)[0].style.top=pointY+'px';
    	        		     }
    	        		}
    	        	})
    		}
    	        	changePoint();//移动点位更新
    	}
    	function noticeWindow(userCode,X,Y,sort,state,location,value,num,position_state){
    		function subNotice(){
    			var newNoticeDiv = document.createElement("div");
    		    newNoticeDiv.id = "noticeDiv";
    		    newNoticeDiv.className = "windowBody";
    		    newNoticeDiv.style.top = Y+"px";
    		    newNoticeDiv.style.left = X+"px";
    		    $("body").append(newNoticeDiv);
    		    var newNoticeTitleDiv = document.createElement("div");
    		    newNoticeTitleDiv.id = "noticeTitleDiv";
    		    newNoticeTitleDiv.className = "windowTitle";
    		    $(newNoticeTitleDiv).css({'background-color':'rgb(44, 146, 146)','color':'#fff'});
    		    $(newNoticeTitleDiv).html('<span style="color:white">'+'用户编号：'+userCode+'</span>'+'<span class="iconfont" id="windowClose">'+'&#xf081'+'</span>');
    		    $("#noticeDiv").append(newNoticeTitleDiv);
    		    var noticeContent="<span>设备类型:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+sort+"</span>"+"</br>"+"<span>设备位置:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+location+"</span>"+"</br>"+"<span>设备编号:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+num+"</span>"+"</br>"+"<span>设备状态:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+state+"</span>";
    		    switch(position_state){
    		    case "1":
    		    	break;
    		    case "0":
    		    	$("#noticeDiv").append("<span>该点图上不存在</span></br>");
    		    	if(value != undefined){
    			    	noticeContent+="</br>"+"<span>设备参数:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+value+"</span>"
    			    }
    			    $("#noticeDiv").append(noticeContent);
    		    	break;
    		    default:
    		    	if(value != undefined){
    			    	noticeContent+="</br>"+"<span>设备参数:</span>"+"&nbsp&nbsp&nbsp&nbsp"+"<span>"+value+"</span>"
    			    }
    			    $("#noticeDiv").append(noticeContent);
    			    break;
    		    }	        
    		    $("#noticeDiv").draggable({
    		        handle:'#noticeTitleDiv',
    		        containment:"#informationPicture"
    		    }
    		);
    		$("#windowClose").on("click",function(){
    		        $("#noticeDiv").fadeOut(0,function(){
    		            $("#noticeDiv").remove();
    		        });
    		    }
    		);
    		}
    		if(position_state != "1"){
    			if(noticeExist == false){
    				noticeExist=true;
    				subNotice();	
    			}
    			else{
    				$("#noticeDiv").fadeOut(0,function(){
    		            $("#noticeDiv").remove();
    		        });
    				subNotice();
    			}
    		}	
    	}  
    	
    	
    	/*
    	 * 楼层图不存在
    	 * 
    	 */
    	function nopicture(address,text){
    		    $('#noPicture').remove();
    		    var noPicture=document.createElement("div");
    		    noPicture.id="noPicture"; 
    		    $("#"+address).append(noPicture);
    		    var img = document.createElement("img");
    		    img.id = "imagePic";
    		    img.src="img/noData.png";
    		    $("#noPicture").append(img);
    		    var imgText=document.createElement("span");
    		    imgText.id="imgText";
    		    $("#noPicture").append(imgText);
    		    $("#imgText").text(text);   
    	}
    	//点位拖动更新数据库功能
    	function changePoint(){
    		$(".pointArea").css("cursor","pointer");
    	    $(".pointArea").draggable({containment: "parent",cursor:"pointer",stop:function(e){
    	    	deviceNum=parseInt($(this).attr("id"));
    	    	var svgBackground_size_x=parseFloat($("#informationPicture").css("background-size").split(" ")[0]);
    	    	var svgBackground_size_y=parseFloat($("#informationPicture").css("background-size").split(" ")[1]);
    	    	pointX=$(this).position().left-parseFloat($("#informationPicture").css("background-position-x"))-(svgBackground_size_x/1310)*218;   	    	
    	    	pointX=pointX/(svgBackground_size_x/1310*874);	    	
    	    	pointY=$(this).position().top-parseFloat($("#informationPicture").css("background-position-y"));
    	    	pointY=pointY/svgBackground_size_y;
    	    	sendPosition(systemCode,pointBuildingId,pointBuildingFloor);
    	    	/*var noticeDiv_X=e.clientX;
    	    	var noticeDiv_Y=e.clientY;
    	    	var newNoticeDiv = document.createElement("div");
    	        newNoticeDiv.id = "noticeDiv";
    	        newNoticeDiv.className = "windowBody";
    	        newNoticeDiv.style.top = noticeDiv_Y+"px";
    	        newNoticeDiv.style.left = noticeDiv_X+"px";
    	        $("body").append(newNoticeDiv);

    	        var newNoticeTitleDiv = document.createElement("div");
    	        newNoticeTitleDiv.id = "noticeTitleDiv";
    	        newNoticeTitleDiv.className = "windowTitle";
    	        $("#noticeDiv").append(newNoticeTitleDiv);
    	        $("#noticeTitleDiv").html('<span>'+"是否放置点位在此处"+'</span>'+'<span class="iconfont" id="windowClose">'+'&#xf081'+'</span>');
    	        $("#noticeTitleDiv").css({'background-color':'rgb(44, 146, 146)','color':'#fff'});*/
    	    	}})
    	    }
    	function sendPosition(systemName,buidName,floorName){
    	    var positionInfo={};
    	    positionInfo["point"]=[];
    	    positionInfo["point"][0]=systemName;
    	    positionInfo["point"][1]=buidName;
    	    positionInfo["point"][2]=floorName;
    	    positionInfo["point"][3]={};
    	        positionInfo["point"][3][deviceNum]=[];        
    	        positionInfo["point"][3][deviceNum].push(pointX);
    	        positionInfo["point"][3][deviceNum].push(pointY);
    	    
    	    positionInfo["point"]=JSON.stringify(positionInfo["point"]);
    	    positionInfo["controller"]="SetPictureNode";
    	    $.ajax({
    	        type: "post",
    	        url: "../servlet/DispatchServlet",
    	        data:positionInfo,
    	        dataType: "",
    	        success: function(simuData){
    	            console.log(simuData)
    	        }
    	    });
    	}
    	
    },
    /* 点击结果操作 */
    treeClickResult:function($this){
        $(".tree-folder-header").css("background-color", "");
        $("#searchInput").val("");
        $(".tree-item-name").parent(".tree-item").css("background-color", "");
        var divDisplay = $this.siblings(".tree-folder-content").children(".tree-folder,.tree-item");// children只查一级，存在下一级菜单
        // 选中的是楼栋
        var divBuilding=$this.hasClass("buildingSelect");
        if (divDisplay != null) {// 选中为楼栋校区
            /*
             * $this.parent().siblings(".tree-folder").find(".tree-folder-header").css("background-color",
             * "");///这里把同级，并且对应下一级均背景颜色清掉
             */    if ( $this.children("i").attr("class") == "icon-plus") {// 并且未打开，则为减号
                // 让子元素出现
                /* $this.css("background-color", "#D3D6E1"); */
                $this.siblings(".tree-folder-content").css("display", "block");
                // 变加号为减号
                $this.children("i").attr("class", "icon-implus");
                $this.parent().siblings(".tree-folder").children(".tree-folder-content").css("display", "none");
                $this.parent().siblings(".tree-folder").children(".tree-folder-header").children("i").attr("class", "icon-plus");
                if(divBuilding==true) {// 选中为楼栋
                    var buildingNumber = $this.attr("id");
                    $this.parent().siblings(".tree-folder").children(".tree-folder-content").css("display", "none");
                    var siblings = $this.parent().parent().parent().siblings(".tree-folder").children(".tree-folder-content").find(".tree-folder-content");
                    siblings.css("display", "none");
                    siblings.siblings(".tree-folder-header").find("i").attr("class", "icon-plus");
                    $this.parent().siblings(".tree-folder").children(".tree-folder-header").find("i").attr("class", "icon-plus");
                    var building = $this.children(".tree-folder-name").text();
                    var buildArea = $this.parent().parent().siblings(".tree-folder-header").attr("id") + "区";
                    $("#buildingPictureTitle span").html(building);
                }
            }
            else {// 已经打开
                // 还需要判断是不是重庆大学发生了点击
                $this.parent().find(".tree-folder-content").css("display", "none");
                // 变减号为加号
                $this.parent().find("i").attr("class", "icon-plus");
                $this.removeClass("buildSelect");
                /* $this.css("background-color", ""); */
                // 发生取消点击，将parentArray最后一位删除
            }
        }
    },

    /* 树形图搜索 */
    treeSearch:function(){
        var searchResult = new Array();
        /*回车提交输入值*/
        $("#searchInput").on("keydown",function(event){
            if( event.which == 13 ){
                $("#searchSubmit").click();
            }
        });
        /*提交按钮*/
        $("#searchSubmit").on("click",function() {
            //去掉上一次匹配的操作
            $(".buildingSelect").css("background", "");
            $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");//选中的变加号号
            $(".className").css("display", "none");
            $("#explainDiv").children("li").remove();
            $("#explainDiv").css("display", "none");
            searchResult.length=0;
            var searchWord = $("#searchInput").val().trim();//获取输入的文字,去掉空格
            var reg= new RegExp(searchWord,"g");
            if (searchWord != "") {
                //遍历所有的item楼栋信息,把匹配成功的结果push入数组

                $(".buildingSelect").each(function () {
                    var   $this = $(this);
                    //重新写匹配条件
                    var buildingName=$this.children(".tree-folder-name");

                    if (buildingName.text().match(reg)) {//匹配成功
                        searchResult.push($this.text());//存入数组
                        /*     $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");
                         $(".className").css("display", "none");*/
                        $this.parents(".tree-folder-content").addClass("className").css("display", "block");
                        $this.parents(".tree-folder-content").siblings(".tree-folder-header").children("i").attr("class", "icon-implus");
                        $this.css("background", " #e6e9f4");
                        //换图片，换百度地图，换数据
                    }
                });
                console.log(searchResult);

                if (searchResult.length > 1) {//多余一条才出现选择框
                    var searchLi="";
                    $("#explainDiv").css("display", "block");
                    for (var i = 0; i < searchResult.length; i++) {
                        searchLi += "<li class='searchResult'>" +searchResult[i]+ "</li>";

                    };
                    searchLi=searchLi.replace(reg,"<strong>"+searchWord+"</strong>");
                    $("#explainDiv").append(searchLi);
                }
            }
            $(".searchResult").on("click", function () {
                var searchResultString = $(this).text();
                $("#searchInput").val(searchResultString);
                treeChange(searchResultString);
            });
            $("#BuildingTree").on("click", function () {
                $("#explainDiv").css("display", "none");
                $("#explainDiv li").remove();
            });
        });
        /*重置按钮*/
        $("#searchReset").on("click",function(){
            $("#searchInput").val("");
            $("#searchSubmit").click();
        });
        //选中一个绝对匹配
        function treeChange(finallyResult) {
            $("#explainDiv").css("display", "none");
            $("#explainDiv li").remove();
            $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");
            $(".className").css("display", "none");
            $(".searchBackground").css("background", "");
            if (finallyResult != "") {
                $(".buildingSelect").each(function () {
                    var   $this = $(this);
                    //重新写匹配条件
                    if ($this.text() === finallyResult) {//这里需要完全等于
                        //匹配成功
                        $this.parents(".tree-folder-content").addClass("className").css("display", "block");
                        $this.parents(".tree-folder-content").siblings(".tree-folder-header").children("i").attr("class", "icon-implus");
                        $this.css("background", " #e6e9f4");
                        $this.addClass("searchBackground");
                    }
                });
            }
        }
        
    }
}
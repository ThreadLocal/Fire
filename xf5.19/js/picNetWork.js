$(document).ready(function() {
	menuZoom("subsystemSelect");
	//参数初始化
	initinfo();
	var InternetFlag=true;               //联网标志物
	var text="当前无网络连接，百度地图加载失败";
	 noInternet("buildingMap",text);	
   
	try{
		var mp = new BMap.Map("BuildingMap");	
	}
	catch(e){
		InternetFlag=false;
		 $('#noInternet').css("display","block");
	}
	var DataTransfer=new transferData("TreeList","treeList","2",newweb+"Fire/AllbuildingStatus.do",InternetFlag,newweb+"Fire/NetAlarmDetailInfo.do");
	DataTransfer.internetJudge();
});

function initinfo() {
	total_deviceLogo_json={"00-未定义":"e929","00-点型感烟":"e909","02-点型感温":"e928","03-点型感烟":"e909","08-线型感温":"e92a",
	"11-手动按钮":"e90a","12-消防广播":"e90b","13-讯响器":"e90c","15-消火栓":"e90d",
	"16-消火栓泵":"e927","17-喷淋泵":"e926","19-排烟机":"e924","20-送风机":"e923",
	"22-防火阀":"e921","23-排烟阀":"e920","24-送风阀":"e91f","26-卷帘门中":"e91e",
	"27-卷帘门下":"e91d","29-压力开关":"e91c","30-水流指示":"e91b","31-电梯":"e91a",
	"32-空调机组":"e919","34-照明配电":"e92d","37-气体启动":"e918","38-气体停动":"e917","44-消防电源":"e916",
	"49-信号碟阀":"e907","53-设备停动":"e915","55-急启按扭":"e910","62-电话插孔":"e90f","63-自定义":"e921"};
	buildingCode={"主教学楼":"2010"};
	systemCode="2";
	noticeExist=false;
    zoomSvg=false;
	svgSize=1;// 初始化svg原始大小标志
    statecolor={'正常':'#6bb92d','火警':'red','异常':'orange'};//状态颜色
    stateNum={'正常':'3','火警':'1','异常':'2'};//状态排序
    newpagenum=1;
    websocketflag=0;
    var page_navigation=document.getElementById("page_navigation");
    var ul=document.createElement("ul");
    page_navigation.appendChild(ul); 
}
//排序程序
function sortNum(contentArray,codeindex){
	contentArray.sort(function(a,b){
		return stateNum[a[codeindex]]-stateNum[b[codeindex]];//比较元素状态的序号大小
	});
}
function getSortArray(contentArray,rowline,row,line,codeindex){
	rowline=0;
    for(var i=0;i<contentArray.length;i++){
    	rowline++;
    	//每20行为一页（不包括表头的行数）
        if(rowline == 21){
        	trcontent[pagenum]=row;
        	row='';
            rowline=1;
            pagenum++;
        }
        $("#"+contentArray[i][0]+'point').css('color',statecolor[contentArray[i][codeindex]]);
        $("#"+contentArray[i][0]+'point').attr({"location":contentArray[i][2],"state":contentArray[i][codeindex],"sort":contentArray[i][1]});//为点位增加信息属性
   row+="<tr class='forPageChange'"+' '+'id'+'='+contentArray[i][0]+'>';     
for(var j=0;j<line;j++){
//添加序号
        if(j == 0){
            row+='<td>'+(rowline+pagenum*20)+'</td>';
        }
        //添加其他参数信息
        else{
            row+='<td title='+contentArray[i][j]+'>'+contentArray[i][j]+'</td>';
        }
}
row+='</tr>';  
trcontent[pagenum]=row;        
    }
    //将所有内容赋给trcontent数组，并将不足10行的补足空格
    var complement=20-rowline; //获取需要补足的行数个数
    for(var i=0;i<complement;i++){
        trcontent[pagenum]+='<tr>';
        for(var j=0;j<line;j++){
            trcontent[pagenum]+='<td>'+'&nbsp'+'</td>'
        }
        trcontent[pagenum]+='</tr>';
    }
}

function treeItem(weburl){
	{
        $(".tree-item").on("click",function(){
        	$("#indexTittle").append("<input id='changeSiv' type='file' accept='xls/image'><div class='preview_box' style='width:200px;float:left'>"+'图片预览:'+"</div>");
        	$("#changeSiv").on("change",function(e){
        		var file=e.target.files[0];
        		if(!file.type.match('image.*')){
        			alert("格式不正确")
        		}
        		var reader=new FileReader();
        		reader.readAsDataURL(file);//读取文件
        		reader.onload=function(arg){
        	    var img='<img class="preview" src='+arg.target.result+'>';
        	    $(".preview_box").empty().append(img);
        	     form_data=new FormData();
        	    var file_data=$("#changeSiv").prop("files")[0];
        	    var picture_path="networkAlarm"+"/"+sendArray[0]+"/"+sendArray[1];
        	    form_data.append("BS_picUp",file_data);
        	    form_data.append("load_path",picture_path);
        	    form_data.append("buildingID",sendArray[0]);
        	    form_data.append("floor",sendArray[1]);
        	    form_data.append("controller","SaveOrUpdateInfoAboutUpload");
        	    form_data.append("formName","picture");
        	    $.ajax({
        	        type: "post",
        	        url: "../servlet/FileUploadServlet",
        	        data: form_data,
        	        dataType:"json",
        	        processData:false,
        	        contentType:false,
        	        success: function (simuData) {
        	        	alert("上传成功")
        	        },
        	       error:function(simuData){
        	    	   alert("上传失败")
        	       }
        	    });
        	    
        		}
        	})
        	noticeExist=false;
        	$("#noticeDiv").remove();
        	$("#informationPictureTitle").text(buildingTitle+" "+$(this).text()+" "+"消防示意图");
            treefolderheaderFlag=0;//关闭统计信息实时表格的显示
            //初始化表格样式
            var that=$(this);
             sendArray=startCurrentTable(that);
            //判断当前是否存在通道
            if(websocketflag==0){
                startmessage(sendArray[0],sendArray[1],weburl);
                websocketflag++;
            }
            else{
                //清除点位
                $("#informationPictureContent .iconfont").remove();
                var flag1 = {"buildingID":sendArray[0],"floor":sendArray[1],"enum":"floorMap"};
                buildstair.send(JSON.stringify(flag1));
            }
        });
    }
};
function locaitonSort(array){
    array.sort(function(a,b){
        return a[0].length-b[0].length;//比较元素状态的序号大小
    });
    return array;
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
function clickAgain(){
	$(".pointArea").removeClass('bigtransition');
    $('.standTable tr').hover(function(){
        var id=$(this).attr('id');
        $('#'+id+'point').addClass('bigtransition');
    },function(){
        var id=$(this).attr('id');
        $('#'+id+'point').removeClass('bigtransition');
    });
}
//点位拖动更新数据库功能
function changePoint(){
	$(".pointArea").css("cursor","pointer");
    $(".pointArea").draggable({containment: "parent",cursor:"pointer",stop:function(e){
    	deviceNum=parseInt($(this).attr("id"));
    	pointX=$(this).position().left-10;
    	pointY=$(this).position().top-2;
    	sendPosition(systemCode,buildingCode[pointBuildingName],pointBuildingFloor);
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
	    //var userCode=$(this).attr();
	    noticeWindow(userCode,noticeDiv_X,noticeDiv_Y,deviceSort,deviceState,deviceLocation,deviceValue,deviceNum,position_state);
	});
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
function jsonDataeval(tablecontent){
    $("#tableTbody").removeClass("statistics");
    //获取节点状态索引
    var codeindex=tablecontent.tableHeader.indexOf('状态');
    pagenum=0; //初始化页码
    var rowline=0; //初始化行数
    trcontent=[]; //初始化页内容
    tableheadercontent='';// 初始化表头内容
    var row='';//初始化表内容
    var line=tablecontent.tableHeader.length;//获取列数;
    //获取表头内容
    tableheadercontent=gettableHeader(tablecontent.tableHeader,tableheadercontent);
    //对内容进行排序
    var tableinfo=tablecontent.tableContent;//获取表内容对象
    var contentArray=sortContent(codeindex,tableinfo);//排序内容
    getSortArray(contentArray,rowline,row,line,codeindex);//遍历所有内容,将所有内容赋给内容数组    
    $(".pointArea").unbind("dblclick");
    clickPoint();//点位点击事件
    //getarray(tablecontent,rowline,row,line,codeindex);
    $("#totalpage").text(parseInt(pagenum)+1);
    //默认加载第一页内容
    PageChange(trcontent,newpagenum);
};

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
        if(buildmessage.tableHeader == undefined){
            stateinfor(buildmessage);
        }
        else{
        jsonDataeval(buildmessage);
        clickAgain();
        }
    };
}
function gettableHeader(Header,content){
    content+='<tr>';
    for(var key in Header){
        content+='<th>';
        content+=Header[key];
        content+='</th>';
    }
    content+='</tr>';
    return content;
};
function PageChange(trcontent,pagenum){
    $("#tableTbody").html(tableheadercontent+trcontent[pagenum-1]);
}
function sortContent(codeindex,tableinfo){
    var contentArray=[];//存储所有内容到2维数组（包括编号）用于排序;
    var indexNum=0;//2维数组索引初始化
    for(var key in tableinfo){
        if(contentArray[indexNum] == undefined){
            contentArray[indexNum]=tableinfo[key];
        }
        else{
            contentArray[indexNum].push(tableinfo[key]);
        }
        indexNum++;
    }
    //sort排序很easy
    sortNum(contentArray,codeindex);
    return contentArray;
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
		$("#subsystemSel").find("img[class='selected']").remove();
		$("#subsystemSel").css("display","block");//先显示所有本楼log
		$("#subsystemSel").find(".subsystemSelEvery").css("opacity","0.2");
		$("#subsystemSel").find(".subsystemSelEvery").attr("select","disable");
		$(".pointArea").remove();
        $("#informationPicture").css("background","url"+"("+buildmessage.pictureAddress+")");
        $("#informationPicture").css("background-repeat","no-repeat");
        $("#informationPicture").css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));
        	for(var key in buildmessage.nodeAddress){
                var point=document.createElement('div');
                point.id=key+'point';
                point.className="pointArea";
                point.style.position='absolute';
                point.style.top=parseFloat(buildmessage.nodeAddress[key][1])+2+'px';
                point.style.left=parseFloat(buildmessage.nodeAddress[key][0])+10+'px';
                $(point).addClass("iconfont");                
                $(point).attr("userCode",buildmessage.nodeAddress[key][2]);
                $(point).attr("positionState",buildmessage.nodeAddress[key][3]);//储存标点出错类型
                $(point).css("font-weight","bolder");
                if(buildmessage.nodeAddress[key].length == 5){
                	$(point).attr("device_sort",buildmessage.nodeAddress[key][4]);
                	point.innerHTML='&#x'+total_deviceLogo_json[buildmessage.nodeAddress[key][4]]+';';//引用图标
                }               
                /* 以下用来标重并排序所在楼层的设备类型logo*/                
                show_deviceLogo(buildmessage.nodeAddress[key][4]);             
                $("#informationPicture").append(point);
                if(buildmessage.nodeAddress[key][3]== "1"){   //数据库不存在的点专属图标
                	point.innerHTML='&#xe908;';
                }
            }
        	var device_selected=[];//初始化筛选设备列表
        	/*为设备类型logo绑定筛选功能*/
        	select_device(device_selected);
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
  			$("#informationPicture").draggable({cursor:"pointer",start:function(event,ui){
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
  			$("#informationPicture").css("cursor","pointer");
  			
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
        			$(".pointArea").css("font-size","16px");
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
        	//changePoint();//移动点位更新
}
function operaView(){
    //键盘翻页
    $("#num_box").bind("input propertychange",function(){
        newpagenum=$(this).val();
        if(parseInt($(this).val())>(pagenum+1)){
            newpagenum=pagenum+1;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
        else if(parseInt($(this).val())<1){
            newpagenum=1;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
        else {
            newpagenum=$(this).val();
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
    });
    //向上翻页
    $("#previous_page").click(function(){
        if($("#num_box").val() == 1){
            return
        }
        else{
            newpagenum--;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
    });
    //翻到首页
    $("#first_page").click(function(){
        if($("#num_box").val() == 1){
            return
        }
        else{
            newpagenum=1;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
    });
    //翻到尾页
    $("#last_page").click(function(){
        if($("#num_box").val() == pagenum+1){
            return
        }
        else{
            newpagenum=pagenum+1;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
    });
    //向下翻页
    $("#next_page").click(function(){
        if($("#num_box").val() == pagenum+1){
            return;
        }
        else{
            newpagenum++;
            PageChange(trcontent,newpagenum);
            $('#num_box').val(newpagenum);
            clickAgain();
        }
    });
}
function startCurrentTable(that){
            pointBuildingFloor=that.text();//用于更新点位数据库的发送内容
            pointBuildingName=that.parent().siblings(".tree-folder-header").children('.tree-folder-name').text();
            var sendarray=[];
            newpagenum=1;
            //初始化楼层事件，发送楼层请求，更改数据，重新打点，出表格
            var buildingID=that.parent().siblings(".tree-folder-header").attr("id");
            var floor=that.text();
            var buildingname=that.parent().siblings(".tree-folder-header").children('.tree-folder-name').text();
            $("#currentFloor").text(floor);
            $("#noselectstair").remove();
            var navigation_html = '<li class="icon-page iconfont" id="first_page">&#xea1a;</li><li class="icon-page iconfont" id="previous_page">&#xea44;</li>';
   	     //图重新找
   	        navigation_html += '<li id="page_span1">第</li>';
   	        navigation_html += '<li class="input_box"><input  id="num_box" type="text"><li>'//这里关于表单的还不知道
   	        navigation_html += '<li id="page_span2"> /' + '<span id="totalpage" style="display:inline-block">&nbsp</span>'+'页</li>';
   	        navigation_html += '<li class="icon-page iconfont" id="next_page">&#xea42;</li><li class="icon-page iconfont" id="last_page">&#xea1b;</li>';//链接到对应页
   	         $("#page_navigation ul").html(navigation_html);
            $('#num_box').val(1);
            //页码操作上下页，跳转事件
            operaView();
            sendarray.push(buildingID);
            sendarray.push(floor);
            return sendarray;
        }
function select_device(device_selected){
	$("#subsystemSel").children().unbind("click");//先为所有logo解绑，防止多次绑定
	$("#subsystemSel").children().css("cursor","default");
	/*为本层logo绑定筛选功能*/
	$("#subsystemSel").find("[local_device]").css("cursor","pointer");
	$("#subsystemSel").find("[local_device]").bind("click",function(){
		if($(this).attr("select") == "disable"){			
			$(this).attr("select","enable");
			$(this).append("<img src='images/checkbox.png' class='selected' style='position:absolute;left:30px;top:0px'>");
			var device_sort=$(this).attr("device_sort");
			device_selected.push(device_sort);
			$("#informationPicture").find(".pointArea").css("visibility","hidden");
			for(var i=0;i<device_selected.length;i++){
				$("#informationPicture").find("[device_sort="+device_selected[i]+"]").css("visibility","visible");	
			}			
		}
		else{
			$(this).attr("select","disable");
			$(this).css("opacity","1");
			$(this).find("img:eq(1)").remove();
			var device_sort=$(this).attr("device_sort");
			device_selected.indexOf(device_sort)
			device_selected.splice(device_selected.indexOf(device_sort),1);
			if(device_selected.length == 0){    
				$("#informationPicture").find(".pointArea").css("visibility","visible");
			}					
			else{
				$("#informationPicture").find(".pointArea").css("visibility","hidden");
				for(var i=0;i<device_selected.length;i++){
					$("#informationPicture").find("[device_sort="+device_selected[i]+"]").css("visibility","visible");	
				}
			}			
		}
	})
}
function show_deviceLogo(info){
	var device_sort=info;
    var $current_device=$("#subsystemSel").find("[device_sort="+device_sort+"]");
    $current_device.css("opacity","1");//本层logo透明度1清晰表示
    $current_device.attr("local_device","");//代表本层logo
    $current_device.remove();
    $("#subsystemSel").prepend($current_device);  
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
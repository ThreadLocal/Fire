pollingStateColor = {
    "inspectionType":{
      "0":"#ccc",
      "1":"#19A25F"
    },
    "faultType":{
        "0":"#ccc",
        "1":"#DD5044"
    }
};
pumpInfoTable=["nodeType","pumpState","powermalfunction","faultfeedback","vibration","temperature"];


$(document).ready(function() {
	menuZoom("subsystemSelect");            //联网标志物
    var DataTransfer=new transferData("TreeList","treeList","7",newweb+"Fire/AllbuildingStatus.do",newweb+"Fire/PumpDetailInfoServer.do");
	DataTransfer.webStart();
});
/*
 * 参数初始化
 * 
 * */
function initinfo() {
    stateinfo={'0':'正常','1':'火警','2':'故障'};
    statecolor={'0':'green','1':'red','2':'orange'};
    newpagenum=1;
    websocketflag=0;
    var page_navigation=document.getElementById("page_navigation");
    var ul=document.createElement("ul");
    page_navigation.appendChild(ul);
    
}

/*
 * 楼栋点击
 * */
function  tree_item(url){	
   $(".tree-item").on("click",function(){
	 var buildingNumber = $(this).attr("id");         	        
	   var  backgroundImg ="images/building/"+buildingNumber+ ".jpg";
       $("#buildingPictureContent img").attr("src", backgroundImg);
    
    acontentTable.newpagenum = 1;
    acontentTable.IntitialTable();
    /*复位表格全局变量*/
    var floor=$(this).text();
    $("#currentFloor").attr("class","currentFloorStyle");
	$("#currentFloor").html("> "+"<span>"+floor+"</span>");
    var that=$(this);
    $("#tableContent").css("height","590px");
    //改标志位
    treefolderheaderFlag=0;//关闭统计信息实时表格的显示
    if(websocketflag==0){
    	 tableWebsocket(buildingNumber,url,acontentTable);
         websocketflag++;
    }else{//切换楼栋
    	//重新请求数据
    	var newAddress={"sysid":"7","buildingID":buildingNumber,"enum":"floorMap"};
    	buildstair.alert == true;
        buildstair.send(JSON.stringify(newAddress));
    }
    
       //添加图片
 /*      var pictureAddress="images/floor/pumping/2010/B2-1.svg";
       $("#informationPicture").css("background","url"+"("+pictureAddress+")");
       $("#informationPicture").css("background-repeat","no-repeat");
       $("#informationPicture").css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));*/
       //判断当前是否存在通道
       
   });   
}
function tableWebsocket(buildingSelect,url,acontentTable){
	if('WebSocket' in window){
       try{
       	 buildstair= new WebSocket(url);
       	 buildstair.alert = true;
       }catch (e){
           alert("浏览器不支持WebSocket!");
       }
   }else{
       alert("浏览器不支持WebSocket!");
   }
   //向后端传的数据格式
   function dataSend(){
       var flag={"sysid":"7","buildingID":buildingSelect,"enum":"floorMap"};//
       buildstair.send(JSON.stringify(flag));
   }
   //连接成功触发,前端向后端传数据
   buildstair.onopen = function(simuRealData){
       dataSend();
   };
   buildstair.onerror=function(simuRealData){
       alert("连接失败");
   };
   buildstair.onmessage=function(simuRealData){
	      var buildmessage=JSON.parse(simuRealData.data);      
     	if(buildmessage.polling==undefined){
   		   if(buildmessage.pictureAddress == ''){
   			$("#informationPicture").css("background",'');
   			/*$("#subsystemSel").css("display","none");*/	
   			  nopicture("informationPicture","当前楼层消防示意图不存在");
   		    }
   		  else{
   		      var pictureAddress=buildmessage.pictureAddress	;
   	          $('#noPicture').remove();
              $("#informationPicture").css("background","url"+"("+pictureAddress+")");
              $("#informationPicture").css("background-repeat","no-repeat");
              $("#informationPicture").css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));
   		      }	
   	    }else{
   		     var tablecontent=buildmessage.polling;	
             var option={         		//初始化功能模块
    		 tableHeader:tablecontent["tableHeader"],//输入表格显示的表头,参数为数组
    		 tableContent:tablecontent["tableContent"][Object.keys(tablecontent["tableContent"])[0]],//输入表格内容提供,形式为json，json的value内的数组元素为表头参数需要显示的具体值		
    	      };
   	acontentTable.drawTable(option);
    //表格的点击事件
    var pollingState=JSON.parse(simuRealData.data).pollingState;
    resetPollingState(pollingState);    
   	var pumpData=JSON.parse(simuRealData.data).pump;
   	resetPumpInfo("pumpTable",pumpData);
    if(jsonObjectIsEmpty(tablecontent["tableContent"])==true && buildstair.alert == true){
		alert("该楼栋暂无数据");//
		buildstair.alert=false;
		
	}
   };
}
}
/*
 * 右侧巡检状态数据更新
 * */
function resetPollingState(pollingState){
    $(".inspectionState div").css("color","#ccc");
    if(pollingState.length == 0){
    	return;
    }
    $(".inspectionType div").each(function(e){
        $(this).css("color",pollingStateColor["inspectionType"][pollingState[0][e]]);
    });
    $(".faultType div").each(function(e){
        $(this).css("color",pollingStateColor["faultType"][pollingState[1][e]]);
    });

}
/*
 * 右侧水泵数据更新，用的自己的表格更新
 * */
function resetPumpInfo(tableId,pumpInfo){
    $("#" + tableId + " td").remove();
    $("#" + tableId + " tr[id!=header]").remove();

    if(pumpInfo != null){
    for (var i in pumpInfo){
        var newTr = document.createElement("tr");
        newTr.id = "pumpTr_"+i;
        $("#" + tableId).append(newTr);
        
        if(Object.keys(pumpInfo[i]).length == 5){
        	pumpInfo[i]["vibration"]="无";
        }

        for (var j in pumpInfoTable){
            var newTd = document.createElement("td");
            newTd.innerHTML = pumpInfo[i][pumpInfoTable[j]];
            newTd.title = pumpInfo[i][pumpInfoTable[j]];
            $("#pumpTr_"+i).append(newTd);
        }
    }
    }

    //行数不够时补足
    if($("#" + tableId + " tr[id!=header]").length < 4){
        var tableLength = 4-$("#" + tableId + " tr[id!=header]").length;
        for(var i=0;i<tableLength;i++){
            var newTr = "<tr>";
            for(var j=0;j<($("#" + tableId + " tr[id=header] th").length + 1);j++)
                newTr += "<td><br></td>";
            $("#" + tableId).append(newTr+"</tr>");
        }
    }
}
/**
 * 分页点击事件*/

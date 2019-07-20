$(document).ready(function() {
	
	menuZoom("subsystemSelect");
	//参数初始化
	initinfo();
	var DataTransfer=new transferData("TreeList","treeList","1",newweb+"Fire/AllbuildingStatus.do",newweb+"Fire/WaterPressureDetailInfo.do");
	DataTransfer.webStart();
});
/*
 * 参数初始化
 * 
 * */
function initinfo() {
    stateinfo={"正常":0};
    newpagenum=1;
    websocketflag=0;
    var page_navigation=document.getElementById("page_navigation");
    var ul=document.createElement("ul");
    page_navigation.appendChild(ul);
}
/*
 * 
 * 楼层点击
 * */
function tree_item(url){
	 $(".tree-item").on("click",function(){
		 $("#informationPictureTitle").html(buildingTitle+$(this).text()+">"+"消防示意图");
		  treefolderheaderFlag=0;//关闭统计信息实时表格的显示
		 var buildingID=$(this).parent().siblings(".tree-folder-header").attr("id");	  
		   	$("#pumpBuilding").text(buildingTitle);	    
		   	myWaterTable.newpagenum = 1;
		   	myWaterTable.IntitialTable();
		    
		    var floor=$(this).text();
		    $("#currentFloor").attr("class","currentFloorStyle");
        	$("#currentFloor").html("> "+"<span>"+floor+"</span>");
		    //改标志位
		    if(websocketflag==0){
		    	startmessage(buildingID,url,floor,myWaterTable);
		         websocketflag++;
		    }
		    else{
		    	 var flag={"sysid":"7","floor":floor,"buildingID":buildingID,"enum":"floorMap"};
		    	 buildstair.alert = true;
			     buildstair.send(JSON.stringify(flag));
		    }
	 });
}
/*
 * 发送点击请求
 * 
 * */
function startmessage(buildingID,url,floorData,myWaterTable){
	if('WebSocket' in window){
	       try{
	       	 buildstair= new WebSocket(url);
	       	 buildstair.alert=true;
	       }catch (e){
	           alert("浏览器不支持WebSocket!");
	       }
	   }else{
	       alert("浏览器不支持WebSocket!");
	   }
	   //向后端传的数据格式
	   function dataSend(){
	       var flag={"sysid":"7","floor":floorData,"buildingID":buildingID,"enum":"floorMap"};
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
		   if(buildmessage.tableHeader == undefined){//第一次发数据，打印图        
			   if(buildmessage.pictureAddress == ''){
		   			$("#informationPicture").css("background",'');
		   			/*$("#subsystemSel").css("display","none");*/	
		   			  nopicture("informationPicture","当前楼层消防示意图不存在");
		   		}else{
		   		 var pictureAddress=buildmessage.pictureAddress	;
		   	     $('#noPicture').remove();
		         $("#informationPicture").css("background","url"+"("+pictureAddress+")");
		         $("#informationPicture").css("background-repeat","no-repeat");
		         $("#informationPicture").css("background-size",$('#informationPicture').css('width')+" "+$('#informationPicture').css('height'));
		   		} 
		   }
		   else{//加载表格
			   
		   	  var option={         		//初始化功能模块
		   	    		tableHeader:buildmessage["tableHeader"],//输入表格显示的表头,参数为数组
		   	    		tableContent:buildmessage["tableContent"],//输入表格内容提供,形式为json，json的value内的数组元素为表头参数需要显示的具体值	
		   	    		sort:function(a,b){
		   	    			if(a[3] != "正常"){
		   	    				stateinfo[a[3]] = 1;
		   	    			}
		   	    			else if(b[3] != "正常"){
		   	    				stateinfo[b[3]] = 1;
		   	    			}
		        			return stateinfo[b[3]]-stateinfo[a[3]];
		        		},               //自定义排序回调函数，根据字符串长短排序
		   	    	};
		   /*	myWaterTable.newpagenum=1;
		   	myWaterTable.IntitialTable();*/
		   	myWaterTable.drawTable(option);
		   	myWaterTable.changeStateColor();
		    if(jsonObjectIsEmpty(buildmessage.tableContent)==true  && buildstair.alert == true){
	    		alert("该楼层暂无数据");//
	    		buildstair.alert = false;
	         }
	  
	   }
    
	}
}



























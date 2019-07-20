$(document).ready(function() {
    menuZoom("functionSelect");
    $.getJSON("js/buildingFloor.js",function(buildingData){
    	var optionForBuildings=buildingData["optionForBuildings"];
    	for(var areaOption in optionForBuildings){
    		$("#"+areaOption).find(".campusInformationDiv span").html(optionForBuildings[areaOption].length-1);
    		for(var buildingKey=1; buildingKey<optionForBuildings[areaOption].length;buildingKey++){
    			buildingList(areaOption,optionForBuildings[areaOption][buildingKey]);
        	}
    	}   	
    	buildingState();
    });
   
});
function buildingState(){
	 var hasClass=false;
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
	    	var paraInfo=eval("(" + evt.data + ")"); 	       
	    	 for(var areaKey in paraInfo){	    		 
	    		 for(var buildingID in paraInfo[areaKey]["buildingDetailInfo"]){
	    			 var monitorNumTotal=parseInt(paraInfo[areaKey]["buildingDetailInfo"][buildingID]["total"]["monitorNumTotal"]);
	    			 var abnormalNumTotal=parseInt(paraInfo[areaKey]["buildingDetailInfo"][buildingID]["total"]["abnormalNumTotal"]);
	    			 var alarmNumTotal=parseInt(paraInfo[areaKey]["buildingDetailInfo"][buildingID]["total"]["alarmNumTotal"]);    			
	    			 if(hasClass==true){//不是第一次输入    			  
	    			   if($("#"+buildingID).find("buildingTitle").hasClass("buildingBack")){//表明上一次有异常，不排序    				   
	    				   if(abnormalNumTotal>0||alarmNumTotal>0){
	    					   
		    				 }else{//排序
		    					/*	$("#"+buildingID).find("buildingTitle").removeClass("buildingBack");  */
		    					    var  buildingText=$("#"+buildingID).html();
		    				     	 $("#"+buildingID).remove();	  
			    				    $("#"+areaKey).find(".buildingBack:last").after("<div class='buildingDiv' id="+buildingID+"></div>");
			    	 				$("#"+buildingID).html(buildingText);	
		    				 }
	    			   }else{//要排序
	    				   if(abnormalNumTotal>0||alarmNumTotal>0){
		    				    var  buildingText=$("#"+buildingID).html();
		    				    $("#"+buildingID).remove();	  
		    				    $("#"+areaKey).find(".campusDetailDiv").prepend("<div class='buildingDiv' id="+buildingID+"></div>");
		    	 				$("#"+buildingID).html(buildingText);	    				
		    	 				$("#"+buildingID).find(".buildingTitle").addClass("buildingBack"); 
		    				 }
	    			   }
	    			 }else{//是第一次输入
	    				 if(abnormalNumTotal>0||alarmNumTotal>0){//排序
	    				    var  buildingText=$("#"+buildingID).html();
	    				    $("#"+buildingID).remove();	  
	    				    $("#"+areaKey).find(".campusDetailDiv").prepend("<div class='buildingDiv' id="+buildingID+"></div>");
	    	 				$("#"+buildingID).html(buildingText);	    				
	    	 				$("#"+buildingID).find(".buildingTitle").addClass("buildingBack"); 
	    	 				hasClass=true;	
	    				 }
	    			 }
	    			 $("#"+buildingID).find("tr:eq(1)").find("td:eq(0)").html(monitorNumTotal);
	    			 $("#"+buildingID).find("tr:eq(1)").find("td:eq(1)").html(abnormalNumTotal);
	    			 $("#"+buildingID).find("tr:eq(1)").find("td:eq(2)").html(alarmNumTotal);
	    			 
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
/**
 * 生成列表楼栋1个
 * */
function buildingList(areaOption,buildingDetailInfo){
	var buildingDiv=document.createElement("div");
	buildingDiv.className="buildingDiv";
	buildingDiv.id=buildingDetailInfo[1];
	$("#"+areaOption).find(".campusDetailDiv").append(buildingDiv);
	var buildingTitle=document.createElement("div");
	buildingTitle.className="buildingTitle";
	buildingTitle.title=buildingDetailInfo[0];
	buildingTitle.innerHTML=buildingDetailInfo[0];
	$("#"+buildingDetailInfo[1]).append(buildingTitle);
	var buildingContent=document.createElement("div");
	buildingContent.className="buildingContent";
	$("#"+buildingDetailInfo[1]).append(buildingContent);
	var tableList='<table class="buildingInformation">';
	 tableList+="<tr><td>监测</td><td>异常</td><td>报警</td></tr>";
	 tableList+="<tr><td></td><td></td><td></td></tr></table>";
	$("#"+buildingDetailInfo[1]).find(".buildingContent").append(tableList);
}

/*
    <div class="buildingDiv">
                                    <div class="buildingTitle">主教学楼</div>
                                    <div class="buildingContent">
                                        <table class="buildingInformation">
                                            <tr>
                                                <td>监测</td>
                                                <td>异常</td>
                                                <td>报警</td>
                                            </tr>
                                            <tr>
                                                <td>2000</td>
                                                <td>100</td>
                                                <td>26</td>
                                            </tr>
                                        </table>

                                    </div>
                                </div> 
 */
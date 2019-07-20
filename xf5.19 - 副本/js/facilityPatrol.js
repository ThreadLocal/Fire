/* 以下是巡检计划列表相关 */
patrolPlanJson = {
    /*"tableItem":{
        "tableHeader":["计划编号","计划名称","发布时间","开始时间","截止时间","巡查区域","负责人","巡查状态","备注"],
        "tableContent":{
            "1":["1","巡查计划1","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教","卫置","未完成","无"],
            "2":["2","巡查计划2","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教","卫置","未完成","无"],
            "3":["3","巡查计划3","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教","卫置","未完成","无"],
            "4":["4","巡查计划4","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教，B区二综","卫置","未完成","无"],
            "5":["5","巡查计划5","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教，B区二综,A区主教，A区五教，B区二综","卫置","未完成","无"],
            "6":["6","巡查计划6","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教，B区二综","卫置","未完成","无"],
            "7":["7","巡查计划7","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教，B区二综","卫置","未完成","无"],
            "8":["8","巡查计划8","2017-04-27","2017-04-28","2017-05-27","A区主教，A区五教，B区二综","卫置","未完成","无"]
        },
        "totalNum":8,
        "page":1,
        "lengthPerPage":10,
        "totalPage":1
    }*/
};

//当前页码
nowPage = {
	"patrolNowTable":1,
	"patrolHistroyTable":1
};
//总页数
totalPage = {
	"patrolNowTable":"",
	"patrolHistroyTable":""
};
numPerPage = 10;			//表格每页的行数

selePlanId = "";			//当前选择的计划ID
selePlanArea = "";			//当前选择的计划区域

/*发送Ajax请求的数据*/
conditionForAjax = {
    "controller":"FacilityPatrolPlanQuery",
    "enum":"facilityPatrolPlanQuery",
    "jsonPara":{}
};


/* 以下是巡检计划具体信息相关 */
submitDataALL={
    "controller":"FacilityPatrolQuery",
    "enum":"facilityPatrolStatus",
    "jsonPara":{
        "page":1,
        "lengthPerPage":15
    }
};
var jsonData1={"patrolPlan":["2017-4-10","2017-5-10"],
               "patrolRate":[200,500],
                "tableBuilding":{"A区":{"主教学楼":["1层","2层","5层","15层"],
                                   "第五教学楼":["1层","3层","5层"],
                                   "第八教学":["1层","2层","5层"]
                                          },
                                   "B区":{"第二综合楼":["1层","2层","5层","8层"]
                                          }
                                   },
                "tableItem":{ "tableHeader": ["序号","设备编号","设施位置","设施类型", "巡查状态", "巡查结果","巡查人","时间"],
                               "tableContent": {
                                                  "8101000000": [ "1","8101000000", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                  "8101000001": [ "2","8101000001", "A区主教10楼","灭火器", "已巡查", "异常","张三","13:20:50"],
                                                  "8101000002": ["3","8101000002","A区主教10楼","灭火器", "已巡查", "异常","张三","13:20:50"],
                                                   "8101000003": ["4","8101000003", "A区主教10楼","灭火器", "已巡查", "异常","张三","13:20:50"],
                                                    "8101000004": [ "5","8101000004", "A区主教10楼","灭火器", "已巡查", "异常","张三","13:20:50"],
                                                   "8101000005": [ "6","8101000005", "A区主教10楼","灭火器", "已巡查", "异常","张三","13:20:50"],
                                                 "8101000006":[ "7",  "8101000006", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                "8101000007": ["8", "8101000007","A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                "8101000008": ["9",  "8101000008",  "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                               "8101000009": [ "10",  "8101000009", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                 "8101000010": [ "11", "8101000010",  "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                 "8101000011": [ "12",  "8101000011","A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                 "8101000012": ["13", "8101000000", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                  "8101000013": ["14","8101000013", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                  "8101000014":[ "15",  "8101000014", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"],
                                                    "8101000015":[ "16",  "8101000015", "A区主教21楼","消防栓" ,"已巡查","异常","王五","13:20:35"]
                                                 },
                                "tablePage":{"page":1,
                                 "allPage":20
                                            }
    }};
/*请求1*/
var requireData1={
   "unitName":"A区",
    "buildingID":"主教学楼",
    "floor":"1层",
    "isPatro":"1",
    "fireFacilityType":"1",
    "patrolIsNormal":"1",
    "page":"1",
    "lengthPerPage":16
};
/*请求2*/
 var submitData2={"controller":"FacilityPatrolQuery",
    "enum":"facilityPatrolStatus",
    "fireFacilityID":"12344"
};
var jsonData={};
var tableitem={};

/*Ajax请求数据*/
function ajaxForPatrolPlanData(tableId,planState){
     conditionForAjax["jsonPara"]={};

     conditionForAjax["jsonPara"]["lengthPerPage"] = numPerPage;
     conditionForAjax["jsonPara"]["page"] = nowPage[tableId];
     conditionForAjax["jsonPara"]["planState"] = planState;
     conditionForAjax["jsonPara"]=JSON.stringify(conditionForAjax["jsonPara"]);

     $.ajax({
    	 type:"post",
    	 url:"../servlet/DispatchServlet",
    	 data:conditionForAjax,
    	 success:function(planData) {
    		 patrolPlanJson = $.parseJSON(planData);  
    		 initTableHeader(tableId,patrolPlanJson["tableItem"]["tableHeader"]);
    		 resetTable(tableId,patrolPlanJson["tableItem"]);

    		 if(planState == "未完成"){
    			 $("#" + tableId + " tr.trRaw").on("click",function(){
    				 $("#show").css("display","none");
    				 $("#showDetail").css("display","block");
    				 $("#returnButton").css("display","block");

    				 var planName = $(this).attr("planName");
    				 var planId = $(this).attr("fireFacilityPatrolPlanID");
    				 var planArea = $(this).attr("planArea");
    				 var planStartTime = $(this).attr("planStartTime");
    				 var planEndTime = $(this).attr("planEndTime");
    				 //巡检计划
    				 $("#planName").html(" > "+planName);
    				 $("#name").html(planName+": ");
    				 $("#time").html(planStartTime+"&nbsp--&nbsp"+planEndTime);
    				 //时间进度
    				 var start_time = new Date(planStartTime);
    				 var end_time = new Date(planEndTime);
    				 var nowTime = new Date();
    				 var totalDays = (end_time.getTime()-start_time.getTime())/(1000*60*60*24);
    				 var nowDays = (nowTime.getTime()-start_time.getTime())/(1000*60*60*24);
    				 if(nowDays < 0){
    					 $("#timePercent").css("width","0");
    				 }
    				 else if(nowDays > totalDays){
    					 $("#timePercent").css("width","100%");
    				 }
    				 else{
    					 $("#timePercent").css("width",nowDays/totalDays*100+"%");
    				 }
    				 
    				 submitDataALL["jsonPara"]["fireFacilityPatrolPlanID"] = planId;
    				 submitDataALL["jsonPara"]["planArea"] = planArea;

    				 selePlanId = planId;
    				 selePlanArea = planArea;
    				 //巡查计划具体信息
    				 ajaxIntial(submitDataALL);
    				 //分页提交
    				 pageClick();

    			 });
    			 ajaxForPatrolPlanData("patrolHistroyTable","已完成");
    		 }
    	 },
    	 error:function() {
    		 //conditionForAjax["jsonPara"]=$.parseJSON(conditionForAjax["jsonPara"]);
    	 }
    });
     
}

/*初始化表头*/
function initTableHeader(tableId,tableHeader){
    $("#" + tableId + " th").remove();
    $("#" + tableId + " tr").remove();

    var newTr = "<tr id='header'><th>序号</th>";
    for (var i in tableHeader){
        var newTd = "<th>" + tableHeader[i] + "</th>";
        newTr += newTd;
    }

    $("#" + tableId).append(newTr + "</tr>");

}
/*重置表格数据*/
function resetTable(tableId,tableData){
    var tableContent = tableData["tableContent"];

    $("#" + tableId + " td").remove();
    $("#" + tableId + " tr[id!=header]").remove();
    $("#allImageFalse").remove();

    if(Object.keys(tableContent).length == 0){
        noData();
    }
    else{
        for (var i in tableContent){
            var newTr = document.createElement("tr");
            newTr.id = tableId+"_planTr_"+i;
            newTr.className = "trRaw";
            $("#" + tableId).append(newTr);

            var index = Number(i);
			var newTd = "<td>"+(numPerPage*(nowPage[tableId]-1)+index)+"</td>";
            $("#"+tableId+"_planTr_"+i).append(newTd);

            for (var j in tableContent[i]){
                var newTd = document.createElement("td");
                newTd.innerHTML = tableContent[i][j];
                newTd.title = tableContent[i][j];
                $("#"+tableId+"_planTr_"+i).append(newTd);
            }

            $("#"+tableId+"_planTr_"+i).attr({
                "fireFacilityPatrolPlanID": tableContent[i][0],
                "planName": tableContent[i][1],
                "planPublicTime": tableContent[i][2],
                "planStartTime": tableContent[i][3],
                "planEndTime":tableContent[i][4],
                "planArea": tableContent[i][5],
                "planManager": tableContent[i][6],
                "planState": tableContent[i][7],
                "remark": tableContent[i][8]
            });
        }

        //行数不够时补足
        if($("#" + tableId + " tr[id!=header]").length < tableData["lengthPerPage"]){
            var tableLength = tableData["lengthPerPage"]-$("#" + tableId + " tr[id!=header]").length;
            for(var i=0;i<tableLength;i++){
                var newTr = "<tr>";
                for(var j=0;j<($("#" + tableId + " tr[id=header] th").length + 1);j++)
                    newTr += "<td><br></td>";
                $("#" + tableId).append(newTr+"</tr>");
            }
        }
    }

    /*重置页码信息*/
    nowPage[tableId] = tableData["page"];
	totalPage[tableId] = tableData["totalPage"];
	$("#"+tableId+"_nowPage").val(nowPage[tableId]);
	$("#"+tableId+"_totalPage").text(totalPage[tableId]);
	$("#"+tableId+"_totalNum").text(tableData["totalNum"]);

    /*更改状态按钮*/
    $(".tdFinish").on("click",function(){
        planId = $(this).parent().attr("fireFacilityPatrolID");
        var finishContent='<span style="display:block;text-align: center;font-size:20px;">确认该计划已经完成</span>'
            +'<span style="display:block;text-align: center;font-size:12px;color:red;">注意：计划确认完成后不可更改</span>'
            +'&nbsp备注：'+'<br>'
            +'<textarea id="remark" rows="4" cols="50" placeholder=""></textarea>'+'<br>'
            +'<div id="submitCheck">'+'&nbsp'+'</div>';
        noticeWindow("巡查计划完成",finishContent,"modifyPatrolPlan");
        event.stopPropagation();
    });

}

/*翻页*/
function pageChange() {
	/*首页*/
	$(".firstPage").on("click",function(){
		var tableId = $(this).attr("tableid");
		if(nowPage[tableId] != 1){
			nowPage[tableId] = 1;
			ajaxForPatrolPlanData(tableId,$(this).attr("planState"));
		}
		else{
			$("#"+tableId+"_nowPage").val(nowPage[tableId]);
		}
	});
	/*尾页*/
	$(".lastPage").on("click",function(){
		var tableId = $(this).attr("tableid");
		if(nowPage[tableId] != totalPage[tableId]){
			nowPage[tableId] = totalPage[tableId];
			ajaxForPatrolPlanData(tableId,$(this).attr("planState"));
		}
		else{
			$("#"+tableId+"_nowPage").val(nowPage[tableId]);
		}
	});
	/*上一页*/
	$(".prePage").on("click",function(){
		var tableId = $(this).attr("tableid");
		if(nowPage[tableId] != 1){
			nowPage[tableId]--;
			ajaxForPatrolPlanData(tableId,$(this).attr("planState"));
		}
		else{
			$("#"+tableId+"_nowPage").val(nowPage[tableId]);
		}
	});
	/*下一页*/
	$(".nextPage").on("click",function(){
		var tableId = $(this).attr("tableid");
		if(nowPage[tableId] != totalPage[tableId]){
			nowPage[tableId]++;
			ajaxForPatrolPlanData(tableId,$(this).attr("planState"));
		}
		else{
			$("#"+tableId+"_nowPage").val(nowPage[tableId]);
		}
	});
	/*页码跳转*/
	$(".nowPage").on("keydown",function(event){
		if( event.which == 13 ){
			var tableId = $(this).attr("tableid");
			var inputPage = $(this).val();
			if(isNaN(inputPage)){
				$("#"+tableId+"_nowPage").val(nowPage[tableId]);
			}
			else{
			if(inputPage<1){
				nowPage[tableId] = 1;
			}
			else if(inputPage>totalPage[tableId]){
				nowPage[tableId] = totalPage[tableId];
			}
			else{
				nowPage[tableId] = inputPage;
			}
			ajaxForPatrolPlanData(tableId,$(this).attr("planState"));
			}
		}
	});
}

/* 重置两个表格数据 */
function resetTableData(){
    ajaxForPatrolPlanData("patrolNowTable","未完成");
}

/*无数据时提示*/
function noData(){
    var allimgFalse=document.createElement("div");
    allimgFalse.id="allImageFalse";
    $("#abnorTableDiv").append(allimgFalse);
    var img = document.createElement("img");
    img.id = "imageFalse";
    img.src="img/noData.png";
    $("#allImageFalse").append(img);
    var imgFalse=document.createElement("span");
    imgFalse.id="imgFalseTest";
    $("#allImageFalse").append(imgFalse);
    $("#imgFalseTest").text("抱歉，未找到相关异常数据");
}

//巡检计划进度等信息更新
function infoReset(info){
    //巡检进度
    $("#facilityPercent").css("width",info["patroledNum"]/info["totalNum"]*100+"%");
    //节点数
    $("#alreadyPatrolDta").text(info["patroledNum"]);
    $("#noPatrolDta").text(info["totalNum"]-info["patroledNum"]);
    $("#normalDta").text(info["normalNum"]);
    $("#abnormalDta").text(info["faultNum"]);
}

$(document).ready(function(){
    menuZoom("subsystemSelect");
    //默认加载所有巡查计划第一页
    resetTableData();
    /* 翻页 */
	pageChange();
    //返回按钮
    $("#returnButton").on("click",function(){
        $("#show").css("display","block");
        $("#showDetail").css("display","none");
        $("#returnButton").css("display","none");

        $("#planName").html("");
    });

});

function ajaxIntial(submitDataALL){
	submitDataALL.jsonPara=JSON.stringify(submitDataALL.jsonPara);
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: submitDataALL,
        dataType: "json",
        success: function (simuData) {
            //进度、节点数量更新
            var infoData = simuData["patrolStatus"];
            infoReset(infoData);
            //调用生成表格程序
          var  tableBuilding=simuData["tableBuilding"];
            var patrolSearch1=new patrolSearch(tableBuilding);
                 patrolSearch1.campusSet();
            tableitem=simuData["tableItem"];
            var selectTable=new tableGenerate(tableitem,"tableTbody");    
               selectTable.initTableHeader();
               selectTable.addTable();
            //按钮提交
            submitSelect(tableBuilding);
            submitDataALL["jsonPara"]=$.parseJSON(submitDataALL["jsonPara"]);
        }
    });
}
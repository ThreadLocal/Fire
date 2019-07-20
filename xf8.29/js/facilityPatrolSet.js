/*巡检计划数据*/
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

ajaxFlag = true;			//是否发送请求的标志

/*发送Ajax请求的数据*/
conditionForAjax = {
	"controller":"FacilityPatrolPlanQuery",
	"enum":"facilityPatrolPlanQuery",
	"jsonPara":{}
};

/*发送表单数据*/
formData = [];
operationState = {
	"addPatrolPlan":"添加",
	"modifyPatrolPlan":"更改"
};

/*Ajax请求数据*/
function ajaxForPatrolPlanData(tableId,planState){
	if(ajaxFlag){
		conditionForAjax["jsonPara"]={};
		ajaxFlag = false;
	
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
					var newTh = "<th>操作</th>";
					$("#patrolNowTable tr[id=header]").append(newTh);
					var $plantr = $("#patrolNowTable tr.trRaw");
					$plantr.each(function(){
						var newEdit = "<td class='tdFinish'>更改状态</td>";
						$(this).append(newEdit);
					});
					ajaxFlag = true;
					ajaxForPatrolPlanData("patrolHistroyTable","已完成");
				}
				//conditionForAjax["jsonPara"]=$.parseJSON(conditionForAjax["jsonPara"]);
				ajaxFlag = true;
				
			},
			error:function() {
				//conditionForAjax["jsonPara"]=$.parseJSON(conditionForAjax["jsonPara"]);
				ajaxFlag = true;
			}
		});
	}
}

/*Ajax发送表单数据*/
function ajaxForForm(operation){
	formData = JSON.stringify(formData);
	$.ajax({
		type:"post",
		url:"../servlet/DispatchServlet",
		data:{"controller":"SystemManagement","system":"fireFacilityPatrolPlan","enum":operation,"jsonPara":formData},
		success:function(data) {

			switch (data){
				case "success":
					switch (operation){
						case "addPatrolPlan":
							/*$("#submitCheck").html(operationState[operation]+"成功");
						 $("input[class='fileInput']").each(function(){
						 $(this).val("");
						 });
						 $("#buildingsSelect input[name='buildingBox']:checked").removeAttr("checked");
						 $("#submitCheck").html(operationState[operation]+"成功");*/
							$("#noticeDiv").remove();
							alert("新增成功");
							break;
						case "modifyPatrolPlan":
							//$("#remark").val("");
							$("#noticeDiv").remove();
							break;
					}
					//$("#submitCheck").html(operationState[operation]+"成功");
					resetTableData();
					break;
				case "error":
					$("#submitCheck").html(operationState[operation]+"失败");
					break;
			}
		},
		error:function() {
			$("#submitCheck").html(operationState[operation]+"失败");
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
		planId = $(this).parent().attr("fireFacilityPatrolPlanID");
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

//表单弹出框
function noticeWindow(titleName,formContent,operation){
	if(typeof($("#noticeDiv")) != undefined){
		$("#noticeDiv").remove();
	}
	var newNoticeDiv = document.createElement("div");
	newNoticeDiv.id = "noticeDiv";
	newNoticeDiv.className = "windowBody";
	$("body").append(newNoticeDiv);
	$("#noticeDiv").css({"width":"420px","z-index":"999","position":"absolute"});

	var newNoticeTitleDiv = document.createElement("div");
	newNoticeTitleDiv.id = "noticeTitleDiv";
	newNoticeTitleDiv.className = "windowTitle";
	$("#noticeDiv").append(newNoticeTitleDiv);
	$("#noticeTitleDiv").html('<span>'+titleName+'</span>'+'<span class="iconfont" id="windowClose">'+'&#xf081'+'</span>');
	$("#noticeTitleDiv").css({'background-color':'rgb(44, 146, 146)','color':'#fff'});

	var newNoticeContentDiv = document.createElement("div");
	newNoticeContentDiv.id = "newNoticeContentDiv";
	$("#noticeDiv").append(newNoticeContentDiv);

	var contentFormDiv = document.createElement("div");
	contentFormDiv.id = "contentFormDiv";
	$("#newNoticeContentDiv").append(contentFormDiv);
	$("#contentFormDiv").html('<form>'+formContent
		+'<input name="sure" type="button" value="确定" id="newButtonDiv1" class="newButtonDiv">'
		+'<input name="no" type="button" value="取消" id="newButtonDiv2" class="newButtonDiv">'
		+'</form>');

	$("#noticeDiv").draggable({
		handle:'#noticeTitleDiv'
	});

	$("#windowClose").on("click",function(){
			$("#noticeDiv").fadeOut(0,function(){
				$("#noticeDiv").remove();
			});
		}
	);

	$("#noticeDiv").on("click",function(){
		event.stopPropagation();
	});

	$(document).click(function(){
		$("#noticeDiv").fadeOut(0,function(){
			$("#noticeDiv").remove();
		});
	});

	/*表单提交按钮*/
	$("#newButtonDiv1").on("click",function() {
		switch (operation) {
			case "addPatrolPlan":
				submitAddInfo(operation);
				break;
			case "modifyPatrolPlan":
				submitModifyInfo(operation);
				break;
		}
		event.stopPropagation();
	});

	$("#newButtonDiv2").on("click",function(){
			$("#noticeDiv").fadeOut(0,function(){
				$("#noticeDiv").remove();
			});
			event.stopPropagation();
		}
	);
}

/* 新增的提交 */
function submitAddInfo(operation){
	formData = [];
	/* 输入框信息读取 */
	var $editInput = $("input[class='fileInput']");
	var submitWarning = "";
	$editInput.each(function(){
		var value = $(this).val();
		if($(this).attr("necessity") == "1" && value == ""){
			submitWarning = submitWarning + $(this).attr("chName") + "&nbsp&nbsp";
		}
		formData.push($(this).val());
	});
	/* 负责人员读取 */
	if($("#planManager option:selected").val() == ""){
		submitWarning += "负责人员&nbsp&nbsp";
	}
	else {
		var selectManager = $("#planManager option:selected").text();
		formData.push(selectManager);
	}
	/* 选择楼栋读取 */
	var selectBuilding = [];
	$("#buildingsSelect input[name='buildingBox']:checked").each(function(){
		var campus = $(this).parent().parent().attr("campus");
		var building = $(this).next().text();
		selectBuilding.push(campus + building);
	});
	if(selectBuilding == ""){
		submitWarning += "巡查区域&nbsp&nbsp";
	}
	else{
		formData.push(selectBuilding.join(","));
	}
	if(submitWarning == ""){
		ajaxForForm(operation);
	}
	else {
		$("#submitCheck").html(submitWarning+"不能为空");
	}
}
/* 修改状态的提交 */
function submitModifyInfo(operation){
	formData = [];

	formData.push(planId);
	formData.push("已完成");
	formData.push($("#remark").val());

	ajaxForForm(operation);

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
//新增的弹框中负责人员下拉菜单加载
function addStaffList(){
	for ( i in optionForManagers) {
		var newOption = document.createElement("option");
		newOption.value = optionForManagers[i][0];
		newOption.text = optionForManagers[i][1];

		$("#planManager").append(newOption);
	}
}

//新增的弹框中楼栋列表加载
function addBuildingList(){
	for(var i in optionForBuildings){
		var areaDiv = document.createElement("div");
		areaDiv.className = "areaDiv";
		areaDiv.id = "area_" + i;
		$("#buildingsSelect").append(areaDiv);
		$("#area_"+i).attr("campus",i);

		var areaTitleDiv = document.createElement("div");
		areaTitleDiv.className = "areaTitleDiv";
		areaTitleDiv.id = "areaTitleDiv_"+i;
		$("#area_"+i).append(areaTitleDiv);
		$("#areaTitleDiv_"+i).html(i);

		var buildinglist=document.createElement("div");
		buildinglist.className = "buildinglist";
		buildinglist.id = "buildinglist_"+i;
		$("#area_"+i).append(buildinglist);
		$("#buildinglist_"+i).attr("campus",i);

		for(var j= 1;j<optionForBuildings[i].length;j++){
			var buildingDiv = document.createElement("div");
			buildingDiv.className = "buildingDiv";
			buildingDiv.id = "buildingDiv_"+i+"_"+j;
			$("#buildinglist_"+i).append(buildingDiv);
			var checkbox=document.createElement("input");
			checkbox.id ="buildingDiv_"+i+"_"+j+"_input";
			checkbox.type="checkbox";
			checkbox.name ="buildingBox";
			checkbox.style.float="left";
			$("#buildingDiv_"+i+"_"+j).append(checkbox);
			var label=document.createElement("label");
			label.htmlFor="buildingDiv_"+i+"_"+j+"_input";
			label.innerHTML=optionForBuildings[i][j][0];
			$("#buildingDiv_"+i+"_"+j).append(label);

		}
	}
}

$(document).ready(function() {
//	menuZoom("functionSelect");
	//默认加载所有巡查计划第一页
	resetTableData();
	/* 翻页 */
	pageChange();
	
	$.getJSON("../xf5.19/js/buildingFloor.js",function(buildingData) {
		optionForCampus = buildingData["optionForCampus"];
		optionForBuildings = buildingData["optionForBuildings"];
		optionForFloors = buildingData["optionForFloors"];
		optionForManagers = buildingData["optionForManagers"];
	
		/*新增按钮*/
		$("#uploadbutton").on("click",function(){
			var formContent='<span style="color:red">*</span>'+'&nbsp计划名称：'+'<input name="planName" type="text" value="" class="fileInput" chname="计划名称" necessity="1">'+'<br>'
				+'<span style="color:red">*</span>'+'&nbsp开始时间：'+'<input name="planStartTimr" type="date" value="" class="fileInput" chname="开始时间" necessity="1">'+'<br>'
				+'<span style="color:red">*</span>'+'&nbsp截止时间：'+'<input name="planEndTime" type="date" value="" class="fileInput" chname="截止时间" necessity="1">'+'<br>'
				+'<span style="color:red">*</span>'+'&nbsp负责人员：'+'<select id="planManager" name="planManager" class="fileInput" chname="负责人员" necessity="1"><option value="">请选择</option></select>'+'<br>'
				+'<span style="color:red">*</span>'+'&nbsp巡查区域：'+'<div id="buildingsSelect"></div>'
				+'<div id="submitCheck">'+'&nbsp'+'</div>';
			noticeWindow("新增巡查计划",formContent,"addPatrolPlan");
			addStaffList();
			addBuildingList();
			event.stopPropagation();
		});
	});

});
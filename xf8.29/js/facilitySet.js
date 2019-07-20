/*设备表格数据*/
equipmentDataJson = {
	/*"tableItem":{
		"tableHeader":["设备编号","设备类型","校区","楼栋","楼层","生产日期","安装日期"],
		"tableContent":{
			"1":["8101000034","消火栓","A区","主教","7层","2017-05-22","2017-05-22"],
			"2":["8110100034","消火栓","B区","二综","24层","2017-05-22","2017-05-22"],
			"3":["8110110024","灭火器","B区","二综","8层","2017-05-22","2017-05-22"],
			"4":["8101110034","灭火器","A区","五教","0层","2017-05-22","2017-05-22"],
			"5":["8110100024","消火栓","B区","二综","8层","2017-05-22","2017-05-22"],
			"6":["8101010034","灭火器","A区","主教","7层","2017-05-22","2017-05-22"],
			"7":["8101000024","消火栓","A区","主教","16层","2017-05-22","2017-05-22"],
			"8":["8101100024","消火栓","A区","五教","2层","2017-05-22","2017-05-22"],
			"9":["8101100034","消火栓","A区","五教","0层","2017-05-22","2017-05-22"],
			"10":["8110110034","灭火器","B区","二综","24层","2017-05-22","2017-05-22"],
			"11":["8101110024","灭火器","A区","五教","2层","2017-05-22","2017-05-22"],
			"12":["8101010024","灭火器","A区","主教","16层","2017-05-22","2017-05-22"],
			"13":["8110100041","消火栓","B区","二综","5层","2017-05-21","2017-05-21"],
			"14":["8101110041","灭火器","A区","五教","1层","2017-05-21","2017-05-21"],
			"15":["8101100041","消火栓","A区","五教","1层","2017-05-21","2017-05-21"],
			"16":["8110110041","灭火器","B区","二综","5层","2017-05-21","2017-05-21"],
			"17":["8101010041","灭火器","A区","主教","5层","2017-05-21","2017-05-21"],
			"18":["8101000041","消火栓","A区","主教","5层","2017-05-21","2017-05-21"],
			"19":["8101010045","灭火器","A区","主教","24层","2017-05-20","2017-05-20"],
			"20":["8101000045","消火栓","A区","主教","24层","2017-05-20","2017-05-20"],
			"21":["8101000031","消火栓","A区","主教","19层","2017-05-20","2017-05-20"],
			"22":["8101100031","消火栓","A区","五教","2层","2017-05-20","2017-05-20"],
			"23":["8101110045","灭火器","A区","五教","1层","2017-05-20","2017-05-20"],
			"24":["8101010031","灭火器","A区","主教","19层","2017-05-20","2017-05-20"]
		},
		"totalNum":300,
		"page":1,
		"lengthPerPage":24,
		"totalPage":13}*/
};

conditionSele = {
	"fireFacilityType":"",	//当前选中的设备种类
	"fire_unit.unitID":"",	//当前选中的校区
	"buildingID":""			//当前选中的楼栋
};

conditionSeleIndex = {
	"fireFacilityType":0,	//当前选中的设备种类序号
	"fire_unit.unitID":0,	//当前选中的校区序号
	"buildingID":0			//当前选中的楼栋序号
};

fuzzyCondition = "";		//模糊搜索的输入条件

nowPage = 1;				//当前页码
totalPage = "";				//总页数
numPerPage = 25;			//表格每页的行数

noticeDiv_X = "803px";       //弹出框的left
noticeDiv_Y = "288px";       //弹出框的top

ajaxFlag = true;			//是否发送请求的标志

/*发送Ajax请求的数据*/
conditionForAjax = {
	"controller":"FacilityQuery",
	"enum":"facilityScreen",
	"jsonPara":{}
};

/*发送表单数据*/
formData = [];
operationState = {
	"addDevice":"添加",
	"modifyDevice":"修改"
};

deleteEquip = [];			//要删除的设备ID
/*Ajax请求数据*/
function ajaxForAbnormalData(){
	if(ajaxFlag){
		
		ajaxFlag = false;
	
		conditionForAjax["jsonPara"]["lengthPerPage"] = numPerPage;
		conditionForAjax["jsonPara"]["page"] = nowPage;	
		conditionForAjax["jsonPara"]=JSON.stringify(conditionForAjax["jsonPara"]);
	
		$.ajax({
			type:"post",
			url:"../servlet/DispatchServlet",
			data:conditionForAjax,
			success:function(abnormalData) {
				equipmentDataJson = $.parseJSON(abnormalData);

				initTableHeader("abnorTable",equipmentDataJson["tableItem"]["tableHeader"]);
				resetTable("abnorTable",equipmentDataJson["tableItem"]);
				conditionForAjax["jsonPara"]=$.parseJSON(conditionForAjax["jsonPara"]);
				ajaxFlag = true;
			},
			error:function() {
				conditionForAjax["jsonPara"]=$.parseJSON(conditionForAjax["jsonPara"]);
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
		data:{"controller":"SystemManagement","system":"facility","enum":operation,"jsonPara":formData},
		success:function(data) {

			switch (data){
				case "success":
					/*$("#submitCheck").html(operationState[operation]+"成功");
					$("input[class='fileInput']").each(function(){
						$(this).val("");
					});*/
					$("#noticeDiv").remove();
                	alert(operationState[operation]+"成功");
					ajaxForAbnormalData();
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

	var newTr = "<tr id='header'><th><input id='checkAll' type='checkbox' /></th><th>序号</th>";
	for (var i in tableHeader){
		var newTd = "<th>" + tableHeader[i] + "</th>";
		newTr += newTd;
	}
	newTr += "<th>操作</th><th>操作</th>";
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
			newTr.id = "abnormalTr_"+i;
			newTr.className = "trRaw";
			$("#" + tableId).append(newTr);

			var newBox = "<td><input type='checkbox' name='deleteBox' /></td> ";
			$("#abnormalTr_"+i).append(newBox);

			var index = Number(i);
			var newTd = "<td>"+(numPerPage*(nowPage-1)+index)+"</td>";
			$("#abnormalTr_"+i).append(newTd);

			for (var j in tableContent[i]){
				var newTd = document.createElement("td");
				newTd.innerHTML = tableContent[i][j];
				newTd.title = tableContent[i][j];
				$("#abnormalTr_"+i).append(newTd);
			}

			var newEdit = "<td class='edit'>修改信息</td>";
			$("#abnormalTr_"+i).append(newEdit);
			
			var newQRCode = "<td class='code'>生成二维码</td>";
			$("#abnormalTr_"+i).append(newQRCode);

			$("#abnormalTr_"+i).attr({
				"fireFacilityID": tableContent[i][0],
				"fireFacilityType": tableContent[i][1],
				"unitName": tableContent[i][2],
				"buildingID": tableContent[i][3],
				"floor":tableContent[i][4],
				"facilityProduceTime": tableContent[i][6],
				"facilityInstallTime": tableContent[i][7]
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
	nowPage = tableData["page"];
	totalPage = tableData["totalPage"];
	$("#nowPage").val(nowPage);
	$("#totalPage").text(totalPage);
	$("#totalNum").text(tableData["totalNum"]);

	/*全选框*/
	$("#checkAll").click(function() {
		$('input[name="deleteBox"]').prop("checked",this.checked);
	});
	var $subBox = $("input[name='deleteBox']");
	$subBox.click(function(){
		$("#checkAll").prop("checked",$subBox.length == $("input[name='deleteBox']:checked").length ? true : false);
	});
	
	/*修改按钮*/
	$(".edit").on("click",function(){
		var $this = $(this);
		noticeWindow("修改设备信息","modifyDevice");
		var $editInput = $("input[class='fileInput']");
		/*for(var i in $editInput){
			$editInput[i].attr("value",$(this).parent().attr($editInput[i].attr("name")));
		}*/
		$editInput.each(function(){
			$(this).attr("value",$this.parent().attr($(this).attr("name")));
		});

		var $editSelect = $("select[class='fileSelect']");
		$editSelect.each(function(){
			var value = $this.parent().attr($(this).attr("name"));
			for(var i in $(this).children()){
				if(value == $(this).children().eq(i).text()){
					$(this).children().eq(i).prop("selected","selected");
					$(this).change();
					break;
				}
			}
		});
		event.stopPropagation();
	});
	/*生成二维码按钮*/
	$(".code").on("click",function(){
		var $this = $(this);
		var codeInfo = [];
		codeInfo.push($this.parent().attr("fireFacilityID"));
		codeInfo.push($this.parent().attr("fireFacilityType"));
		codeInfo.push($this.parent().attr("unitName"));
		codeInfo.push($this.parent().attr("buildingID"));
		codeInfo.push($this.parent().attr("floor"));
		codeInfo = JSON.stringify(codeInfo);
		$.ajax({
			type:"post",
			url:"../servlet/DispatchServlet",
			data:{"controller":"QrCode","jsonPara":codeInfo},
			success:function(data) {
				if(data == "false"){
					alert("生成二维码失败");
				}
				else{
					var newCode = "../"+data;
					window.open(newCode,"QrCode","height=700,width=600,top=200,left=600");
				}
			}
		});
		event.stopPropagation();
	});
}

/*翻页*/
function pageChange() {
	/*首页*/
	$("#firstPage").on("click",function(){
		if(nowPage != 1){
			nowPage = 1;
			ajaxForAbnormalData();
		}
		else{
			$("#nowPage").val(nowPage);
		}
	});
	/*尾页*/
	$("#lastPage").on("click",function(){
		if(nowPage != totalPage){
			nowPage = totalPage;
			ajaxForAbnormalData();
		}
		else{
			$("#nowPage").val(nowPage);
		}
	});
	/*上一页*/
	$("#prePage").on("click",function(){
		if(nowPage != 1){
			nowPage--;
			ajaxForAbnormalData();
		}
		else{
			$("#nowPage").val(nowPage);
		}
	});
	/*下一页*/
	$("#nextPage").on("click",function(){
		if(nowPage != totalPage){
			nowPage++;
			ajaxForAbnormalData();
		}
		else{
			$("#nowPage").val(nowPage);
		}
	});
	/*页码跳转*/
	$("#nowPage").on("keydown",function(event){
		if( event.which == 13 ){
			var inputPage = $("#nowPage").val();
			if(isNaN(inputPage)){
				$("#nowPage").val(nowPage);
	    	}
	    	else{
			if(inputPage<1){
				nowPage = 1;
			}
			else if(inputPage>totalPage){
				nowPage = totalPage;
			}
			else{
				nowPage = inputPage;
			}
			ajaxForAbnormalData();
	    	}
		}
	});
}

//调出弹框，表格点击事件
function noticeWindow(titleName,operation){
	if(typeof($("#noticeDiv")) != undefined){
		$("#noticeDiv").remove();
	}
	var newNoticeDiv = document.createElement("div");
	newNoticeDiv.id = "noticeDiv";
	newNoticeDiv.className = "windowBody";
	newNoticeDiv.style.left = noticeDiv_X;
	newNoticeDiv.style.top = noticeDiv_Y;
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
	var formContent='<span style="color:red">*</span>'+'&nbsp设备编号：'+'<input name="fireFacilityID" type="text" value="" maxlength="10" class="fileInput" chname="设备编号" necessity="1">'+'&nbsp&nbsp(10位数字编号)'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp设备类型：'+'<input name="fireFacilityType" type="text" value="" class="fileInput" chname="设备类型" necessity="1">'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp所在校区：'+'<select id="addCampus" name="unitName" class="fileSelect" chname="所在校区" necessity="1"></select>'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp所在楼栋：'+'<select id="addBuilding" name="buildingID" class="fileSelect" chname="所在楼栋" necessity="1"><option>请选择</option></select>'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp所在楼层：'+'<select id="addFloor" name="floor" class="fileSelect" chname="所在楼层" necessity="1"><option>请选择</option></select>'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp生产日期：'+'<input name="facilityProduceTime" type="date" value="" class="fileInput" chname="生产日期" necessity="1">'+'<br>'
		+'<span style="color:red">*</span>'+'&nbsp安装日期：'+'<input name="facilityInstallTime" type="date" value="" class="fileInput" chname="安装日期" necessity="1">'+'<br>'
		+'<div id="submitCheck">'+'&nbsp'+'</div>';
	$("#contentFormDiv").html('<form>'+formContent
		+'</form>'+
		'<input name="sure" type="button" value="确定" id="newButtonDiv1" class="newButtonDiv">'
		+'<input name="no" type="button" value="取消" id="newButtonDiv2" class="newButtonDiv">'
		);
	if(operation=="modifyDevice"){
    	$("[name=fireFacilityID]").attr("disabled","disabled");
    }

	/* 加载校区下拉框 */
	var allCampus = $.extend(true,[],optionForCampus);
	allCampus[0][0] = "请选择";
	resetSelectforSearch("addCampus",allCampus,0);
	$("#addCampus").change(function(){
		var selectedCampus = $('#addCampus option:selected').text();
		var allBuildings = $.extend(true,[],optionForBuildings[selectedCampus]);
		allBuildings[0][0] = "请选择";;
		resetSelectforSearch("addBuilding",allBuildings,0);
		$("#addBuilding").change(function(){
			var selectedBuilding = $('#addBuilding option:selected').attr("searchId");
			var allFloors = $.extend(true,[],optionForFloors[selectedCampus][selectedBuilding]);
			allFloors.unshift("请选择");
			$("#addFloor option").remove();
			for ( i in allFloors) {
				var newOption = document.createElement("option");
				newOption.value = i;
				newOption.text = allFloors[i];
				$("#addFloor").append(newOption);
			}
		});
	});

	$("#noticeDiv").draggable({
		handle:'#noticeTitleDiv',
		stop: function(){
			noticeDiv_X = $("#noticeDiv").css("left");
			noticeDiv_Y = $("#noticeDiv").css("top");
		}
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
	$("#newButtonDiv1").on("click",function(){
			formData = [];
			var $editInput = $("input[class='fileInput']");
			var $editSelect = $("select[class='fileSelect']");
			var submitWarning = "";
			$editInput.each(function(){
				var value = $(this).val();
				if($(this).attr("necessity") == "1" && value == ""){
					submitWarning = submitWarning + $(this).attr("chName") + "&nbsp&nbsp";
				}
				formData.push(value);
			});
			$editSelect.each(function(){
				var value = $(this).children("option:selected").text();
				if($(this).attr("necessity") == "1" && value == "请选择"){
					submitWarning = submitWarning + $(this).attr("chName") + "&nbsp&nbsp";
				}
				formData.push(value);
			});
			if(submitWarning == ""){
				ajaxForForm(operation);
			}
			else {
				$("#submitCheck").html(submitWarning+"不能为空");
			}
			event.stopPropagation();
		}
	);
	$("#newButtonDiv2").on("click",function(){
			$("#noticeDiv").fadeOut(0,function(){
				$("#noticeDiv").remove();
			});
			event.stopPropagation();
		}
	);
}

//删除设备
function ajaxForDelete(){
	deleteEquip = JSON.stringify(deleteEquip);

	$.ajax({
		type:"post",
		url:"../servlet/DispatchServlet",
		/*data:{"controller":"Delete","Id":deleteEquip,"IdName":"fireFacilityID","formName":"fire_facility"},*/
		data:{"controller":"SystemManagement","system":"facility","enum":"deleteDevice","jsonPara":deleteEquip},
		success:function(deleteData) {
			switch (deleteData){
				case "success":
					alert("删除成功");
					ajaxForAbnormalData();
					break;
				case "error":
					alert("删除失败");
					break;
			}
		},
		error:function() {
			alert("删除失败");
		}
	});
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
	$("#imgFalseTest").text("抱歉，未找到相关设备数据");
}

/*重置筛选条件下拉框*/
/*传入参数
 selectId：筛选框的Id
 options：下拉框的选项
 optionSelected：当前选择的选项序号
* */
function resetSelectforSearch(selectId,options,optionSelected){
	$("#"+selectId+" option").remove();

	for ( i in options) {
		var newOption = document.createElement("option");
		newOption.value = i;
		newOption.text = options[i][0];
		newOption.setAttribute("searchId",options[i][1]);

		if (optionSelected == i) {
			newOption.selected = "selected";
		}
		$("#"+selectId).append(newOption);
	}
}
/*初始化筛选条件下拉框*/
function initSelectOption(){
	/*所有校区所有楼栋组装*/
	var allBuildings = [];
	for(var i in optionForBuildings){
		var buildings = $.extend(true,[],optionForBuildings[i]);
		buildings.shift();      //删除数组第一个元素（所有楼栋）
		allBuildings.push.apply(allBuildings,buildings);
	}
	optionForBuildings["所有校区"] = [];
	optionForBuildings["所有校区"] = $.extend(true,[],allBuildings);
	optionForBuildings["所有校区"].unshift(optionForBuildings["A区"][0]);

	initSelect();
}

/*重置筛选条件下拉框*/
function initSelect(){
	resetSelectforSearch("selectType",optionForEquipmentType,conditionSeleIndex["equipmentType"]);
	/*resetSelectforSearch("selectSystem",optionForSubSystem,conditionSeleIndex["id"]);*/
	resetSelectforSearch("selectsquare",optionForCampus,conditionSeleIndex["fire_unit.unitID"]);
	resetSelectforSearch("selectbuilding",optionForBuildings["所有校区"],conditionSeleIndex["buildingID"]);
	/*resetSelectforSearch("selectHandle",optionForAbnormalStatus,conditionSeleIndex["mvfaultDealState"]);*/
}

/*条件筛选与模糊查询的切换*/
function searchChange(){
	$(".search-title").click(function(){
		$(".Detail-search").toggle();
		$(".Fuzz-search").toggle();
		resetSearch();
	});
}

/*搜索条件重置*/
function resetSearch(){
	$('*').stop();

	for (var i in conditionSeleIndex){
		conditionSeleIndex[i] = 0;
	}
	for (var i in conditionSele){
		conditionSele[i] = "";
	}
	initSelect();

	fuzzyCondition = "";
	$("#fuzzySearch").val("");

	nowPage = 1;
	conditionForAjax["jsonPara"] = {};	//发送条件重置
	ajaxForAbnormalData();
}


$(document).ready(function() {
//	menuZoom("functionSelect");
	//默认加载所有异常第一页
	ajaxForAbnormalData();
	pageChange();

	$.getJSON("../xf5.19/js/buildingFloor.js",function(buildingData) {
		optionForCampus = buildingData["optionForCampus"];
		optionForBuildings = buildingData["optionForBuildings"];
		optionForFloors = buildingData["optionForFloors"];

		/*初始化条件筛选下拉框*/
		initSelectOption();
		searchChange();
		/*条件筛选框中  校区与楼栋的联动*/
		$("#selectsquare").change(function () {
			conditionSeleIndex["fire_unit.unitID"] = $('#selectsquare option:selected').val();
			var campusSele = $('#selectsquare option:selected').text();
			conditionSeleIndex["buildingID"] = 0;
			conditionSele["buildingID"] = "";
			delete conditionForAjax["jsonPara"]["buildingID"];
			resetSelectforSearch("selectbuilding", optionForBuildings[campusSele], conditionSeleIndex["buildingID"]);
		});

		/*筛选条件获取*/
		$(".selectResult").change(function () {
			var currentSelect = $(this).attr("condition");
			conditionSeleIndex[currentSelect] = $(this).children("option:selected").val();
			conditionSele[currentSelect] = $(this).children("option:selected").attr("searchId");
			if (conditionSele[currentSelect] != "0") {
				conditionForAjax["jsonPara"][currentSelect] = conditionSele[currentSelect];
			}
			else {
				delete conditionForAjax["jsonPara"][currentSelect];
			}
		});

		/*回车提交输入值*/
		$("#fuzzySearch").on("keydown", function (event) {
			if (event.which == 13) {
				$("#searchSubmit").click();
			}
		});

		/*提交按钮*/
		$("#searchSubmit").on("click", function () {
			fuzzyCondition = $("#fuzzySearch").val();//模糊查询输入获取
			if (fuzzyCondition != "") {
				conditionForAjax["jsonPara"]["fuzzyPara"] = fuzzyCondition;
			}
			else {
				delete conditionForAjax["jsonPara"]["fuzzyPara"];
			}
			nowPage = 1;
			ajaxForAbnormalData();
		});
		/*重置按钮*/
		$("#searchReset").on("click", function () {
			resetSearch();
		});
	
	});

		/*新增按钮*/
		$("#add").on("click",function(){
			noticeWindow("新增设备","addDevice");
			event.stopPropagation();
		});
		/*删除按钮*/
		$("#delete").on("click",function() {
			deleteEquip = [];
			$("input[name='deleteBox']:checked").each(function(){
				deleteEquip.push($(this).parent().parent().attr("fireFacilityID"));
			});
			if(deleteEquip.length != 0){
				ajaxForDelete();
			}
			else{
				alert("请选择删除条目");
			}
			event.stopPropagation();
		});
	
	
});
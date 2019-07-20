/*设备表格数据*/
equipmentDataJson = {};

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

/*
noticeDiv_X = "803px";       //弹出框的left
noticeDiv_Y = "288px";       //弹出框的top
*/

/*nodeStatusColor = {
	"火警": "#DD5044",  //火警为红色
	"故障": "#E88604",  //故障为橙色
	"预警": "#FFCE43"   //预警为黄色
};*/

ajaxFlag = true;			//是否发送请求的标志

/*发送Ajax请求的数据*/
conditionForAjax = {
	"controller":"FacilityQuery",
	"enum":"facilityScreen",
	"jsonPara":{}
};

/*Ajax请求异常数据*/
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
				abnormalDataJson = $.parseJSON(abnormalData);
				initTableHeader("abnorTable",abnormalDataJson["tableItem"]["tableHeader"]);
				resetTable("abnorTable",abnormalDataJson["tableItem"]);
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
			newTr.id = "abnormalTr_"+i;
			newTr.className = "trRaw";
			$("#" + tableId).append(newTr);

			var index = Number(i);
			var newTd = "<td>"+(numPerPage*(nowPage-1)+index)+"</td>";
			$("#abnormalTr_"+i).append(newTd);

			for (var j in tableContent[i]){
				var newTd = document.createElement("td");
				newTd.innerHTML = tableContent[i][j];
				newTd.title = tableContent[i][j];
				$("#abnormalTr_"+i).append(newTd);
			}
			$("#abnormalTr_"+i).attr({
				"nodeID": tableContent[i][0],
				"location": tableContent[i][3]+tableContent[i][4],
				"faultTime": tableContent[i][6],
				"faultCategory": tableContent[i][2],
				"mvfaultDealState": tableContent[i][7]
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
		
		//异常设备标红
		$(".trRaw").each(function(){
			var equipStatus = $(this).children().eq(6).text();
			if(equipStatus != "正常"){
				$(this).css("color","red");
			}
		});
	}
	
	/*重置页码信息*/
	nowPage = tableData["page"];
	totalPage = tableData["totalPage"];
	$("#nowPage").val(nowPage);
	$("#totalPage").text(totalPage);
	$("#totalNum").text(tableData["totalNum"]);

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
	menuZoom("functionSelect");
	//默认加载所有异常第一页
	ajaxForAbnormalData();
	pageChange();

	$.getJSON("js/buildingFloor.js",function(buildingData) {
		optionForCampus = buildingData["optionForCampus"];
		optionForBuildings = buildingData["optionForBuildings"];
		optionForFloors = buildingData["optionForFloors"];
		
	searchChange();

	/*初始化条件筛选下拉框*/
	initSelectOption();

	/*条件筛选框中  校区与楼栋的联动*/
	$("#selectsquare").change(function(){
		conditionSeleIndex["fire_unit.unitID"] = $('#selectsquare option:selected').val();
		var campusSele = $('#selectsquare option:selected').text();
		conditionSeleIndex["buildingID"] = 0;
		conditionSele["buildingID"] = "";
		delete conditionForAjax["jsonPara"]["buildingID"];
		resetSelectforSearch("selectbuilding",optionForBuildings[campusSele],conditionSeleIndex["buildingID"]);
	});

	/*筛选条件获取*/
	$(".selectResult").change(function(){
		var currentSelect = $(this).attr("condition");
		conditionSeleIndex[currentSelect] = $(this).children("option:selected").val();
		conditionSele[currentSelect] = $(this).children("option:selected").attr("searchId");
		if(conditionSele[currentSelect] != "0"){
			conditionForAjax["jsonPara"][currentSelect] = conditionSele[currentSelect];
		}
		else{
			delete conditionForAjax["jsonPara"][currentSelect];
		}
	});

	/*回车提交输入值*/
	$("#fuzzySearch").on("keydown",function(event){
		if( event.which == 13 ){
			$("#searchSubmit").click();
		}
	});

	/*提交按钮*/
	$("#searchSubmit").on("click",function(){
		fuzzyCondition = $("#fuzzySearch").val();//模糊查询输入获取
		if(fuzzyCondition != ""){
			conditionForAjax["jsonPara"]["fuzzyPara"] = fuzzyCondition;
		}
		else{
			delete conditionForAjax["jsonPara"]["fuzzyPara"];
		}
		nowPage = 1;
		ajaxForAbnormalData();
	});
	/*重置按钮*/
	$("#searchReset").on("click",function(){
		resetSearch();
	});
	});
});
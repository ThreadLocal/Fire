/**
 * Created by sponge on 2017/8/30.
 */
var noticeWidth = "400px";/* 弹框宽度 */
var noticeHeight = "600px";/* 弹框高度 */
var allAreaMaxBuildId = {
	"A区" : 0,
	"B区" : 0,
	"C区" : 0
};
var svg_array = [];// 用于存储所有上传的svg(暂时只处理联网报警系统)以更新点位
// 以系统为基础发送楼栋所有相关信息请求
function getSystemBuildingInform(systemCode) {
	$.ajax({
				type : "post",
				url : "../servlet/DispatchServlet",
				dataType : "json",
				data : {
					"controller" : "BuildingManage",
					"system" : systemCode
				},
				success : function(data) {
					 allBuildingData = data;// 获取所有楼栋相关信息
					for ( var build_area in allBuildingData) {
						var maxBuildingID = allBuildingData[build_area][2];// 获取各区最大楼栋ID数
						var areaTotalNum = allBuildingData[build_area][1];// 获取各区楼栋总数
						$("#" + build_area).find(".campusInformationDiv").eq(0).find("span").eq(0).text(areaTotalNum);
						allAreaMaxBuildId[build_area] = maxBuildingID;
						for ( var build_name in allBuildingData[build_area][0]) {
							var buildInformDiv = '<div class="buildingDiv" newPic="" area='
									+ build_area
									+ ' buildId='
									+ allBuildingData[build_area][0][build_name][4]
									+ ' buildName='
									+ build_name
									+ '><div class="buildingTitle" title='
									+ build_name
									+ '>'
									+ build_name
									+ '</div><div class="buildingContent"><ul><li>监测楼层数：<span>'
									+ allBuildingData[build_area][0][build_name][1]
									+ '</span></li><li>平面图数：<span>'
									+ allBuildingData[build_area][0][build_name][2]
									+ '</span></li></ul></div></div>';
							$("#" + build_area).find(".campusDetailDiv").eq(0).append(buildInformDiv);
						}
					}
					// 修改楼栋监听
					$(".buildingDiv").on("click",function() {
										var area = $(this).attr("area");
										var buildId = $(this).attr("buildId");
										var builidingDiv_div = $(this);
										var buildName = $(this).attr("buildName");
										var change_inform = [ '<div type="text" class="fileInput" buildId='
												+ buildId
												+ ' style="margin-left:16px;color:#6a6f77;">'
												+ buildName + '</div>' ];
										change_inform[1] = area;
										change_inform[2] = buildName;
										change_inform[3] = buildId;
										noticeWindow("修改楼栋信息", change_inform,
												builidingDiv_div);// 弹出框加载后可绑定楼栋上传功能
										addBuildingFloor(area, buildName);// 添加楼层信息
										changePicture(); // 绑定上传楼栋、楼层信息
										addNewFloorClick(); // 添加新增楼层事件及其子事件
										$("#newButtonDiv1").click(function() { // 提交结果程序
											detailResult(systemCode); // 提交处理函数
										});
									});
					// 新增楼栋监听
					$(".add").on("click",function() {
										var change_inform = [ '<input name="楼栋名称" type="text" placeholder="请输入楼栋名称" class="fileInput" style="margin-left:16px;color:#6a6f77;">' ];
										change_inform[1] = "";
										var builidingDiv_div = $(this);
										noticeWindow("新增楼栋信息", change_inform,
												builidingDiv_div);
										changePicture(); // 绑定上传楼栋、楼层信息
										addNewFloorClick(); // 添加新增楼层事件及其子事件
										var area_name = $(this).parents(".middleDiv").attr("id");
										$("#newButtonDiv1").click(function() { // 提交结果程序
													if ($("#topLeftDiv").find("input").eq(0).val() == "") { // 先判断是否填写了楼栋名称
														 alert("请添写楼栋名称");
													} else if($(".newFileInput.hasFloorPic").length == 0) {
														alert("请添加楼层信息");
													}
													else{
														detailResult(systemCode,area_name); // 提交处理函数
													}												
												});
									});

				}
			});
}
function detailResult(systemCode, area) {
	var form_data = new FormData();
	if ($("#upLoadBuild").attr("class") != "hasBuildPic"
			&& ($(".fileInput.hasFloorPic").length + $(".newFileInput.hasFloorPic").length) == 0) {
		alert("请选择上传内容"); // 没做新增操作
		return false;
	} else if ($("#upLoadBuild").attr("class") == "hasBuildPic") {
		form_data.append("buildingMap", $("#change_build_picture")
				.prop("files")[0]);
		var new_build_picture = $("#rightImageDiv").css("background");
	}
	var floorArray = [];
	for ( var i = 0; i < $(".newFileInput.hasFloorPic").length; i++) {
		if ($(".newFileInput.hasFloorPic").eq(i).parent().parent().find(
				"input[type='text']").eq(0).val() == "") {
			alert("请填写完整楼层信息");
			return false;
		} else {
			floorArray.push($(".newFileInput.hasFloorPic").eq(i).parent()
					.parent().find("input[type='text']").eq(0).val());
			form_data.append("floorMap", $(".newFileInput.hasFloorPic").eq(i)
					.prop("files")[0]);
		}
	}
	for ( var i = 0; i < $(".fileInput.hasFloorPic").length; i++) {
		floorArray.push($(".fileInput.hasFloorPic").eq(i).parent().attr("name"));
		form_data.append("floorMap", $(".fileInput.hasFloorPic").eq(i).prop("files")[0]);
	}
	form_data.append("floor", JSON.stringify(floorArray));
	form_data.append("controller", "BuildingManage");
	if ($("#topLeftDiv").find(".fileInput").eq(0).attr("buildId") != undefined) {
		form_data.append("buildingID", $("#topLeftDiv").find(".fileInput")
				.eq(0).attr("buildId"));
	} else {
		form_data.append("buildingID", allBuildingData);
	}
	form_data.append("system", systemCode);
	if (area != undefined) {
		form_data.append("area", area);
		allAreaMaxBuildId[area] = allAreaMaxBuildId[area] + 1;
		form_data.append("buildingID", allAreaMaxBuildId[area]);// ,填写当前最大id+1
		form_data.append("buildingName", $("#topLeftDiv").find("input").eq(0).val());
	}
	$.ajax({
				type : "post",
				url : "../servlet/FileUploadServlet",
				dataType : "json",
				processData : false,
				contentType : false,
				data : form_data,
				success : function(e) {
					var buildindgInform = e;// 获取修改的楼栋及楼层信息
					alert("上传成功");
					// 做反馈处理
					$("#upLoadBuild").attr("class", "noBuildPic");
					var newChangeInputDiv = $(".newFileInput.hasFloorPic");
					if($("#topLeftDiv").find("input").eq(0).text() == ""){//说明为新增楼栋选项
						allBuildingData[area][0][$("#topLeftDiv").find("input").eq(0).val()]=[];
						var newBuildInform=allBuildingData[area][0][$("#topLeftDiv").find("input").eq(0).val()];
						newBuildInform[0]={};
						for ( var i = 0; i < newChangeInputDiv.length; i++) {						
							newChangeInputDiv.eq(i).parent().parent().css(
									"opacity", "1");
							newChangeInputDiv.eq(i).val("");
							newChangeInputDiv.eq(i).attr("class", "newFileInput");
							newBuildInform[0][floorArray[i]]=true;
						}	
						newBuildInform[1]=floorArray.length;
						newBuildInform[2]=floorArray.length;
						newBuildInform[3]=new_build_picture;
						newBuildInform[4]=allAreaMaxBuildId[area];
					}
					else{  //非新增楼栋
						allBuildingData[area][0][$("#topLeftDiv").find(".fileInput").eq(0).text()][0][floorArray[i]]=true;
						for ( var i = 0; i < newChangeInputDiv.length; i++) {						
							newChangeInputDiv.eq(i).parent().parent().css(
									"opacity", "1");
							newChangeInputDiv.eq(i).val("");
							newChangeInputDiv.eq(i).attr("class", "newFileInput");
						}	
					}								
					var oldChangeInputDiv = $(".fileInput.hasFloorPic");
					for ( var i = 0; i < oldChangeInputDiv.length; i++) {			
						allBuildingData[area][0][$("#topLeftDiv").find(".fileInput").eq(0).text()][0][oldChangeInputDiv.eq(i).parent().previous().find("span").eq(0).text()]=true;
						oldChangeInputDiv.eq(i).parent().parent().css(
								"opacity", "1");
						oldChangeInputDiv.eq(i).val("");
						oldChangeInputDiv.eq(i).attr("class", "fileInput");
					}
					// 反馈修改的信息
					var newBuildInform = '<div class="buildingDiv" newPic="" area='
							+ buildindgInform["area"]
							+ ' buildId='
							+ buildindgInform["buildingID"]
							+ ' buildName='
							+ buildindgInform["buildingName"]
							+ '><div class="buildingTitle" title='
							+ buildindgInform["buildingName"]
							+ '>'
							+ buildindgInform["buildingName"]
							+ '</div><div class="buildingContent"><ul><li>监测楼层数：<span>'
							+ buildindgInform["totalFloor"]
							+ '</span></li><li>平面图数：<span>'
							+ buildindgInform["floorHasPic"]
							+ '</span></li></ul></div></div>';
					if ($("#" + buildindgInform["area"]).find(
							"[buildId=" + buildindgInform["buildingID"] + "]").length != 0) { // 更改已有楼栋的信息
						$("#" + buildindgInform["area"]).find(
								"[buildId=" + buildindgInform["buildingID"]
										+ "]").find("span").eq(0).text(
								buildindgInform["totalFloor"]);
						$("#" + buildindgInform["area"]).find(
								"[buildId=" + buildindgInform["buildingID"]
										+ "]").find("span").eq(1).text(
								buildindgInform["floorHasPic"]);
						$("#" + buildindgInform["area"]).find(
								"[buildId=" + buildindgInform["buildingID"]
										+ "]").attr("newPic", new_build_picture);
					} else {
						$("#" + buildindgInform["area"]).find(
								".campusDetailDiv").eq(0)
								.append(newBuildInform);
						$("#"+buildindgInform['buildingID']).click(function(){ //为新增楼栋监听修改变动
							var area = $(this).attr("area");
										var buildId = $(this).attr("buildId");
										var builidingDiv_div = $(this);
										var buildName = $(this).attr("buildName");
										var change_inform = [ '<div type="text" class="fileInput" buildId='
												+ buildId
												+ ' style="margin-left:16px;color:#6a6f77;">'
												+ buildName + '</div>' ];
										change_inform[1] = area;
										change_inform[2] = buildName;
										change_inform[3] = buildId;
										noticeWindow("修改楼栋信息", change_inform,
												builidingDiv_div);// 弹出框加载后可绑定楼栋上传功能
										addBuildingFloor(area, buildName);// 添加楼层信息
										changePicture(); // 绑定上传楼栋、楼层信息
										addNewFloorClick(); // 添加新增楼层事件及其子事件
										$("#newButtonDiv1").click(function() { // 提交结果程序
											detailResult(systemCode); // 提交处理函数
										});
						});
					}

				}
			});
}
// 添加楼层信息
function addBuildingFloor(build_area, build_name) {
	for ( var build_floor in allBuildingData[build_area][0][build_name][0]) {
		var floor_name = build_floor;// get floor name
		var pic_state = allBuildingData[build_area][0][build_name][0][floor_name];// get the state of build_picture
		if (pic_state) {
			$("#bottomContentDiv").append('<div class="floorInformation">'
									+ '<div class="floorName" style="width:130px">'
									+ '楼层名称：'
									+ '<span style="color:#6a6f77;" title='
									+ floor_name
									+ '>'
									+ floor_name
									+ '<span>'
									+ '</div>'
									+ '<div class="floorSvg" name='
									+ floor_name
									+ '>'
									+ '楼层平面图：'
									+ '<input name='
									+ floor_name
									+ ' type="file" class="fileInput" style="color:#6a6f77;">'
									+ '</div>' + '</div>');
		} else {
			$("#bottomContentDiv").prepend('<div class="floorInformation" style="opacity:0.5">'
									+ '<div class="floorName" style="width:130px">'
									+ '楼层名称：'
									+ '<span style="color:#6a6f77;" title='
									+ floor_name
									+ '>'
									+ floor_name
									+ '<span>'
									+ '</div>'
									+ '<div class="floorSvg" name='
									+ floor_name
									+ '>'
									+ '楼层平面图：'
									+ '<input type="file" class="fileInput" style="color:#6a6f77;">'
									+ '</div>' + '</div>');
		}

	}
}

// 绑定添加按钮
function addNewFloorClick() {
	$("#addFloor").on("click",function() {
						$("#bottomContentDiv").append('<div class="floorInformation" style="opacity:0.5;">'
												+ '<div class="floorName">'
												+ '楼层名称：'
												+ '<input name="楼层名称" type="text" placeholder="请输入楼层名称"  style="color:#6a6f77;">'
												+ '</div>'
												+ '<div class="floorSvg">'
												+ '楼层平面图：'
												+ '<input name="楼层平面图" type="file" class="newFileInput" style="color:#6a6f77;">'
												+ '</div>' + '</div>');
						$("#bottomContentDiv").scrollTop(
								$("#bottomContentDiv")[0].scrollHeight);
						// 新增楼层后为其绑定上传事件
						addChangePicture();
					});
}
// 绑定新增 input change
function addChangePicture() {
	$(".newFileInput").eq($(".newFileInput").length - 1).on("change",
			function(e) {
				var file = e.target.files[0]; // 获取文件资源,其中file中包含了文件大小、类型等
				// 判断文件类型
				if (!file.type.match("image/svg*")) {
					alert("文件格式不正确");
					$(this).val("");
					$(this).attr("class", "newFileInput");
				} else {
					$(this).attr("class", "newFileInput hasFloorPic");
				}
			});
}
// 绑定input change
function changePicture() {
	$("#bottomContentDiv .fileInput").on("change", function(e) {
		var file = e.target.files[0]; // 获取文件资源,其中file中包含了文件大小、类型等
		// 判断文件类型
		if (!file.type.match("image/svg*")) {
			alert("文件格式不正确");
			$(this).val("");
			$(this).attr("class", "fileInput");
		} else {
			$(this).attr("class", "fileInput hasFloorPic");
		}
	});
	$("#change_build_picture").on(
			"change",
			function(e) {
				var file = e.target.files[0]; // 获取文件资源,其中file中包含了文件大小、类型等
				// 判断文件类型
				if (!file.type.match("image/*")) {
					alert("文件格式不正确");
					$(this).val("");
					$("#upLoadBuild").attr("class", "noBuildPic");
				} else {
					$("#upLoadBuild").attr("class", "hasBuildPic");
					reader = new FileReader();
					reader.readAsDataURL(file);// 读取文件
					reader.onload = function(arg) {
						// 实现图片反馈功能
						
						$("#rightImageDiv").css("background","url(" + arg.target.result + ")"+ " no-repeat");
						$("#rightImageDiv").css("background-size", "cover");
					};
				}
			});
	$("#upLoadBuild").click(function() {
		$("#change_build_picture").click();
	});
}

function noticeWindow(titleName, inform, div) {
	if (typeof ($("#noticeDiv")) != undefined) {
		$("#noticeDiv").remove();
	}
	var newNoticeDiv = document.createElement("div");
	newNoticeDiv.id = "noticeDiv";
	newNoticeDiv.className = "windowBody";
	$("body").append(newNoticeDiv);
	$("#noticeDiv").css({
		"width" : noticeWidth,
		"height" : noticeHeight
	});
	var newNoticeTitleDiv = document.createElement("div");
	newNoticeTitleDiv.id = "noticeTitleDiv";
	newNoticeTitleDiv.className = "windowTitle";
	$("#noticeDiv").append(newNoticeTitleDiv);
	$("#noticeTitleDiv").html('<span>' + titleName + '</span>'
					+ '<span class="iconfont" id="windowClose">' + '&#xf081'
					+ '</span>');
	$("#noticeTitleDiv").css({
		'background-color' : 'rgb(44, 146, 146)',
		'color' : '#fff'
	});
	var newNoticeContentDiv = document.createElement("div");
	newNoticeContentDiv.id = "newNoticeContentDiv";
	$("#noticeDiv").append(newNoticeContentDiv);
	var contentFormDiv = document.createElement("div");
	contentFormDiv.id = "contentFormDiv";
	$("#newNoticeContentDiv").append(contentFormDiv);
	$("#contentFormDiv").html('<form>'
							+ '<div id="formSubmit">'
							+ '<input name="sure" type="button" value="确定" id="newButtonDiv1" class="newButtonDiv">'
							+ '<input name="no" type="button" value="取消" id="newButtonDiv2" class="newButtonDiv">'
							+ '<div>' + '</form>');

	var formContentDiv = document.createElement("div");
	formContentDiv.id = "formContentDiv";
	$("#contentFormDiv form").append(formContentDiv);

	var topContentDiv = document.createElement("div");
	topContentDiv.id = "topContentDiv";
	$("#formContentDiv").append(topContentDiv);

	var topLeftDiv = document.createElement("div");
	topLeftDiv.id = "topLeftDiv";
	$("#topContentDiv").append(topLeftDiv);
	$("#topLeftDiv").html('楼栋名称：' + inform[0]);
	var topRightDiv = document.createElement("div");
	topRightDiv.id = "topRightDiv";
	$("#topContentDiv").append(topRightDiv);

	var rightImageDiv = document.createElement("div");
	rightImageDiv.id = "rightImageDiv";
	$("#topRightDiv").append(rightImageDiv);

	var rightInputDiv = document.createElement("div");
	rightInputDiv.id = "rightInputDiv";
	$("#topRightDiv").append(rightInputDiv);
	$("#rightInputDiv").html('<input type="button" id="upLoadBuild" value="上传楼栋图片" style="height:30px;cursor:pointer;width:100px;margin-left:50px">');
	$("#rightInputDiv").append("<input id='change_build_picture' type='file' accept='image/' style='display:none'>");
	var bottomContentDiv = document.createElement("div");
	bottomContentDiv.id = "bottomContentDiv";
	$("#formContentDiv").append(bottomContentDiv);
	var addFloorDiv = document.createElement("div");
	addFloorDiv.id = "addFloorDiv";
	$("#formContentDiv").append(addFloorDiv);
	$("#addFloorDiv").html('<div id="addFloor">' + '<span class="iconfont">' + '&#xea0a&nbsp'+ '</span>' + '新增楼层及楼层平面图' + '</div>');
	if (inform[1] == "") {
		$("#rightImageDiv").css("background",
				"url(images/uploadPic.jpg) no-repeat");// 添加 上传楼栋提示图片
		$("#rightImageDiv").css("background-size", "cover");
	} else if (div.attr("newPic") == "") {
		$("#rightImageDiv").css(
				"background",
				"url('" + allBuildingData[inform[1]][0][inform[2]][3]+ "') no-repeat");
		$("#rightImageDiv").css("background-size", "cover");
	} else {
		$("#rightImageDiv").css("background", div.attr("newPic"));
	}
	$("#noticeDiv").draggable({
		handle : '#noticeTitleDiv'
	});
	$("#windowClose").on("click", function() {
		$("#noticeDiv").fadeOut(0, function() {
			$("#noticeDiv").remove();
		});
	});
	$("#newButtonDiv2").on("click", function() {
		$("#noticeDiv").fadeOut(0, function() {
			$("#noticeDiv").remove();
		});
	});
}
$(document).ready(function() {
			// 初始默认发送network_system请求
			getSystemBuildingInform("2");
			// 切换系统模式
			$(".subSystem input").on(
					"click",
					function() {
						$(this).addClass('input');
						$(this).parent('li').siblings('li').children('input')
								.removeClass('input');
						// 清空历史系统数据
						$(".campusDetailDiv").empty();
						$("#noticeDiv").remove();
						getSystemBuildingInform($(this).attr("name"));
					});
		})

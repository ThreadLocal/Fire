currentCampus = "";   //当前选中的校区
/*buildingStatusColor = {
 "0": "#19A25F",  //0 为正常 绿色
 "1": "#DD5044",  //1 为报警 红色
 "2": "#FFCE43"   //2 为异常 黄色
 };*/
buildingStatusColor = {
    "0": "waterdropGreen",  //0 为正常 绿色
    "1": "waterdropRed",  //1 为报警 红色
    "2": "waterdropYellow"   //2 为异常 黄色
};
buildingName = "";     //点击的楼栋的名称
buildingId = "";       //点击的楼栋的Id
monitorNumTotal = 0;   //点击的楼栋的监测节点总数
abnormalNumTotal = 0;  //点击的楼栋的异常节点总数
alarmNumTotal = 0;     //点击的楼栋的报警节点总数
normalRateTotal = "";  //点击的楼栋的总正常率
noticeDiv_X = 0;       //弹出框的left
noticeDiv_Y = 0;       //弹出框的top
locationJson = {};     //存储楼栋位置数据
buildingInfo = {};     //存储楼栋状态及节点信息

/*楼栋状态的WebSocket  以及总的楼栋信息*/
function startWSforData(){
    if ('WebSocket' in window) {
        try {
            buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } catch (e) {
            alert("not support");
        }
    } else if ('MozWebSocket' in window) {
        buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
    } else {
        alert("not support");
    }

    buildingWS.onopen = function (evt) {
        console.log("buildingStatusWS Connected",evt);
        buildingWS.send("give me the building status");//发送请求
    };
    buildingWS.onmessage = function (evt) {
        var paraInfo = eval("(" + evt.data + ")");
        buildingInfo = paraInfo;
        resetStatus();
        if(document.getElementById("noticeDiv") != null){
        	resetBuildingData();
        }
        delete paraInfo;
    };
    buildingWS.onerror = function(evt){
        console.log("buildingStatusWS Error:",evt);
        if ('WebSocket' in window) {
            try {
                buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
            } catch (e) {
                alert("not support");
            }
        } else if ('MozWebSocket' in window) {
            buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } else {
            alert("not support");
        }
    };
    buildingWS.onclose = function(evt){
        console.log("buildingStatusWS closed",evt.wasClean,evt.code);
        if ('WebSocket' in window) {
            try {
                buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
            } catch (e) {
                alert("not support");
            }
        } else if ('MozWebSocket' in window) {
            buildingWS = new WebSocket(newweb+"Fire/BuildingStatus.do");
        } else {
            alert("not support");
        }
    };
}

/*楼栋定点*/
function pointOfBuildingLocation(){
    for (var i in locationJson[currentCampus]){
        var newPoint = document.createElement("img");
        newPoint.id = locationJson[currentCampus][i]["buildingID"];
        //newPoint.className = "icofont iconfont buildingPoint";
        newPoint.className = "iconPoint buildingPoint";
        //newPoint.innerHTML = "&#xf060";
        newPoint.src = "images/markpoint/waterdropGreen.png";
        
        if(locationJson[currentCampus][i]["svgy"]!=""){
        newPoint.style.top = locationJson[currentCampus][i]["svgy"]+"px";
        newPoint.style.left = locationJson[currentCampus][i]["svgx"]+"px";    
        $("#campusPicture").append(newPoint);
        $("#"+locationJson[currentCampus][i]["buildingID"]).attr({
            "name":locationJson[currentCampus][i]["buildingName"],
            "buildingId":locationJson[currentCampus][i]["buildingID"]
        });
     
        var newCamera = document.createElement("img");
        newCamera.id = locationJson[currentCampus][i]["buildingID"]+"Camera";
        newCamera.className = "iconPoint buildingCamera";
        newCamera.src = "images/camera.png";
        if(locationJson[currentCampus][i]["buildingID"] == "1010"){
        	newCamera.style.top = locationJson[currentCampus][i]["svgy"]+"px";
            newCamera.style.left = parseFloat(locationJson[currentCampus][i]["svgx"])+40+"px";    
            $("#campusPicture").append(newCamera);
        }
        $("#"+locationJson[currentCampus][i]["buildingID"]+"Camera").attr({
            "name":locationJson[currentCampus][i]["buildingName"],
            "buildingId":locationJson[currentCampus][i]["buildingID"]
        });
    }
    }   
 $(".buildingCamera").on("click",function(e){
	 buildingName = $(this).attr("name");
     buildingId = $(this).attr("buildingId");
     
     noticeWindowPic();
     
     event.stopPropagation();
 });
    $(".buildingPoint").on("click",function(e){
        buildingName = $(this).attr("name");
        buildingId = $(this).attr("buildingId");

        noticeDiv_X = e.clientX;
        noticeDiv_Y = e.clientY;
        if((noticeDiv_X+672)>=1920){
            noticeDiv_X -=672;
        }
        if((noticeDiv_Y+494)>=1080){
            noticeDiv_Y -=494;
        }
        /*if(document.getElementById("noticeDiv") == null){
            detailType = "fault";
            noticeWindow();
        }
        else{
            $("#noticeDiv").fadeOut(0,function(){
                $("#noticeDiv").remove();
            });
            buildingDataWS.close();
            detailType = "fault";
            noticeWindow();
        }*/
        detailType = "fault";
        noticeWindow();
        
        event.stopPropagation();
    });
    /*$(".buildingPoint").draggable(function(){
    	event.stopPropagation();
    });*/
   
}

/*更新楼栋状态以及校区所有楼栋的节点状况*/
function resetStatus(){
    var currentBuildingInfo = buildingInfo[currentCampus];
    var buildingStatus = currentBuildingInfo["buildingStatus"];

    //$(".buildingPoint").css("color",buildingStatusColor["0"]);   //重置楼栋状态为正常
    $(".buildingPoint").attr("src","images/markpoint/"+buildingStatusColor["0"]+".png");   //重置楼栋状态为正常
    for (var i in buildingStatus){
        //$("#"+i).css("color",buildingStatusColor[buildingStatus[i]]);
        $("#"+i).attr("src","images/markpoint/"+buildingStatusColor[buildingStatus[i]]+".png");
    }

    $("#normalBuilding").text(currentBuildingInfo["buildingNum"]-Object.keys(buildingStatus).length);
    $("#abnormalBuilding").text(Object.keys(buildingStatus).length);
    $("#monitorNode").text(currentBuildingInfo["monitorNumTotal"]);
    $("#abnormalNode").text(currentBuildingInfo["abnormalNumTotal"]);
    $("#alarmNode").text(currentBuildingInfo["alarmNumTotal"]);
    $("#normalRate").text(((currentBuildingInfo["monitorNumTotal"]-currentBuildingInfo["abnormalNumTotal"]-currentBuildingInfo["alarmNumTotal"])/currentBuildingInfo["monitorNumTotal"]*100).toFixed(2)+"%");
}
/*异常数据跳转详情事件*/
function skipClick(){
	$("#informationDetailTable tr[systemname]").unbind("click");
    $("#informationDetailTable tr[systemname]").css("cursor","pointer");
    $("#informationDetailTable tr[systemname]").click(function(){
    	var building_id=$(this).attr("buildingid");
    	var system_url=$(this).attr("systemname");
    	var building_area=$("#campusSelect").find(".campusSelectChoose").text();
    	var floor_name=$(this).attr("building_floor");
    	var device_node_id=$(this).attr("id");
    	location.href=system_url+".htm"+"?"+escape("building_id="+building_id+"&"+"building_area="+building_area+"&"+"floor_name="+floor_name+"&device_node_id="+device_node_id);
    	
    });
}
/*楼栋节点数据弹框*/
function noticeWindow() {
	if(typeof($("#noticeDiv")) != undefined){
    	$("#noticeDiv").fadeOut(0,function(){
    		$("#noticeDiv").remove();
    	});
    }
    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDiv";
    newNoticeDiv.className = "windowBody";
    newNoticeDiv.style.top = noticeDiv_Y + "px";
    newNoticeDiv.style.left = noticeDiv_X + "px";
    $("body").append(newNoticeDiv);

    var newNoticeTitleDiv = document.createElement("div");
    newNoticeTitleDiv.id = "noticeTitleDiv";
    newNoticeTitleDiv.className = "windowTitle";
    $("#noticeDiv").append(newNoticeTitleDiv);
    $("#noticeTitleDiv").html('<span>' + buildingName + '</span>' + '<span class="iconfont" id="windowClose">' + '&#xf081' + '</span>');
    $("#noticeTitleDiv").css({'background-color': 'rgb(44, 146, 146)', 'color': '#fff'});

    var newNoticeContentDiv = document.createElement("div");
    newNoticeContentDiv.id = "noticeContentDiv";
    $("#noticeDiv").append(newNoticeContentDiv);

    var buildingInformationDiv = document.createElement("div");
    buildingInformationDiv.id = "buildingInformation";
    $("#noticeContentDiv").append(buildingInformationDiv);
    $("#buildingInformation").html("<span>监测节点：</span>" + "<span id='monitorNumTotal'>&nbsp</span>" + "<span>正常率：</span>" + "<span id='normalRateTotal'>&nbsp</span>"
        + "<span>异常节点：</span>" + "<span id='abnormalNumTotal'>&nbsp</span>" + "<span>报警节点：</span>" + "<span id='alarmNumTotal'>&nbsp</span>");

    var systemInformationDiv = document.createElement("div");
    systemInformationDiv.id = "systemInformation";
    $("#noticeContentDiv").append(systemInformationDiv);

    var systemTable = document.createElement("table");
    systemTable.id = "systemInformationTable";
    $("#systemInformation").append(systemTable);

    var tableHeader = document.createElement("tr");
    tableHeader.id = "header";
    $("#systemInformationTable").append(tableHeader);
    $("#header").html("<th>系统</th>" + "<th>监测</th>" + "<th>正常率</th>" + "<th>异常</th>" + "<th>报警</th>");

    var informationDetailDiv = document.createElement("div");
    informationDetailDiv.id = "informationDetail";
    $("#noticeContentDiv").append(informationDetailDiv);

    var informationDetailTitleDiv = document.createElement("div");
    informationDetailTitleDiv.id = "informationDetailTitle";
    $("#informationDetail").append(informationDetailTitleDiv);
    $("#informationDetailTitle").html("<li class='typeSelectChoose typeChange' detailType='fault'>异常</li>" + "<li class='typeChange' detailType='alarm'>报警</li>");

    var informationDetaiContentDiv = document.createElement("div");
    informationDetaiContentDiv.id = "informationDetaiContent";
    $("#informationDetail").append(informationDetaiContentDiv);
    $("#informationDetaiContent").html("<li id='time'>时间</li>" + "<li id='address'>地点</li>" + "<li id='type'>类型</li>");

    var informationDetailTableDiv = document.createElement("div");
    informationDetailTableDiv.id = "informationDetailTableDiv";
    $("#informationDetaiContent").append(informationDetailTableDiv);
    $("#informationDetailTableDiv").html("<table id='informationDetailTable'>" + "</table>");

    $("#noticeDiv").draggable({
            handle: '#noticeTitleDiv',
            containment: "#campusPicture"
        }
    );

    $("#windowClose").on("click", function () {
            $("#noticeDiv").fadeOut(0, function () {
                $("#noticeDiv").remove();
            });
        }
    );

    $("#noticeDiv").on("click", function () {
        event.stopPropagation();
    });

    resetBuildingData();   
}
/*更新弹框数据*/
function resetBuildingData() {
    var paraInfo = buildingInfo[currentCampus]["buildingDetailInfo"][buildingId];
    var buildingNodes = paraInfo["total"];
    var buildingSystem = paraInfo["system"];

    $("#monitorNumTotal").text(buildingNodes["monitorNumTotal"]);
    $("#abnormalNumTotal").text(buildingNodes["abnormalNumTotal"]);
    $("#alarmNumTotal").text(buildingNodes["alarmNumTotal"]);
    if (buildingNodes["monitorNumTotal"] == 0) {
        $("#normalRateTotal").text("100.00%");
    }
    else {
        $("#normalRateTotal").text(((buildingNodes["monitorNumTotal"] - buildingNodes["abnormalNumTotal"] - buildingNodes["alarmNumTotal"]) / buildingNodes["monitorNumTotal"] * 100).toFixed(2) + "%");
    }
    $("#systemInformationTable td").remove();
    $("#systemInformationTable tr[id!=header]").remove();

    for (var i in buildingSystem) {
        var newTd_name = "<td>" + i + "</td>";
        var newTd_monitorNum = "<td>" + buildingSystem[i][0] + "</td>";
        if (buildingSystem[i][0] == 0) {
            var newTd_normalRate = "<td>100.00%</td>";
        }
        else {
            var newTd_normalRate = "<td>" + ((buildingSystem[i][0] - buildingSystem[i][1] - buildingSystem[i][2]) / buildingSystem[i][0] * 100).toFixed(2) + "%" + "</td>";
        }
        var newTd_abnormalNum = "<td>" + buildingSystem[i][1] + "</td>";
        var newTd_alarmNum = "<td>" + buildingSystem[i][2] + "</td>";
        $("#systemInformationTable").append("<tr>" + newTd_name + newTd_monitorNum + newTd_normalRate + newTd_abnormalNum + newTd_alarmNum + "</tr>");
    }

    resetDetailTable();
    skipClick();
    $(".typeChange").click(function () {
        $(this).addClass('typeSelectChoose').siblings('li').removeClass('typeSelectChoose');
        detailType = $(this).attr("detailType");
        resetDetailTable();
        skipClick();
        event.stopPropagation();
    });

    function resetDetailTable() {
        var buildingDetail = paraInfo[detailType];

        $("#informationDetailTable td").remove();
        $("#informationDetailTable tr").remove();
        for (var i in buildingDetail) {
            var newTr = document.createElement("tr");
            newTr.id = i;
            $("#informationDetailTable").append(newTr);
            var newTd_time = "<td>" + buildingDetail[i][0] + "</td>";
            var newTd_location = "<td>" + buildingDetail[i][2] + buildingDetail[i][1] + "</td>";
            var newTd_type = "<td>" + buildingDetail[i][3] + "</td>";
            $("#" + i).append(newTd_time + newTd_location + newTd_type);
            $("#" + i).attr("buildingID",buildingDetail[i][5]);
            $("#" + i).attr("SystemName",buildingDetail[i][4]);
            $("#" + i).attr("building_floor",buildingDetail[i][2]);
        }
        /*补足5行*/
        if ($("#informationDetailTable tr").length < 6) {
            var tableLength = 5 - $("#processDataTable tr").length;
            for (var i = 0; i < tableLength; i++) {
                var newTd = "<td><br></td>"
                $("#informationDetailTable").append("<tr>" + newTd + newTd + newTd + "</tr>");
            }
        }
    }
    delete paraInfo;
}


$(document).ready(function(){
	menuZoom("indexAndCampus");
    currentCampus = "A区";

    /*获取楼栋位置信息*/
    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:{"controller":"BuildingMap","enum":"buildingMap"},
        success:function(locationInfo) {
            locationJson = $.parseJSON(locationInfo);
            
            pointOfBuildingLocation();
            startWSforData();

            /*地图切换*/
            $('#campusSelect li').click(function() {
                $(this).addClass('campusSelectChoose').siblings('li').removeClass('campusSelectChoose');
                currentCampus = $(this).attr("campus");
                var campusUrl = "url(\'images/MAP/"+currentCampus+".png\')";
                $("#campusName").text(currentCampus);
                $("#campusPicture").css({'background-image': campusUrl});
                $(".buildingPoint").remove();
                $(".buildingCamera").remove();
                pointOfBuildingLocation();
                resetStatus();

                /*event.stopPropagation();*/
            });

            $(document).click(function(){
                if(typeof($("#noticeDiv")) != undefined){
                	$("#noticeDiv").fadeOut(0,function(){
                		$("#noticeDiv").remove();
                	});
                }
            });
        }
    });
});

/*楼栋视频数据弹框*/
function noticeWindowPic(){
	if(typeof($("#noticeDiv")) != undefined){
    	$("#noticeDiv").fadeOut(0,function(){
    		$("#noticeDiv").remove();
    	});
    }
    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDiv";
    newNoticeDiv.className = "windowBody";
    newNoticeDiv.style.top = "226"+"px";
    newNoticeDiv.style.left = "487"+"px";
    newNoticeDiv.style.width = "1070"+"px";
    $("body").append(newNoticeDiv);

    var newNoticeTitleDiv = document.createElement("div");
    newNoticeTitleDiv.id = "noticeTitleDiv";
    newNoticeTitleDiv.className = "windowTitle";
    $("#noticeDiv").append(newNoticeTitleDiv);
    $("#noticeTitleDiv").html('<span>'+buildingName+'</span>'+'<span class="iconfont" id="windowClose">'+'&#xf081'+'</span>');
    $("#noticeTitleDiv").css({'background-color':'rgb(44, 146, 146)','color':'#fff'});

    var newNoticeContentDivPic = document.createElement("div");
     newNoticeContentDivPic.id = "noticeContentDivPic";
    $("#noticeDiv").append(newNoticeContentDivPic);

    var newNoticeContentDivVedio = document.createElement("div");
    newNoticeContentDivVedio.id = "noticeContentDivVedio";
    $("#noticeDiv").append(newNoticeContentDivVedio);

    //添加标题
    var newNoticeContentTitle=document.createElement("div");
    newNoticeContentTitle.id="noticeContentDivTitle";
    $("#noticeContentDivPic").append(newNoticeContentTitle);
    $("#noticeContentDivTitle").html('消防控制室分布图');

    var newNoticeContentTitle2=document.createElement("div");
    newNoticeContentTitle2.id="noticeContentDivTitle2";
    $("#noticeContentDivVedio").append(newNoticeContentTitle2);
    $("#noticeContentDivTitle2").html('监控视频');

    //添加图片
    var newNoticeContentP=document.createElement("div");
    newNoticeContentP.id="noticeContentDivP";
    $("#noticeContentDivPic").append(newNoticeContentP);
    $("#noticeContentDivP").css("background-image","url(images/fireMonitor/fireControler.svg)");

    var newNoticeContentV=document.createElement("div");
    newNoticeContentV.id="noticeContentDivV";
    $("#noticeContentDivVedio").append(newNoticeContentV);
    $("#noticeContentDivV").html("<object type='application/x-vlc-plugin' width='480px' height='270px' top='55px'>"+
    		"<param name='mrl' value='rtsp://admin:asdf1234@172.20.33.112:554/h264/ch1/main/av_stream' />"+
    		"</object>"+
    		"<object type='application/x-vlc-plugin' width='480px' height='270px' top='55px'>"+
    		"<param name='mrl' value='rtsp://admin:asdf1234@172.20.33.114:554/h264/ch1/main/av_stream' />"+
    		"</object>");



    $("#noticeDiv").draggable({
            handle:'#noticeTitleDiv'
        }
    );
    $("#windowClose").on("click",function(){
            $("#noticeDiv").fadeOut(0,function(){
                $("#noticeDiv").remove();
            });
        }
    );
    $("#noticeDiv").on("click",function(){
        event.stopPropagation();
    });


}
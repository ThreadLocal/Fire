currentCampus = "";   //当前选中的校区
locationJson = {};        //存储楼栋位置数据
   
/* 所有楼栋位置信息 */
function ajaxForBuildingInfo(){
	$.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:{"controller":"BuildingMap","enum":"buildingMap"},
        success:function(locationInfo) {
            locationJson = $.parseJSON(locationInfo);
            
            pointOfBuildingLocation();
            /*地图切换*/
            $('#campusSelect li').click(function() {
                $(this).addClass('campusSelectChoose').siblings('li').removeClass('campusSelectChoose');
                currentCampus = $(this).attr("campus");
                var campusUrl = "url(\'images/MAP/"+currentCampus+".png\')";
                $("#campusName").text(currentCampus);
                $("#campusPicture").css({'background-image': campusUrl});
                pointOfBuildingLocation();
                /*event.stopPropagation();*/
            });
        }
    });
}

/* 给后端 */
function ajaxForBuildingLocation(left,top,id){
    jsonPara=[left,top,id];
    jsonPara = JSON.stringify(jsonPara);

    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": "SystemManagement", "enum": "modifyBuildingLocation", "jsonPara": jsonPara},
        success: function (data) {
            switch (data){
                case "success":
                    alert("修改成功");
                    ajaxForBuildingInfo();
                    break;
                case "error":
                    alert("修改失败");
                    break;
            }
        }
    });
}

/*楼栋定点*/
function pointOfBuildingLocation(){
	$(".buildingPoint").remove();
	$("#newBuilding td").remove();
    $("#newBuilding tr[id!=header]").remove();
    $("#allImageFalse").remove();
    for (var i in locationJson[currentCampus]){
        var newPoint = document.createElement("img");
        newPoint.id = locationJson[currentCampus][i]["buildingID"];
        //newPoint.className = "icofont iconfont buildingPoint";
        newPoint.className = "buildingPoint";
        //newPoint.innerHTML = "&#xf060";
        newPoint.src = "images/markpoint/waterdropGreen.png";
        
        if(locationJson[currentCampus][i]["svgy"]!=""){
            newPoint.style.top = locationJson[currentCampus][i]["svgy"]+"px";
            newPoint.style.left = locationJson[currentCampus][i]["svgx"]+"px";
            $("#campusPicture").append(newPoint);
            /*$("#"+locationJson[currentCampus][i]["buildingID"]).attr({
                "name":locationJson[currentCampus][i]["buildingName"],
                "buildingId":locationJson[currentCampus][i]["buildingID"],
                "title":locationJson[currentCampus][i]["buildingName"]
            });*/
        }
        else{
            var newTr = document.createElement("tr");
            newTr.id = "newBuilding_"+i;
            $("#newBuilding").append(newTr);

            var newTdName = "<td>"+locationJson[currentCampus][i]["buildingName"]+"</td>";
            $("#newBuilding_"+i).append(newTdName);

            var newTdPoint = document.createElement("td");
            newTdPoint.id = "newBuilding_"+i+"_point";
            $("#newBuilding_"+i).append(newTdPoint);

            var newPoint = document.createElement("img");
            newPoint.id = locationJson[currentCampus][i]["buildingID"];
            newPoint.className = "iconPoint newBuildingPoint";
            newPoint.src = "images/markpoint/waterdropGreen.png";
            newTdPoint.id = "newBuilding_"+i+"_point";
            $("#newBuilding_"+i+"_point").append(newPoint);
        }
        $("#"+locationJson[currentCampus][i]["buildingID"]).attr({
            "name":locationJson[currentCampus][i]["buildingName"],
            "buildingId":locationJson[currentCampus][i]["buildingID"],
            "title":locationJson[currentCampus][i]["buildingName"]
        });
    }
    if($("#newBuilding tr[id!=header]").length == 0){
        noData();
    }
    else if($("#newBuilding tr[id!=header]").length < 3){
        var tableLength = 3-$("#newBuilding tr[id!=header]").length;
        for(var i=0;i<tableLength;i++){
            var newTr = "<tr><td><br></td><td><br></td></tr>";
            $("#newBuilding").append(newTr);
        }
    }
    $(".buildingPoint").draggable({
        stop:function(e,ui){
            var buildingId = $(this).attr("buildingId");
            var top = ui.position.top;
            var left = ui.position.left;
            ajaxForBuildingLocation(left,top,buildingId);
        }
    });

    $(".newBuildingPoint").draggable({
        stop:function(e,ui){
            $(this).remove();
            var buildingId = $(this).attr("buildingId");
            var buildingName = $(this).attr("name");
            var newPoint = document.createElement("img");
            newPoint.id = buildingId;
            newPoint.className = "buildingPoint";
            newPoint.src = "images/markpoint/waterdropGreen.png";
            newPoint.style.top = ui.offset.top-166+"px";
            newPoint.style.left = ui.offset.left-195+"px";
            $("#campusPicture").append(newPoint);

            $("#"+buildingId).attr({
                "name":buildingName,
                "buildingId":buildingId,
                "title":buildingName
            });
            
            ajaxForBuildingLocation(ui.offset.left-195,ui.offset.top-166,buildingId);

            $("#"+buildingId).draggable({
                stop:function(e,ui){
                    var buildingId = $(this).attr("buildingId");
                    var top = ui.position.top;
                    var left = ui.position.left;
                    ajaxForBuildingLocation(left,top,buildingId);
                }
            });
        }
    });
}

function noData(){
    var allimgFalse=document.createElement("div");
    allimgFalse.id="allImageFalse";
    $("#newBuilding").after(allimgFalse);
    var img = document.createElement("img");
    img.id = "imageFalse";
    img.src="img/noData.png";
    $("#allImageFalse").append(img);
    var imgFalse=document.createElement("span");
    imgFalse.id="imgFalseTest";
    $("#allImageFalse").append(imgFalse);
    $("#imgFalseTest").text("无新增楼栋");
}

$(document).ready(function(){
//	menuZoom("indexAndCampus");
    currentCampus = "A区";

    /*获取楼栋位置信息*/
    ajaxForBuildingInfo();
});
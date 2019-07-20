hostMachineInfo={
    /*"tableItem": {
        "tableHeader": ["主机编号", "主机名称", "所在校区", "所在楼栋", "所在楼层", "主机状态"],
        "tableContent": {
            "1": ["20131602001", "李浩", "B区", "二综", "-1楼", "异常"],
            "2": ["20131602002", "洋哥", "A区", "九宿舍", "-1楼", "正常"],
            "3": ["20131602003", "章黎", "A区", "五宿舍", "-1楼", "异常"],
            "4": ["20141502001", "翊峰", "A区", "第八教学楼", "-1楼", "异常"],
            "5": ["20141502002", "一鸣", "A区", "六宿舍", "-1楼", "异常"],
            "6": ["20141502003", "丹妮", "B区", "二综", "-1楼", "正常"],
            "7": ["20151313001", "维保管理", "A区", "主教", "-1楼", "异常"],
            "8": ["20151313002", "维保小张", "A区", "6舍", "-1楼", "异常"],
            "9": ["20151313003", "维保小田", "A区", "19楼", "-1楼", "正常"],
            "10": ["20151313004", "维保小明", "A区", "6舍", "-1楼", "异常"],
            "11": ["20151313005", "维保小K", "A区", "主教", "-1楼", "异常"],
            "12": ["20151402001", "柱哥", "A区", "主教", "-1楼", "异常"],
            "13": ["20151402002", "老王", "A区", "第五教学楼", "-1楼", "正常"],
            "14": ["20161302001", "老吴", "A区", "主教", "-1楼", "异常"],
            "15": ["20161302002", "刘卓", "A区", "主教", "-1楼", "正常"],
            "16": ["20161302003", "武哥", "A区", "主教", "-1楼", "正常"],
            "17": ["20131602001", "李浩", "B区", "二综", "-1楼", "异常"],
            "18": ["20131602002", "洋哥", "A区", "九宿舍", "-1楼", "正常"],
            "19": ["20131602003", "章黎", "A区", "五宿舍", "-1楼", "异常"],
            "20": ["20141502001", "翊峰", "A区", "第八教学楼", "-1楼", "异常"],
            "21": ["20141502002", "一鸣", "A区", "六宿舍", "-1楼", "异常"],
            "22": ["20141502003", "丹妮", "B区", "二综", "-1楼", "正常"],
            "23": ["20151313001", "维保管理", "A区", "主教", "-1楼", "异常"],
            "24": ["20151313002", "维保小张", "A区", "6舍", "-1楼", "异常"]
        },
        "totalNum": 32,
        "page": 1,
        "lengthPerPage": 24,
        "totalPage": 2
    }*/
};

nowPage = 1;				//当前页码
totalNum = 0;				//表格总条目数量
totalPage = "";				//总页数
numPerPage = 25;			//表格每页的行数
ajaxFlag = true;			//是否发送请求的标志

/*发送Ajax请求的数据*/
conditionForAjax = {
    "controller":"FacilityPatrolRecordQuery",
    "enum":"facilityPatrolRecordQuery",
    "jsonPara":{}
};

/*Ajax请求异常数据*/
function ajaxForHostMachineInfo(){
    if(ajaxFlag){

     ajaxFlag = false;

     conditionForAjax["jsonPara"]["lengthPerPage"] = numPerPage;
     conditionForAjax["jsonPara"]["page"] = nowPage;
     conditionForAjax["jsonPara"]=JSON.stringify(conditionForAjax["jsonPara"]);

     $.ajax({
     type:"post",
     url:"../servlet/DispatchServlet",
     data:conditionForAjax,
     success:function(hostMachineData) {
     hostMachineInfo = $.parseJSON(hostMachineData);

    initTableHeader("hostMachineTable",hostMachineInfo["tableItem"]["tableHeader"]);
    resetTable("hostMachineTable",hostMachineInfo["tableItem"]);
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
            newTr.id = "hostMachineTr_"+i;
            newTr.className = "trRaw";
            $("#" + tableId).append(newTr);

            var index = Number(i);
            var newTd = "<td>"+(numPerPage*(nowPage-1)+index)+"</td>";
            $("#hostMachineTr_"+i).append(newTd);

            for (var j in tableContent[i]){
                var newTd = document.createElement("td");
                newTd.innerHTML = tableContent[i][j];
                newTd.title = tableContent[i][j];
                $("#hostMachineTr_"+i).append(newTd);
            }
            $("#hostMachineTr_"+i).attr({
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
            ajaxForHostMachineInfo();
        }
        else{
        	$("#nowPage").val(nowPage);
        }
    });
    /*尾页*/
    $("#lastPage").on("click",function(){
        if(nowPage != totalPage){
            nowPage = totalPage;
            ajaxForHostMachineInfo();
        }
        else{
        	$("#nowPage").val(nowPage);
        }
    });
    /*上一页*/
    $("#prePage").on("click",function(){
        if(nowPage != 1){
            nowPage--;
            ajaxForHostMachineInfo();
        }
        else{
        	$("#nowPage").val(nowPage);
        }
    });
    /*下一页*/
    $("#nextPage").on("click",function(){
        if(nowPage != totalPage){
            nowPage++;
            ajaxForHostMachineInfo();
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
            	ajaxForHostMachineInfo();
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
    $("#imgFalseTest").text("抱歉，未找到相关主机数据");
}
$(document).ready(function(){
    menuZoom("functionSelect");

    ajaxForHostMachineInfo();
    pageChange();
});
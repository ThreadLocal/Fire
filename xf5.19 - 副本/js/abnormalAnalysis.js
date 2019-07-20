
fullData = {};
tendencyData = {};
buildingData = {};

currentAnalysisMode = "1";   //当前选择的分析页面
currentAnalysisModeName = {
    "1":"异常",
    "2":"报警"
};
systemSelected = [];     //已选子系统
sysSeleForAjax = "";
trendChartBarColor = {
    "火警": "#DD5044",  //火警为红色
    "故障": "#E88604",  //故障为橙色
    "预警": "#FFCE43"   //预警为黄色
};

buildingSeleIndex = {
    "substr(nodeID,2,2)":0,	        //当前选中的校区序号
    "substr(nodeID,2,4)":0			//当前选中的楼栋序号
};
currentSeleCondition = {
    "trend": {
        "substr(nodeID,2,2)": "",	        //当前选中的校区
        "substr(nodeID,2,4)": "",			//当前选中的楼栋
        "timeStart": "",
        "timeEnd":""
    },
    "building":{
        "timeStart":"",
        "timeEnd":""
    }
};
quickTimeCondition = {
    "trend":{
        "week":["day","lineExceptionTendencyByDay",7],
        "month":["day","lineExceptionTendencyByDay",30],
        "year":["month","lineExceptionTendencyByMonth",12]
    },
    "building":{
        "week":["day","pieExceptionBuildingByDay",7],
        "month":["day","pieExceptionBuildingByDay",30],
        "year":["month","pieExceptionBuildingByMonth",12]
    }
};
currentQuickTimeCondition = {
    "trend":quickTimeCondition["trend"]["week"],
    "building":quickTimeCondition["building"]["week"]
};
currentTimeMode = {		//"0"为快捷时间  "1"为详细时间
    "trend":"0",
    "building":"0"
};
currrentCampus = "";
currrentBuilding = "";
currentTrendTime = "";
currentBuildingTime = "";
/*ajax请求用*/
ajaxJson = {
    "controller":"",
    "jsonPara": {
        "system": "",
        "choice": ""
    }
};
ajaxForEntire = {};
ajaxForTrend = {};
ajaxForBuilding = {};

initBuildingXdata=[];
initBuildingYdata=[];               //用于楼栋异常图表占位
/*图表对象属性设置*/
optionBarForTrend = {
    title : {
        text:"",
        x:"44%",
        y:'3%',
        textAlign: 'center'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:[],
        right:60,
        top:10
    },
    calculable : true,
    xAxis : {
        name:'时间',
        type : 'category',
        data : []
    },
    yAxis : {
        name:'个数',
        type : 'value'
    },
    grid: {
        width:'96%',
        top:50,
        left:5,
        bottom:10,
        containLabel: true
    },
    series : [
        {
            name:'合计',
            type:'line',
            label: {
                normal: {
                    position: 'top',
                    show: true,
                    textStyle:{
                        color:"#DD5044"
                    }
                }
            },
            itemStyle : {  /*设置折线颜色*/
                normal : {
                    color:"#c4cddc"
                }
            },
            data:[]
        }
    ]

};
/*趋势图加载数据时需要修改title.text,xAxis.data,legend.data,series中data，name，stack，itemStyle.normal.color*/
seriesForTrend = {
    name:"",
    type:"bar",
    stack:"",
    barWidth:"20",
    data:[],
    itemStyle : {  /*设置折线颜色*/
        normal : {
            color:""
        }
    }
};
/*楼栋异常柱状图第一次加载时需修改xAxis.data,更新数据时需要修改title.text,series.data*/
optionBarForBuilding = {
    tooltip: {
    	trigger: 'axis',
        formatter: "{b} : {c}",
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        	type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    title:{
        text: "",
        x:"44%",
        y:'3%',
        textAlign: 'center'
    },
    grid: {
        width: '94%',
        top: 50,
        left: 5,
        bottom: 40,
        containLabel: true
    },
    xAxis: {
        name:'楼栋',
        type: 'category',
        data:[],
        splitLine: {
            show: false
        },
        axisLabel:{
        	interval:0
        }
    },
    yAxis: {
        name: '个数',
        type: 'value'
    },
    dataZoom: {
        show: true,
        startValue: 0,
        endValue: 10,
        height: 22,
        bottom: 8,
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        zoomLock: true
    },
    series: {
        type: 'bar',
        barWidth: '20',
        stack: 'chart',
        itemStyle: {
            normal: {
                color: '#76b0d0'
            }
        },
        z: 3,
        label: {
            normal: {
                position: 'top',
                show: true
            }
        },
        data:[]
    }
};
/*楼栋异常饼图更新数据时修改title.text,series.data[0].value/name,series.data[1].value*/
optionPieForBuilding = {
    title : {
        text: "",
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
    },
    grid: {
        width: '94%',
        top: 50,
        left: 5,
        bottom: 10,
        containLabel: true
    },
    series: {
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
            {
                value: 0,
                name: "",
                textStyle: {
                    color: '#34689a'
                }
                /*label: {
                    normal: {
                        position: 'inside',
                        show: true,
                        formatter:"({d}%)"
                    }
                }*/
            },
            {
                value: 0,
                name: "其他楼栋",
                textStyle: {
                    color: '#76b0d0'
                }
                /*label: {
                    normal: {
                        position: 'inside',
                        show: true,
                        formatter:"({d}%)"
                    }
                }*/
            }
        ],
        color: ['#34689a', '#76b0d0']
    }
};
/*异常趋势的图表初始化*/
function initTrendChart(){
    trendBarChart = echarts.init(document.getElementById("trendChartBar"));
    trendBarChart.setOption(optionBarForTrend);

}
/*楼栋异常的图表初始化*/
function initBuildingBarChart(){
    optionBarForBuilding.xAxis.data = $.extend(true,[],initBuildingXdata);

    buildingBarChart =echarts.init(document.getElementById('buildingChartBar'));
    buildingBarChart.setOption(optionBarForBuilding);

}
function initBuildingPieChart(){
    buildingPieChart =echarts.init(document.getElementById('buildingChartPie'));
    buildingPieChart.setOption(optionPieForBuilding);
}
/*重置筛选下拉框*/
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
    /*初始化楼栋异常图表的X、Y轴数据*/
    for(var i in allBuildings){
        initBuildingXdata.push(allBuildings[i][0]);
        initBuildingYdata.push("");

    }

    optionForBuildings["所有校区"] = [];
    optionForBuildings["所有校区"] = $.extend(true,[],allBuildings);
    optionForBuildings["所有校区"].unshift(optionForBuildings["A区"][0]);
    
    initSelect();
}

/*重置筛选条件下拉框*/
function initSelect(){
    resetSelectforSearch("selectsquare",optionForCampus,buildingSeleIndex["substr(nodeID,2,2)"]);
    resetSelectforSearch("selectbuilding",optionForBuildings["所有校区"],buildingSeleIndex["substr(nodeID,2,4)"]);
}
/*日历解析*/
function getNowFormatDate(day) {
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    //初始化时间
    Year= day.getFullYear();//ie火狐下都可以
    Month= day.getMonth()+1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10 ) {
        CurrentDate += Month + "-";
    }
    else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10 ) {
        CurrentDate += Day ;
    }
    else {
        CurrentDate += "0" + Day ;
    }
    return CurrentDate;
}
/*初始化日历组件*/
function calendarLoading(startTimeId,endTimeId){
    var selectDate=new Date();
    var selectDate1=new Date();
    var selectDateEnd=getNowFormatDate(selectDate);
    var selectDateStart=getNowFormatDate(new Date(selectDate1.setDate(selectDate.getDate()-7)));
    $("#"+endTimeId).val(selectDateEnd);//开始让末尾时间为当前时间
    $("#"+startTimeId).val(selectDateStart);//开始让起始时间为前七天
    currentSeleCondition["trend"]["timeEnd"] = selectDateEnd;
    currentSeleCondition["building"]["timeEnd"] = selectDateEnd;
    currentSeleCondition["trend"]["timeStart"] = selectDateStart;
    currentSeleCondition["building"]["timeStart"] = selectDateStart;
    //设置日历组件
    $("input#"+startTimeId).datepicker({
        buttonImage: "images/calendar.gif",
        buttonImageOnly: true,
        /*closeText: '关闭',
        currentText: '今天',
        showButtonPanel:true,*/
        numberOfMonths:1,//显示几个月  
        dateFormat:'yy-mm-dd',//日期格式   
        yearSuffix:'年',//年的后缀  
        showMonthAfterYear:true,///是否把月放在年的后面 
        maxDate:selectDate,
        monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        dayNames:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort:['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin:['日','一','二','三','四','五','六'],
        onSelect:function(dateStart,inst){
            var currentDivId = inst.id;
            var currentDiv = $("#"+currentDivId).attr("searchDiv");
            var currentSelect = $("#"+currentDivId).attr("condition");
            $("#"+startTimeId).val(dateStart);
            var startDate = new Date(dateStart);
            var endDate = new Date(dateStart);
            endDate.setDate(startDate.getDate()+30);
            if(endDate.getTime() > selectDate.getTime()){
                endDate = selectDate;
            }
            $("input#"+endTimeId).datepicker("option","minDate",startDate);
            $("input#"+endTimeId).datepicker("option","maxDate",endDate);
            currentSeleCondition[currentDiv][currentSelect] = dateStart;
        }
    });
    $("input#"+endTimeId).datepicker({
        /*closeText: '关闭',
        currentText: '今天',
        showButtonPanel:true,*/
        numberOfMonths:1,//显示几个月  
        dateFormat:'yy-mm-dd',//日期格式  
        maxDate:selectDate,//  
        yearSuffix:'年',//年的后缀  
        showMonthAfterYear:true,///是否把月放在年的后面  
        monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        dayNames:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort:['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin:['日','一','二','三','四','五','六'],
        onSelect:function(dateEnd,inst){
        	var currentDivId = inst.id;
            var currentDiv = $("#"+currentDivId).attr("searchDiv");
            var currentSelect = $("#"+currentDivId).attr("condition");
            $("#"+endTimeId).val(dateEnd);
            var startDate = new Date(dateEnd);
            var endDate = new Date(dateEnd);
            startDate.setDate(endDate.getDate()-30);
            $("input#"+startTimeId).datepicker("option","minDate",startDate);
            $("input#"+startTimeId).datepicker("option","maxDate",endDate);
            currentSeleCondition[currentDiv][currentSelect] = dateEnd;
        }
    });
}
/*时间选择方式的切换*/
function selectTimeChange(){
	$("#trendTimeSelect").click(function(){
        $(".trendTimeSelectSecond").toggle();
        $(".trendTimeSelectFirst").toggle();

        $(".trendTime").each(function(){
            if($(this).css("display")!="none"){
                currentTimeMode["trend"] = $(this).attr("timeMode");
            }
        });
        resetTime("trend");
    });
	$("#buildingTimeSelect").click(function(){
        $(".buildingTimeSelectSecond").toggle();
        $(".buildingTimeSelectFirst").toggle();

        $(".buildingTime").each(function(){
            if($(this).css("display")!="none"){
                currentTimeMode["building"] = $(this).attr("timeMode");
            }
        });
        resetTime("building");
    });
}
/*重置*/
function resetSearch(data){
    $('*').stop(true,true);

    switch (data){
        case "trend":
            for (var i in buildingSeleIndex){
                buildingSeleIndex[i] = 0;
                currentSeleCondition["trend"][i] = "";
            }

            initSelect();
            resetTime("trend");
            break;
        case "building":
            resetTime("building");
            break;
    }
    /*更新整个页面数据*/
    ajaxForEntireData();
}
function resetTime(data) {
    switch (data) {
        case "trend":
            switch (currentTimeMode["trend"]){
                case "0":
                    currentQuickTimeCondition["trend"] = quickTimeCondition["trend"]["week"];
                    currentSeleCondition["trend"]["timeStart"] = "";
                    currentSeleCondition["trend"]["timeEnd"] = "";
                    $("#trendQuickTime option:first").prop("selected", true);
                    break;
                case "1":
                    currentQuickTimeCondition["trend"] = [];
                    currentSeleCondition["trend"]["timeStart"] = "";
                    currentSeleCondition["trend"]["timeEnd"] = "";
                    calendarLoading("trendStartTime", "trendEndTime");
                    break;
            }
            ajaxForTrend = $.extend(true, {}, ajaxJson);
            break;
        case "building":
            switch (currentTimeMode["building"]){
                case "0":
                    currentQuickTimeCondition["building"] = quickTimeCondition["building"]["week"];
                    currentSeleCondition["building"]["timeStart"] = "";
                    currentSeleCondition["building"]["timeEnd"] = "";
                    $("#buildingQuickTime option:first").prop("selected", true);
                    break;
                case "1":
                    currentQuickTimeCondition["building"] = [];
                    currentSeleCondition["building"]["timeStart"] = "";
                    currentSeleCondition["building"]["timeEnd"] = "";
                    calendarLoading("buildingStartTime", "buildingEndTime");
                    break;
            }
            ajaxForBuilding = $.extend(true, {}, ajaxJson);
            break;
    }
}
/*ajax获取整个页面数据*/
function ajaxForEntireData(){
    /*获取当前已选的子系统*/
    systemSelected = [];
    sysSeleForAjax = "";
    $("#systemSele input:checked").each(function(){
        var currentSys = $(this).val();
        systemSelected.push(currentSys);
    });
    if(systemSelected.length == 0){
        $("#systemWarn").text("请选择子系统");
    }
    else {
        $("#systemWarn").text("");
        for (var i in systemSelected) {
            sysSeleForAjax += systemSelected[i] + ",";
        }
        sysSeleForAjax = sysSeleForAjax.substring(0, sysSeleForAjax.length - 1);

        ajaxForEntire = $.extend(true, {}, ajaxJson);
        ajaxForEntire["controller"] = "ExceptionAnalysis";
        ajaxForEntire["jsonPara"]["system"] = sysSeleForAjax;
        ajaxForEntire["jsonPara"]["choice"] = currentAnalysisMode;
        ajaxForEntire["jsonPara"] = JSON.stringify(ajaxForEntire["jsonPara"]);

        $.ajax({
            type: "post",
            url: "../servlet/DispatchServlet",
            data: ajaxForEntire,
            success: function (data) {
                fullData = $.parseJSON(data);

                resetAbnormalInfo(fullData);
                resetTrendChart(fullData["excepTendency"]);
                resetBuildingChart(fullData["excepBuilding"]);

                ajaxForEntire["jsonPara"] = $.parseJSON(ajaxForEntire["jsonPara"]);
            },
            error: function () {
                ajaxForEntire["jsonPara"] = $.parseJSON(ajaxForEntire["jsonPara"]);
            }
        });
    }
}
/*ajax获取趋势数据*/
function ajaxForTrendData(){
    ajaxForTrend = $.extend(true,{},ajaxJson);
    ajaxForTrend["controller"] = "ExceptionTendency";
    ajaxForTrend["jsonPara"]["system"] = sysSeleForAjax;
    ajaxForTrend["jsonPara"]["choice"] = currentAnalysisMode;
    /*获取当前已选的条件*/
    if(currentQuickTimeCondition["trend"].length != 0) {
        ajaxForTrend["type"] = currentQuickTimeCondition["trend"][0];
        ajaxForTrend["enum"] = currentQuickTimeCondition["trend"][1];
        ajaxForTrend["num"] = currentQuickTimeCondition["trend"][2];
    }
    for(var i in currentSeleCondition["trend"]){
        if(currentSeleCondition["trend"][i] != ""){
            ajaxForTrend["jsonPara"][i] = currentSeleCondition["trend"][i];
        }
    }
    ajaxForTrend["jsonPara"] = JSON.stringify(ajaxForTrend["jsonPara"]);

    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:ajaxForTrend,
        success:function(data) {
            tendencyData = $.parseJSON(data);
            resetTrendChart(tendencyData["chartItem"]);

            ajaxForTrend["jsonPara"]=$.parseJSON(ajaxForTrend["jsonPara"]);
        },
        error:function() {
            ajaxForTrend["jsonPara"]=$.parseJSON(ajaxForTrend["jsonPara"]);
        }
    });
}
/*ajax获取楼栋数据*/
function ajaxForBuildingData(){
    ajaxForBuilding = $.extend(true,{},ajaxJson);
    ajaxForBuilding["controller"] = "ExceptionBuilding";
    ajaxForBuilding["jsonPara"]["system"] = sysSeleForAjax;
    ajaxForBuilding["jsonPara"]["choice"] = currentAnalysisMode;
    /*获取当前已选的条件*/
    if(currentQuickTimeCondition["building"].length != 0) {
        ajaxForBuilding["type"] = currentQuickTimeCondition["building"][0];
        ajaxForBuilding["enum"] = currentQuickTimeCondition["building"][1];
        ajaxForBuilding["num"] = currentQuickTimeCondition["building"][2];
    }
    for(var i in currentSeleCondition["building"]){
        if(currentSeleCondition["building"][i] != ""){
            ajaxForBuilding["jsonPara"][i] = currentSeleCondition["building"][i];
        }
    }
    ajaxForBuilding["jsonPara"] = JSON.stringify(ajaxForBuilding["jsonPara"]);

    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:ajaxForBuilding,
        success:function(data) {
            buildingData = $.parseJSON(data);
            resetBuildingChart(buildingData["chartItem"]);

            ajaxForBuilding["jsonPara"]=$.parseJSON(ajaxForBuilding["jsonPara"]);
        },
        error:function() {
            ajaxForBuilding["jsonPara"]=$.parseJSON(ajaxForBuilding["jsonPara"]);
        }
    });
}

/*更新统计框信息*/
function resetAbnormalInfo(entireData){
    var infoData = $.extend(true,{},entireData);
    delete infoData["excepTendency"];
    delete infoData["excepBuilding"];

    for (var i in infoData){
        $("#"+i+"_total").text(infoData[i][0]);
        $("#"+i+"_not").text(infoData[i][1]);
        $("#"+i+"_in").text(infoData[i][2]);
        $("#"+i+"_yet").text(infoData[i][3]);
    }
}
/*更新趋势图表*/
function resetTrendChart(data) {
    $("#allImageFalse").remove();
    currrentCampus = optionForCampus[buildingSeleIndex["substr(nodeID,2,2)"]][0];
    currrentBuilding = optionForBuildings[currrentCampus][buildingSeleIndex["substr(nodeID,2,4)"]][0];
    switch(currentTimeMode["trend"]){
        case "0":
            currentTrendTime = $("#trendQuickTime option:selected").text();
            break;
        case "1":
            currentTrendTime = currentSeleCondition["trend"]["timeStart"] + "至" + currentSeleCondition["trend"]["timeEnd"];
            break;
    }
    var trendData = $.extend(true, {}, data);
    optionBarForTrend.xAxis.data = $.extend(true, [], trendData["date"]);
    delete trendData["date"];
    var trendYdata = $.extend(true, {}, trendData);
    /*无数据的处理*/
    if(Object.keys(trendYdata).length == 0){
        noData();
    }
    else {

        var trendTotalData = new Array();
        optionBarForTrend.series.splice(1, optionBarForTrend.series.length - 1);
        optionBarForTrend.legend.data = [];

        optionBarForTrend.title.text = currrentCampus+"中"+currrentBuilding+"在"+currentTrendTime + "的" + currentAnalysisModeName[currentAnalysisMode] + "趋势";

        for (var i in trendYdata) {
            seriesForTrend.name = i;
            seriesForTrend.data = $.extend(true, [], trendData[i]);
            seriesForTrend.stack = currentAnalysisMode;
            seriesForTrend.itemStyle.normal.color = trendChartBarColor[i];

            optionBarForTrend.series.push($.extend(true, {}, seriesForTrend));
            optionBarForTrend.legend.data.push(i);

            if (trendTotalData.length == 0) {
                trendTotalData = $.extend(true, [], trendData[i]);
            }
            else {
                for (var j = 0; j < trendYdata[i].length; j++) {
                    trendTotalData[j] += trendYdata[i][j];
                }
            }
        }
        optionBarForTrend.series[0].data = $.extend(true, [], trendTotalData);

        if (typeof(trendBarChart) == 'undefined') {//如果趋势图表不存在，才生成一个
            initTrendChart();
        }
        else {
            trendBarChart.setOption(optionBarForTrend, true);//否则就是更新
        }
    }
}
/*更新楼栋图表*/
function resetBuildingChart(data) {
    switch(currentTimeMode["building"]){
        case "0":
            currentTrendTime = $("#buildingQuickTime option:selected").text();
            break;
        case "1":
            currentTrendTime = currentSeleCondition["building"]["timeStart"] + "至" + currentSeleCondition["building"]["timeEnd"];
            break;
    }

    var buildingData = $.extend(true, {}, data);
    var buildingYdata = $.extend(true, {}, initBuildingYdata);
    var buildingTotalData = 0;

    optionBarForBuilding.title.text = "所有楼栋在" + currentTrendTime + "的" + currentAnalysisModeName[currentAnalysisMode] + "数据";

    for (var i in buildingData) {
        var index = $.inArray(i, initBuildingXdata);
        buildingYdata[index] = buildingData[i];
        buildingTotalData += buildingData[i];
    }
    optionBarForBuilding.series.data = $.extend(true, [], buildingYdata);

    if (typeof(buildingBarChart) == 'undefined') {//如果图表不存在，才生成一个
        initBuildingBarChart();
    }
    else {
        buildingBarChart.setOption(optionBarForBuilding, true);//否则就是更新
    }

    if (typeof(buildingPieChart) != 'undefined') {//如果饼图存在，则清除
        buildingPieChart.clear();
    }

    /*点击柱状图更新饼图数据*/
    buildingBarChart.on("click", function (params) {
        var buildingValue = params.value;
        var buildingName = params.name;

        optionPieForBuilding.title.text = "楼栋" + currentAnalysisModeName[currentAnalysisMode] + "占比";
        optionPieForBuilding.series.data[0].value = buildingValue;
        optionPieForBuilding.series.data[0].name = buildingName;
        optionPieForBuilding.series.data[1].value = buildingTotalData - buildingValue;

        if (typeof(buildingPieChart) == 'undefined') {//如果图表不存在，才生成一个
            initBuildingPieChart();
        }
        else {
            buildingPieChart.setOption(optionPieForBuilding, true);//否则就是更新
        }
    });
}
/*无数据时提示*/
function noData(){
    var allimgFalse=document.createElement("div");
    allimgFalse.id="allImageFalse";
    $("#trendChartBar").append(allimgFalse);
    var img = document.createElement("img");
    img.id = "imageFalse";
    img.src="img/noData.png";
    $("#allImageFalse").append(img);
    var imgFalse=document.createElement("span");
    imgFalse.id="imgFalseTest";
    $("#allImageFalse").append(imgFalse);
    if (typeof(trendBarChart) != 'undefined') {//如果趋势图存在，则清除
        trendBarChart.clear();
    }
    $("#imgFalseTest").text(currrentCampus+"中"+currrentBuilding+"在"+currentTrendTime+"内状态良好，未发生新的"+currentAnalysisModeName[currentAnalysisMode]);

}
/*异常/报警页面切换*/
function abnormalAlarmSwitch() {
    $("#abnormalAlarmSwitch").on("click", function () {
        currentAnalysisMode = $(this).attr("changeMode");      //读取要切换到的页面
        switch (currentAnalysisMode) {
            case "1":
                $(this).attr("changeMode", "2");           //更新待切换页面标识
                $("#abnormalAlarmSwitch").html("报警分析");     //改变切换按钮的内容
                /*改变子系统选择项*/
                $("input.labelauty + label").remove();
                $("#checkbox1,#checkbox2,#checkbox3").removeAttr("disabled");
                $("#checkbox1,#checkbox2,#checkbox3").prop("checked",true);
                $(':input').labelauty();
                //$(".subSystem").css("opacity","1");
                $("#systemSubmit").css("display","block");
                break;
            case "2":
                $(this).attr("changeMode", "1");           //更新待切换页面标识
                $("#abnormalAlarmSwitch").html("异常分析");     //改变切换按钮的内容
                /*改变子系统选择项*/
                $("input.labelauty + label").remove();
                $("#checkbox1,#checkbox3").removeAttr("checked");
                $("#checkbox2").prop("checked",true);
                $("#checkbox1,#checkbox2,#checkbox3").prop("disabled",true);
                $(':input').labelauty();
                //$(".subSystem").css("opacity","0.2");
                $("#systemSubmit").css("display","none");
                break;
        }
        $(".abnoramlAndAlarm").html(currentAnalysisModeName[currentAnalysisMode]);      //更换页面中的显示
        resetSearch("trend");
        resetSearch("building");
        
    });
}

$(document).ready(function(){
	menuZoom("functionSelect");
    /*初始化*/
    $(':input').labelauty();
    $.getJSON("js/buildingFloor.js",function(buildingData) {
    	optionForCampus = $.extend(true,[],buildingData["optionForCampus"]);
		optionForBuildings = $.extend(true,{},buildingData["optionForBuildings"]);
		optionForFloors = $.extend(true,{},buildingData["optionForFloors"]);
		
		initSelectOption();
    abnormalAlarmSwitch();
    selectTimeChange();
    /*calendarLoading("trendStartTime","trendEndTime");
    calendarLoading("buildingStartTime","buildingEndTime");*/

    /*加载整页数据*/
    ajaxForEntireData();

    /*条件筛选框中  校区与楼栋的联动*/
    $("#selectsquare").change(function(){
        buildingSeleIndex["substr(nodeID,2,2)"] = $('#selectsquare option:selected').val();
        var campusSele = $('#selectsquare option:selected').text();
        buildingSeleIndex["substr(nodeID,2,4)"] = 0;
        resetSelectforSearch("selectbuilding",optionForBuildings[campusSele],buildingSeleIndex["substr(nodeID,2,4)"]);
    });

    /*筛选条件获取*/
    $(".selectResult").change(function(){
        var currentSelect = $(this).attr("condition");
        buildingSeleIndex[currentSelect] = $(this).children("option:selected").val();
        currentSeleCondition["trend"][currentSelect] = $(this).children("option:selected").attr("searchId");
        if(currentSeleCondition["trend"][currentSelect] == "0"){
            currentSeleCondition["trend"][currentSelect] = "";
        }
    });
    /*快捷时间获取*/
    $(".selectHandle").change(function(){
        var searchDiv = $(this).attr("condition");
        var currentQuickTime = $(this).children("option:selected").attr("searchId");
        currentQuickTimeCondition[searchDiv] = quickTimeCondition[searchDiv][currentQuickTime];
    });
    /*提交按钮*/
    $("#systemSubmit").on("click",function(){
        ajaxForEntireData();
    });
    $("#trendSubmit").on("click",function(){
        ajaxForTrendData();
    });
    $("#buildingSubmit").on("click",function(){
        ajaxForBuildingData();
    });
    /*重置按钮*/
    $("#trendReset").on("click",function(){
        resetSearch("trend");
    });
    $("#buildingReset").on("click",function(){
        resetSearch("building");
    });
    });
});
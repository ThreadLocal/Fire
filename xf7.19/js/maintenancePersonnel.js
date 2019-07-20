$(document).ready(function(){
	menuZoom("functionSelect");
    $("#personManagement").css({
        "border-bottom":"0.2rem white solid","background":" #4c4c4c","color":"white"
    });
    personAnalysis();
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data:{"controller": "StaffInfo","enum":"staffInfo"},
        dataType: "json",
        success: function(simuData){
        	var personnelInfo=simuData;
        	personnelTotalInfo(personnelInfo);
        }})
    
   /* $.ajax({
           type: "post",
           url: "../servlet/DispatchServlet",
           data:{"controller": "NotificationDocument"},
           dataType: "json",
           success: function(simuData){
           	var personnelInfo=simuData;
           	personnelTotalInfo(personnelInfo);
           }
       });*/

});
function personAnalysis(){
    myChart = echarts.init(document.getElementById('topChart-content'));
    	option = {
        tooltip:[
            {
                trigger: 'item',
                formatter:function(parmas){
                return parmas.name+":"+parmas.value;
            }
            },
        ],
        title: [	{
            text: '维保人员业务排行榜',
            x:"35%",
            y:'3%',
            textAlign: 'center'
        },
            {
                text: '维保人员业务统计',
                x: '90%',
                y:'3%',
                textAlign: 'center'
            },
        ],
        grid: [
            {
                width: '75%',
                top:50,
                left:5,
                bottom:10,
                containLabel: true
            },
            {
                width: '35%',
                top: 50,
                left:5,
                bottom:10,
                containLabel: true
            }
        ],
        xAxis:
        {
            name:'单',
            type: 'value',
            max: 0,
            splitLine: {
                show: false
            }
        },

        yAxis: [
            {

                name:'姓名',
                nameGap:5,
                type: 'category',
                data: [],/*获取键值*/
                axisLabel: {
                    interval: 0
                    /*rotate: 30*/
                },
                splitLine: {
                    show: false
                }
            }
        ],
        color:["#76b0d0","#eeeeee",'rgb(91,135,175)'],
        legend: {
            show: true,
            data: [
                {
                   
                    icon: "roundRect",
                    textStyle: {
                        fontSize: 12
                    }
                },
                {
                    
                    icon: "roundRect",
                    textStyle: {
                        fontSize: 12
                    }
                },
            ],

           right:'0',
            top: '80%',
            orient: 'vertical',
            itemWidth: 9,
            itemHeight: 7,
            itemGap: 5,

        },
        series: [
            {
                type: 'bar',
                stack: 'chart',
                z: 3,
                label: {
                    normal: {
                        position: 'right',
                        show: true
                    }
                },
                data:[]
            },
            {
                type: 'bar',
                stack: 'chart',
                silent: true,
                data:[]
            },

            {
                type: 'pie',
                hoverAnimation:false,
                selectedOffset:1,
                radius: [ '45%', '70%'],
                color:["#E9DAFF",'rgb(118,67,181)'],
                label: {
                    normal: {
                        show:false
                    }
                },
                itemStyle:{
                    emphasis:{
                    	 show:false
                    }
                },
                center: ['90%', '52%'],
                data: [],
            },
            {
                type: 'pie',
                silent: true,
                hoverAnimation:false,
                selectedOffset:1,
                radius: [ '0%', '45%'],
                center: ['90%', '52%'],
                data: [{
                    itemStyle:{
                        normal:{
                            color:'#F2F5F8'
                        }
                    }
                }],
                label: {
                    normal: {
                        show:true,
                        position:'center',
                        formatter:'',
                        textStyle:{
                            color:'black',
                            fontSize:18
                        }
                    }
                },
            }]
    };
    
}

function personnelTotalInfo(jsonState){
	 var navigation_html = '<li class="icon-page iconfont" id="first_page" title="首页">&#xea1a;</li><li class="icon-page iconfont" id="previous_page" title="上一页">&#xea44;</li>';
     // 图重新找
     navigation_html += '<li class="page_span1">第</li>';
     navigation_html += '<li class="input_box"><input  class="num_box" type="text"><li>'// 这里关于表单的还不知道
     navigation_html += '<li class="page_span2"> /' + '<span id="totalpage">&nbsp</span>'+'页</li>';
     navigation_html += '<li class="icon-page iconfont" id="next_page"  title="下一页">&#xea42;</li><li class="icon-page iconfont" id="last_page"  title="尾页">&#xea1b;</li>';// 链接到对应页
    $("#page_navigation ul").html(navigation_html);
    $('.num_box').val(1);
    $("#totalNum").html(jsonState["tableContent"].length);
	var max=0;
    $("#tableTbody").addClass("statistics");
    var contentArray=[];
    var contentArrayNum=0;
     pagenum=0; //初始化页码
    var newpagenum=1;
    var rowline=0; //初始化行数
    trcontent=[]; //初始化页内容
    var row='';//初始化表内容
    //获取表头内容
    tableheadercontent="";
    tableheadercontent=gettableHeader(jsonState["tableHeader"],tableheadercontent);
    var line=jsonState["tableHeader"].length;//获取列数;
    for(var key in jsonState["tableContent"]){
        for(var i=0;i<line;i++){
            if(contentArray[contentArrayNum]!= undefined){
                contentArray[contentArrayNum].push(jsonState["tableContent"][key][i]);
            }
            else{
                contentArray[contentArrayNum]=[];
                contentArray[contentArrayNum].push(jsonState["tableContent"][key][i]);
            }
        }
        contentArrayNum++;
    }
    $("#totalNum").html(contentArrayNum);
    contentArray =locaitonSort(contentArray);
    var sumNum=0;
    var staffNum = 0;
    if(contentArray.length < 10){
    	staffNum = contentArray.length;
    }
    else{
    	staffNum = 10;
    }
    for(var i=0;i<staffNum;i++){
        if(parseInt(contentArray[i][6])>max)
        {
            max=parseInt(contentArray[i][6]);
        }
        sumNum+=parseInt(contentArray[i][6]);
    	option.yAxis[0].data.unshift(contentArray[i][1]);
    	option.series[0].data.unshift(parseInt(contentArray[i][6]));
        if(i==0){
        	option.series[2].data.unshift({value:parseInt(contentArray[i][6]),name:contentArray[i][1]});
        	option.legend.data[0]["name"]=contentArray[i][1];
        }
    }
    option.legend.data[1]["name"]='其他接单情况';
	option.series[2].data.unshift({value:max,name:'其他接单情况'});
    option.series[3].label.normal.formatter='当月接单冠军'+'\n'+contentArray[0][1]+':'+contentArray[0][6];
    max=max+5;
    option.xAxis.max=max;
    for(var i=0;i<staffNum;i++){
    	option.series[1].data.unshift(max-parseInt(contentArray[i][6]));
    }
    myChart.setOption(option);
    getStatisticInfo(contentArray,rowline,row,line);
    pagenum++;
    $("#totalpage").text(pagenum);
    //默认加载第一页内容
    PageChange(trcontent,newpagenum);
    eventAgain(jsonState);
    //页码操作上下页，跳转事件
    operaView(newpagenum,jsonState);
}
function locaitonSort(array){
    array.sort(function(a,b){
        return b[6]-a[6];//比较当月接单
    });
    return array;
}



function operaView(newpagenum,jsonState){
    //键盘翻页
	 $(".num_box").on("keydown",function(event){
	    if(event.which==13 ){
	    	var inputPage=$(this).val();
	    	if(isNaN(inputPage)){
	    		$('.num_box').val(newpagenum);
			}
	    	else{
	    	if(inputPage>pagenum){
	    		newpagenum=pagenum;
	    		PageChange(trcontent,newpagenum);
	    		$('.num_box').val(newpagenum);
	    		eventAgain(jsonState);
	    	}
	    	else if(inputPage<1){
	    		newpagenum=1;
	    		PageChange(trcontent,newpagenum);
	    		$('.num_box').val(newpagenum);
	    		eventAgain(jsonState);
	    	}
	    	else {
	    		newpagenum=inputPage;
	    		PageChange(trcontent,newpagenum);
	    		$('.num_box').val(newpagenum);
	    		eventAgain(jsonState);
	    	}
	    	}
	    }
    });
    //向上翻页
    $("#previous_page").click(function(){
        if(newpagenum == 1){
        	$('.num_box').val(newpagenum);
            return
        }
        else{
            newpagenum--;
            PageChange(trcontent,newpagenum);
            $('.num_box').val(newpagenum);
            eventAgain(jsonState);
        }
    });
    //翻到首页
    $("#first_page").click(function(){
        if(newpagenum == 1){
        	$('.num_box').val(newpagenum);
            return
        }
        else{
            newpagenum=1;
            PageChange(trcontent,newpagenum);
            $('.num_box').val(newpagenum);
            eventAgain(jsonState);
        }
    });
    //翻到尾页
    $("#last_page").click(function(){
        if(newpagenum == pagenum){
        	$('.num_box').val(newpagenum);
            return
        }
        else{
            newpagenum=pagenum;
            PageChange(trcontent,newpagenum);
            $('.num_box').val(newpagenum);
            eventAgain(jsonState);
        }
    });
    //向下翻页
    $("#next_page").click(function(){
        if(newpagenum == pagenum){
        	$('.num_box').val(newpagenum);
            return;
        }
        else{
            newpagenum++;
            PageChange(trcontent,newpagenum);
            $('.num_box').val(newpagenum);
            eventAgain(jsonState);
        }
    });
}



function PageChange(trcontent,pagenum){
    $("#tableTbody").html(tableheadercontent+trcontent[pagenum-1]);
}



function getStatisticInfo(contentArray,rowline,row,line){
    rowline=0;
    for(var i=0;i<contentArray.length;i++){
        rowline++;
        //每10行为一页（不包括表头的行数）
        if(rowline == 11){
            trcontent[pagenum]=row;
            row='';
            rowline=1;
            pagenum++;
        }
        row+="<tr class='forPageChange'"+' '+'id'+'='+contentArray[i][0]+'>';
        row+="<td>"+rowline+"</td>";
        for(var j=0;j<line;j++){
            row+='<td title='+contentArray[i][j]+'>'+contentArray[i][j]+'</td>';
        }
        row+='</tr>';
        trcontent[pagenum]=row;
    }
    //将所有内容赋给trcontent数组，并将不足10行的补足空格
    var complement=10-rowline; //获取需要补足的行数个数
    for(var i=0;i<complement;i++){
        trcontent[pagenum]+='<tr>';
        for(var j=0;j<=line;j++){
            trcontent[pagenum]+='<td>'+'&nbsp'+'</td>';
        }
        trcontent[pagenum]+='</tr>';
    }
}

function gettableHeader(Header,content){
    content+='<tr><th>序号</th>';
    for(var key in Header){
        content+='<th>';
        content+=Header[key];
        content+='</th>';
    }
    content+='</tr>';
    return content;
};

function eventAgain(jsonState){
	$("#tableTbody tr").click(function(){
        var personnelNum=$(this).attr("id");
        var detailInfo=jsonState["tableContent"][personnelNum];
        
    });
}
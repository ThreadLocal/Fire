/**
 * Created by zyy on 2017/6/15.
 */

searchValue = "";       //模糊搜索的输入值

function ajaxForTotal() {
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": "PoliceAndRegulation"},
        dataType: "json",
        success: function (simuData) {
          	 var navigation_html = '<li class="icon-page iconfont" id="first_page" title="首页">&#xea1a;</li><li class="icon-page iconfont" id="previous_page" title="上一页">&#xea44;</li>';
             // 图重新找
             navigation_html += '<li class="page_span1">第</li>';
             navigation_html += '<li class="input_box"><input  class="num_box" type="text"><li>'// 这里关于表单的还不知道
             navigation_html += '<li class="page_span2"> /' + '<span id="totalpage">&nbsp</span>'+'页</li>';
             navigation_html += '<li class="icon-page iconfont" id="next_page"  title="下一页">&#xea42;</li><li class="icon-page iconfont" id="last_page"  title="尾页">&#xea1b;</li>';
            $("#page_navigation ul").html(navigation_html);
 
            var fileData = $.extend(true, [], simuData);
            dataProcessing(fileData, false);
        }
    });
}

function dataProcessing(domContent,flag){
    $('.num_box').val(1);
    var contentArray=[];
    var timeArray=[];
    pagenum=0;
    var newpagenum=1;
    var rowline=0;
    var lirow='';
    var timerow='';
    for(var domString=0;domString<domContent.length;domString++){
        rowline++;
        if(rowline == 17){
            contentArray[pagenum]=lirow;
            timeArray[pagenum]=timerow;
            lirow='';
            timerow='';
            rowline=1;
            pagenum++;
        }
        if(flag){
            var reg = new RegExp("("+searchValue+")","g");
            domContent[domString]["Name"] = domContent[domString]["Name"].replace(reg,"<font color=red>$1</font>");
        }
        lirow+="<a href="+"..\\"+domContent[domString]["Address"]+" download"+">"+domContent[domString]["Name"]+"</a>"+"&";
        timerow+=domContent[domString]["CreatTime"]+"&";
        contentArray[pagenum]=lirow;
        timeArray[pagenum]=timerow;
    }
    pagenum++;
    $("#totalpage").text(parseInt(pagenum));
    $("#totalNum").html(domContent.length);
    PageChange(contentArray,timeArray,0);
    operaView(newpagenum,contentArray,timeArray);
}

function operaView(newpagenum,contentArray,timeArray){
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
	    		PageChange(contentArray,timeArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
	    	}
	    	else if(inputPage<1){
	    		newpagenum=1;
	    		PageChange(contentArray,timeArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
	    	}
	    	else {
	    		newpagenum=inputPage;
	    		PageChange(contentArray,timeArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
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
            PageChange(contentArray,timeArray,newpagenum-1);
            $('.num_box').val(newpagenum);
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
            PageChange(contentArray,timeArray,newpagenum-1);
            $('.num_box').val(newpagenum);
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
            PageChange(contentArray,timeArray,newpagenum-1);
            $('.num_box').val(newpagenum);
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
            PageChange(contentArray,timeArray,newpagenum-1);
            $('.num_box').val(newpagenum);
        }
    });
}

function PageChange(contentArray,timeArray,pageNum){
    $("#detailNotice .views-row").find("span").html('');
    $(".hotImage").remove();
    var noticeContent=contentArray[pageNum];
    noticeContent=noticeContent.split("&");
    var noticeTime=timeArray[pageNum];
    noticeTime=noticeTime.split("&");
    if(pageNum ==0){
        for(var i=0;i<noticeContent.length-1;i++){
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(0).html(noticeContent[i]);
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(1).html(noticeTime[i]);
        }
        if (noticeContent.length < 5){
            var new_num = noticeContent.length-1;
        }
        else{
            var new_num = 5;
        }
        for(var i=0;i<new_num;i++){
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(0).after("<span class='hotImage'></span>");
        }
    }
    else{
        $("#detailNotice .views-row").find(".hotImage").remove();
        for(var i=0;i<noticeContent.length-1;i++){
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(0).html(noticeContent[i]);
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(1).html(noticeTime[i]);
        }
    }
}

function ajaxForSearch(){
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data:{"controller":"FuzzySearch","page": "policeandregulation","searchValue":searchValue},
        dataType: "json",
        success: function(simuData){
            var fileData = $.extend(true,[],simuData);
            dataProcessing(fileData,true);
        }
    });
}

$(document).ready(function(){
    menuZoom("functionSelect");
    ajaxForTotal();
    /*回车提交输入值*/
    $("#searchInput").on("keydown",function(event){
        if( event.which == 13 ){
            $("#searchSubmit").click();
        }
    });

    /*提交按钮*/
    $("#searchSubmit").on("click",function(){
        searchValue = $("#searchInput").val();//模糊查询输入获取
        if(searchValue != "") {
            ajaxForSearch();
        }
        else{
            ajaxForTotal();
        }
    });
    /*重置按钮*/
    $("#searchReset").on("click",function(){
        $("#searchInput").val("");
        ajaxForTotal();
    });
});

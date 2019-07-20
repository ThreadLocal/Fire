personnelInfo={
    /*"tableHeader":["员工工号","姓名","联系方式","负责区域","入职时间","在职状态","权限"],
    "tableContent":{
        "20131602001":["20131602001","李浩","12334679984","B区二综","2017-05-18","在岗","普通员工"],
        "20131602002":["20131602002","洋哥","13912345677","A区九宿舍","2017-05-18","在岗","管理员"],
        "20131602003":["20131602003","章黎","12345678901","A区五宿舍","2017-05-18","在岗","管理员"],
        "20141502001":["20141502001","翊峰","18723876899","A区第八教学楼","2017-05-22","在岗","普通员工"],
        "20141502002":["20141502002","一鸣","18656732789","A区六宿舍","2017-05-22","在岗","普通员工"],
        "20141502003":["20141502003","丹妮","13912345678","B区二综","2017-05-18","在岗","普通员工"],
        "20151313001":["20151313001","维保管理","13912345678","A区主教","2017-05-26","在岗","管理员"],
        "20151313002":["20151313002","维保小张","13812345678","A区6舍","2017-05-26","在岗","管理员"],
        "20151313003":["20151313003","维保小田","13912345678","A区19楼","2017-06-05","在岗","普通员工"],
        "20151313004":["20151313004","维保小明","12345678901","6舍","2017-06-05","在岗","普通员工"],
        "20151313005":["20151313005","维保小K","12345678901","A区","2017-06-05","在岗","普通员工"],
        "20151402001":["20151402001","柱哥","16728789238","主教1911","2017-05-22","在岗","普通员工"],
        "20151402002":["20151402002","老王","18967387364","A区第五教学楼","2017-05-22","在岗","管理员"],
        "20161302001":["20161302001","老吴","18716478934","A区主教","2017-05-18","在岗","普通员工"],
        "20161302002":["20161302002","刘卓","13867340034","A区主教","2017-05-18","在岗","普通员工"],
        "20161302003":["20161302003","武哥","18512345678","A区主教","2017-05-18","在岗","普通员工"]
    }*/
};

/*发送表单数据*/
formData = [];
operationState = {
    "addPerson":"添加",
    "modifyPerson":"修改"
};

deletePerson = [];			//要删除的人员ID

$(document).ready(function(){

    $("#personManagement").css({
        "border-bottom":"0.2rem white solid","background":" #4c4c4c","color":"white"
    });

    ajaxForStaffInfo();

    /*全选框*/
    $("#checkAll").click(function() {
        $('input[name="deleteBox"]').prop("checked",this.checked);
    });
    var $subBox = $("input[name='deleteBox']");
    $subBox.click(function(){
        $("#checkAll").prop("checked",$subBox.length == $("input[name='deleteBox']:checked").length ? true : false);
    });

    /*新增按钮*/
    $("#uploadbutton").on("click",function(){
        noticeWindow("新增维保人员",formContent,"addPerson");
        event.stopPropagation();
    });
    /*删除按钮*/
    $("#deletebutton").on("click",function() {
        deletePerson = [];
        $("input[name='deleteBox']:checked").each(function(){
            deletePerson.push($(this).parent().parent().attr("id"));
        });
        if(deletePerson.length != 0){
            ajaxForDelete();
        }
        else{
			alert("请选择删除条目");
		}
        event.stopPropagation();
    });

});

/*所有数据*/
function ajaxForStaffInfo(){
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data:{"controller": "StaffInfo","enum":"staffInfo"},
        dataType: "json",
        success: function(simuData){
            var personnelInfo=simuData;
            personnelTotalInfo(personnelInfo);
        }
    });
}

/*Ajax发送表单数据*/
function ajaxForForm(operation){
    formData = JSON.stringify(formData);
    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        data:{"controller":"SystemManagement","system":"staff","enum":operation,"jsonPara":formData},
        success:function(data) {

            switch (data){
                case "success":
                    /*$("#submitCheck").html(operationState[operation]+"成功");
                    $("input[class='fileInput']").each(function(){
                        $(this).val("");
                    });*/
                	$("#noticeDiv").remove();
                	alert(operationState[operation]+"成功");
                    ajaxForStaffInfo();
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

//删除
function ajaxForDelete(){
    deletePerson = JSON.stringify(deletePerson);

    $.ajax({
        type:"post",
        url:"../servlet/DispatchServlet",
        /*data:{"controller":"Delete","Id":deleteEquip,"IdName":"fireFacilityID","formName":"fire_facility"},*/
        data:{"controller":"SystemManagement","system":"staff","enum":"deletePerson","jsonPara":deletePerson},
        success:function(deleteData) {
            switch (deleteData){
                case "success":
                    alert("删除成功");
                    ajaxForStaffInfo();
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

//弹出框的样式
function popUpWindow(){
    var newCoverDiv = document.createElement("div");
    newCoverDiv.id = "detailCoverLayerDiv";
    $("body").append(newCoverDiv);
    $("#detailCoverLayerDiv").css('width',"100%");
    $("#detailCoverLayerDiv").css('height',"100%");
    var newDetailDiv = document.createElement("div");
    newDetailDiv.id = "detailDiv";
    newDetailDiv.className = "windowDetailBody";
    $("#detailCoverLayerDiv").append(newDetailDiv);

    var newDetailDivTitle = document.createElement("div");
    newDetailDiv1.id = "#detailDivTitle";
    $("#detailDiv").append(newDetailDiv1);

    var newDetailDiv1 = document.createElement("div");
    newDetailDiv1.id = "#detailDiv1";
    $("#detailDiv").append(newDetailDiv1);

    var newDetailTitleDiv = document.createElement("div");
    newDetailTitleDiv.id = "detailTitleDiv";
    newDetailTitleDiv.className = "windowDetailTitle"
    $("#detailDiv").append(newDetailTitleDiv);
    $("#detailTitleDiv").text("通知公告");

    var newNoticeCloseImg = document.createElement("img");
    newNoticeCloseImg.id = "detailCloseImg";
    newNoticeCloseImg.className = "windowDetailClose";
    newNoticeCloseImg.src = "images/icons/close-1.png";
    $("#detailDiv").append(newNoticeCloseImg);

    var newNoticeContentDiv = document.createElement("div");
    newNoticeContentDiv.id = "detailContentDiv";
    $("#detailDiv").append(newNoticeContentDiv);
    $("#detailContentDiv").text("当前为空");

    $("#detailDiv").draggable({
            handle:'#detailTitleDiv'
        }
    );

    $("#detailCloseImg").on("click",function(){
            $("#detailCoverLayerDiv").fadeOut(250,function(){
                $("#detailCoverLayerDiv").remove();
            });
        }
    );

    $("#detailCoverLayerDiv").on("click",function(){
            $("#detailCoverLayerDiv").fadeOut(250,function(){
                $("#detailCoverLayerDiv").remove();
            });
        }
    );
    $("#detailDiv").on("click",function(event){
        event.stopPropagation();
    });
}



function personnelTotalInfo(jsonState){
	 var navigation_html = '<li class="icon-page iconfont" id="first_page" title="首页">&#xea1a;</li><li class="icon-page iconfont" id="previous_page" title="上一页">&#xea44;</li>';
     // 图重新找
     navigation_html += '<li class="page_span1">第</li>';
     navigation_html += '<li class="input_box"><input  class="num_box" type="text"><li>'// 这里关于表单的还不知道
     navigation_html += '<li class="page_span2"> /' + '<span id="totalpage">&nbsp</span>'+'页</li>';
     navigation_html += '<li class="icon-page iconfont" id="next_page"  title="下一页">&#xea42;</li><li class="icon-page iconfont" id="last_page"  title="尾页">&#xea1b;</li>';
    $("#page_navigation ul").html(navigation_html);
    $('.num_box').val(1);

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
            if(contentArray[contentArrayNum] != undefined){
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

    getStatisticInfo(contentArray,rowline,row,line);
    pagenum++;
    $("#totalpage").text(pagenum);
    //默认加载第一页内容
    PageChange(trcontent,newpagenum);
    //页码操作上下页，跳转事件
    operaView(newpagenum,jsonState);
}
function locaitonSort(array){
    array.sort(function(a,b){
        return b[7]-a[7];//比较当月接单
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
	    	}
	    	else if(inputPage<1){
	    		newpagenum=1;
	    		PageChange(trcontent,newpagenum);
	    		$('.num_box').val(newpagenum);
	    	}
	    	else {
	    		newpagenum=inputPage;
	    		PageChange(trcontent,newpagenum);
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
            PageChange(trcontent,newpagenum);
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
            PageChange(trcontent,newpagenum);
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
            PageChange(trcontent,newpagenum);
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
            PageChange(trcontent,newpagenum);
            $('.num_box').val(newpagenum);
        }
    });
}



function PageChange(trcontent,pagenum){
    $("#tableTbody").html(tableheadercontent+trcontent[pagenum-1]);
    /*全选框*/
    $("#checkAll").click(function() {
        $('input[name="deleteBox"]').prop("checked",this.checked);
    });
    var $subBox = $("input[name='deleteBox']");
    $subBox.click(function(){
        $("#checkAll").prop("checked",$subBox.length == $("input[name='deleteBox']:checked").length ? true : false);
    });
    /*修改按钮*/
    $(".changebutton").on("click",function(){
        var $this = $(this);
        noticeWindow("修改维保人员信息",formContent,"modifyPerson");

        var $tds =$this.parent().contents();
        var $editInput = $("#contentFormDiv").find("input[class='fileInput']")
        for(var i=2;i<8;i++){
            $editInput.eq(i-2).attr("value",$tds[i].innerText);
        }
        $editInput.each(function(){
            $(this).attr("value",$this.parent().attr($(this).attr("name")));
        });

        event.stopPropagation();
    });
}



function getStatisticInfo(contentArray,rowline,row,line){
    rowline=0;
    for(var i=0;i<contentArray.length;i++){
        rowline++;
        //每20行为一页（不包括表头的行数）
        if(rowline == 16){
            trcontent[pagenum]=row;
            row='';
            rowline=1;
            pagenum++;
        }
        row+="<tr class='forPageChange'"+' '+'id'+'='+contentArray[i][0]+'>';
        row+="<td><input type='checkbox' name='deleteBox'></td>";
        row+="<td>"+rowline+"</td>";
        for(var j=0;j<line;j++){
            row+='<td title='+contentArray[i][j]+'>'+contentArray[i][j]+'</td>';
        }
        row += '<td class="changebutton">' + '修改' + '</td>';
        row+='</tr>';
        trcontent[pagenum]=row;
    }
    //将所有内容赋给trcontent数组，并将不足10行的补足空格
    var complement=15-rowline; //获取需要补足的行数个数
    for(var i=0;i<complement;i++){
        trcontent[pagenum]+='<tr>';
        for(var j=0;j<line+3;j++){
            trcontent[pagenum]+='<td>'+'&nbsp'+'</td>';
        }
        trcontent[pagenum]+='</tr>';
    }
}

function gettableHeader(Header,content){
    content+='<tr>';
    content+="<th><input type='checkbox' id='checkAll'></th>";
    content+="<th>序号</th>";
    for(var key in Header){
        content+='<th>';
        content+=Header[key];
        content+='</th>';
    }
    //这里要加一项，操作栏，还有第一栏加的是添加新的数据
    content+= "<th>操作</th></tr>";
    return content;
}

/*function eventAgain(jsonState){
	$("#tableTbody tr").click(function(){
        var personnelNum=$(this).attr("id");
        var detailInfo=jsonState["tableContent"][personnelNum];

    });
}*/


/**
 * Created by Administrator on 2017/8/29.
 */

/*表单弹出框*/
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
    /*$("#noticeContentDiv").html(contentName);*/

    var contentFormDiv = document.createElement("div");
    contentFormDiv.id = "contentFormDiv";
    $("#newNoticeContentDiv").append(contentFormDiv);
    $("#contentFormDiv").html('<form>'+formContent
        +'<input name="sure" type="button" value="确定" id="newButtonDiv1" class="newButtonDiv">'
        +'<input name="no" type="button" value="取消" id="newButtonDiv2" class="newButtonDiv">'
        +'</form>');
    if(operation=="modifyPerson"){
    	$("[name=StaffID]").attr("disabled","disabled");
    }

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

    /*表单提交按钮*/
    $("#newButtonDiv1").on("click",function(){
            formData = [];
            var $editInput = $("input[class='fileInput']");
            var submitWarning = "";
            $editInput.each(function(){
                var value = $(this).val();
                if($(this).attr("necessity") == "1" && value == ""){
                    submitWarning = submitWarning + $(this).attr("chName") + "&nbsp&nbsp";
                }
                formData.push($(this).val());
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
        }
    );
}

var formContent='<span style="color:red">*</span>'+'&nbsp员工工号：'+'<input name="StaffID" type="text" value="" maxlength="11" class="fileInput" chname="员工工号" necessity="1">'+'&nbsp&nbsp(11位数字编号)'+'<br>'
    +'<span style="color:red">*</span>'+'&nbsp姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名：'+'<input name="StaffName" type="text" value="" class="fileInput" chname="姓名" necessity="1">'+'<br>'
    +'<span style="color:red">*</span>'+'&nbsp联系方式：'+'<input name="StaffPhoneNumber" type="text" value="" class="fileInput" chname="联系方式" necessity="1">'+'<br>'
    +'<span style="color:red">*</span>'+'&nbsp负责区域：'+'<input name="StaffWorkArea" type="text" value="" class="fileInput" chname="负责区域" necessity="1">'+'<br>'
    +'<span style="color:red">*</span>'+'&nbsp入职时间：'+'<input name="entryTime" type="date" value="" class="fileInput" chname="入职时间" necessity="1">'+'<br>'
    +'<span style="color:red">*</span>'+'&nbsp在职状态：'+'<input name="StaffStatus" type="text" value="" class="fileInput" chname="在职状态" necessity="1">'+'<br>'
    +'<div id="submitCheck">'+'&nbsp'+'</div>';
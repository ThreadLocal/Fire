


$(document).ready(function() {
	
	var indexDiv='<div id="indexPage">'+'<span class="iconfont">'+'&#xe900;'+'</span>'+'&nbsp&nbsp&nbsp&nbsp系统首页'+'</div>';
	$("#menuDiv").append(indexDiv);
	var modifyParam='<li id="modifyParam" >'+
                    '<img src="images/public/modifyParam.png"/>'+
                    '<span> 设备阈值管理</span>'+
                    '</li>';
	$("#pageSelect").append(modifyParam);
	
	var StaffID=getCookie('StaffID');
	var StaffName=getCookie('StaffName');
	var StaffPhoneNumber=getCookie('StaffPhoneNumber');
	
	if(StaffID=='')
	{
	    location.href="login.htm";
	}
	staffInfo={};
	staffInfo["StaffID"]=StaffID;
	staffInfo["StaffName"]=StaffName;
	staffInfo["StaffPhoneNumber"]=StaffPhoneNumber;
	$("#login span:eq(0)").text(StaffName);
	$("#loginOut").click(function(){
		//删除cookie
		  DelCookie("StaffID");
		  DelCookie("StaffName");
		  DelCookie("StaffPhoneNumber");
		  location.href="login.htm";
	});
	$(".anchorBL").remove();//百度地图字去掉
	$("#scrollDiv").css({"width":1800,"float":"left"});
	$("#scrollDiv").before("<div id='changeDom' style='width:50px;height:25px;margin-right:20px;float:left'>"+"</div>");
	$("#changeDom").html("<div class='iconfont' id='controlServlet' state='start'>"+"&#xea16;"+"</div>");
	$("#indexPage").click(function(){
		window.location.href="../xf5.19/index.htm";
	});
	newurl='../../../';
	newweb="ws://127.0.0.1:8080//";
	loginSelect();
	/*menuZoom();*/
	 $.ajax({
         type: "post",
         url: "../servlet/DispatchServlet",
         data:{"controller": "NotificationDocument","DocumentName":'Newest'},
         dataType: "json",
         success: function(simuData){
        	  var domContent=simuData;
        	 var scrollBeginContent="";
        	 for(var domString in domContent){
        		 scrollBeginContent+="&nbsp;&nbsp;&nbsp;&nbsp;";
        		 scrollBeginContent+=(parseInt(domString)+1)+".";
        		 scrollBeginContent+=domContent[domString]["Name"];
        	 }
        	 var text_width=scrollBeginContent.textOffsetWidth();//获取此次通告的实际占宽
             /*根据长度选择覆盖的次数填充无缝滚动*/
             var total_text=[];//临时统计循环后的字符
             for(var i=1;i>-1;i++){
             	if(text_width*i >= 1800){
             		for(var j=0;j<i;j++){
             			total_text.push(scrollBeginContent);
             		}
             		scrollBeginContent=total_text.join("")+scrollBeginContent;
             		break;
             	}
             }
        	 $("#scrollBegin").html("<a style='color:#41d687' href='../xf8.29/notificationDocumentSet.htm'>"+scrollBeginContent+"</a>");
        	 $("#scrollEnd").html("<a style='color:#41d687' href='../xf8.29/notificationDocumentSet.htm'>"+scrollBeginContent+"</a>");
         }
     });
	addLocationHref();
//	menuFix();//右侧下拉框
	startTime();//时间显示
	ScrollNoticeLeft();
	$("#numNotice").text("0");
	$("#numNotice").click(function () {
		noticeWindow("暂无公告内容");
	});
	/*addlvjing();*/
	//将default.js作为公用JS方法的定义文件，按道理不应该在这里加载内容//
	$("#laws").css("display","none");

	//滚动的通知公告显示
	/*$("#scrollDiv").click(function(){
		//var noticecontent='</br>'+'<li>'+'<img src="images/basicstatic/联网节点.png">'+'<span>'+'监测节点数'+':'+simuDatasimuData.fire_node+'</span>'+'</li>'+'<li>'+'<img src="images/basicstatic/节点异常率.png">'+'<span>'+'节点异常率'+':'+(parseFloat(simuDatasimuData.node_normal_rate)*100).toFixed(2)+'%'+'</span>'+'</li>'+'<li>'+'<img src="images/basicstatic/联网设备.png">'+'<span>'+'监测主机数'+':'+simuDatasimuData.fire_host+'</span>'+'</li>'+'<li>'+'<img src="images/basicstatic/设备故障率.png">'+'<span>'+'主机异常率'+':'+(parseFloat(simuDatasimuData.host_normal_rate)*100).toFixed(2)+'%'+'</span>'+'</li>';
		var noticecontent='</br>'+'<li>'+'<span>'+'通知公告的内容1'+':'+'</span>'+'</li>'+'<li>'+'<span>'+'通知公告的内容2'+':'+'</span>'+'</li>'+'<li>'+'<span>'+'通知公告的内容3'+':'+'</span>'+'</li>'+'<li>'+'<span>'+'通知公告的内容4'+':'+'</span>'+'</li>';
		noticeWindoww();
		$("#noticeContentDivv").html(noticecontent);
		
	});*/

});
String.prototype.textOffsetWidth=function(){
	$(body).append("<div id='ruler'></div>");
	$("#ruler").text(this);
	return $("#ruler")[0].offsetWidth;
}
/*侧边栏收缩*/
function menuZoom(para){

	switch (para){
		case "indexAndCampus":

			$("#pageSelect").css("display","none");
			var pageSelectFlag = true;
			$("#menuName").on("click", function () {
				if(functionSelectFlag==false){
					$("#functionSelect").slideUp();
					$("#businessManagement .menuDown").html("&#xf05b;");
					$("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						/*$("#pageSelect").slideDown();*/
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						/*$("#pageSelect").slideDown();*/
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}
			});

			$("#functionSelect").css("display","none");
			var functionSelectFlag =true;
			$("#businessManagement").on("click", function () {
				if(pageSelectFlag==false){
					$("#pageSelect").slideUp();
					$("#menuName .menuDown").html("&#xf05b;");
					$("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
				}
			});
			break;

		case"subsystemSelect":

			$("#menuName").css("background-color","#224e9c");
			$("#menuName .menuDown").html("&#xf0aa;");
			var pageSelectFlag = false;
			$("#menuName").on("click", function () {
				if(functionSelectFlag==false){
					$("#functionSelect").slideUp();
					$("#businessManagement .menuDown").html("&#xf05b;");
					$("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag==false) {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag==false) {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
				}
			});

			$("#functionSelect").css("display","none");
			var functionSelectFlag =true;
			$("#businessManagement").on("click", function () {
				if(pageSelectFlag==false){
					$("#pageSelect").slideUp();
					$("#menuName .menuDown").html("&#xf05b;");
					$("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}

				}
			});
			break;

		case"functionSelect":

			$("#businessManagement").css("background-color","#224e9c");
			$("#businessManagement .menuDown").html("&#xf0aa;");
			var functionSelectFlag = false;
			$("#businessManagement").on("click", function () {
				if(pageSelectFlag==false){
					$("#pageSelect").slideUp();
					$("#menuName .menuDown").html("&#xf05b;");
					$("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
				}
			});

			$("#pageSelect").css("display","none");
			var pageSelectFlag =true;
			$("#menuName").on("click", function () {
				if(functionSelectFlag==false){
					$("#functionSelect").slideUp();
					$("#businessManagement .menuDown").html("&#xf05b;");
					$("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}

				}
			});
			break;

			/*$("#pageSelect").css("display","none");
			var pageSelectFlag = true;
			$("#menuName").on("click", function () {
				if(functionSelectFlag==false){
					$("#functionSelect").slideUp();
					$("#businessManagement .menuDown").html("&#xf05b;");
					$("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag==false) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag==false) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#224e9c");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}
			});

			$("#businessManagement").css("background-color","#224e9c");
			$("#businessManagement .menuDown").html("&#xf0aa;");
			var functionSelectFlag =false;
			$("#businessManagement").on("click", function () {
				if(pageSelect==false){
					$("#pageSelect").slideUp();
					$("#menuName .menuDown").html("&#xf05b;");
					$("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
				} else{
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#224e9c");
						functionSelectFlag = !functionSelectFlag;
					}
				}
			});*/
	}

}

/*
 * 
 * 横向滚动文字
 * */
function ScrollNoticeLeft(){
	var speed=50;
	var scroll_begin = document.getElementById("scrollBegin");
	var scroll_end = document.getElementById("scrollEnd");
	var scroll_div = document.getElementById("scrollDiv");
	function Marquee(){
		if((scroll_end.offsetWidth)*2-scroll_div.offsetWidth<=scroll_div.scrollLeft)
			scroll_div.scrollLeft-=scroll_begin.offsetWidth;
		else
			scroll_div.scrollLeft++;
	}
	var MyMar=setInterval(Marquee,speed);
	$("#controlServlet").click(function(){
		if($(this).attr("state") == "start"){
			$(this).attr("state","stop");
			clearInterval(MyMar);
			$(this).html('&#xea15;');
		}
		else{
			$(this).attr("state","start");
			MyMar=setInterval(Marquee,speed);
			$(this).html('&#xea16;');
		}
	})
	scroll_div.onmouseover=function() {
		clearInterval(MyMar);
		}
	scroll_div.onmouseout=function() {
		if($("#controlServlet").attr("state") == "start"){
			MyMar=setInterval(Marquee,speed);	
		}		
		}
}

//加滤镜
function addlvjing(){
	$("body").css('filter',' hue-rotate(180deg) invert(95%) brightness(100%)')
	$("body").css('-webkit-filter',' hue-rotate(180deg) invert(95%) brightness(120%) saturate(150%)')}

/*设置页面宽高*/
function sizeset() {
	/*win_w=screen.availWidth;
	 win_h=screen.availHeight;*/
	win_w=screen.width;
	win_h=screen.height;
	$("body").css("width",win_w+"px");
	$("body").css("height",win_h+"px");
	var win_s = win_w * 16 * 0.625 / 1920;
	$("html").css("font-size", win_s + "px");
	$('html').css('overflow','auto');


}
/*加载右上角时间*/
function startTime()
{
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var w=today.getDay();
	var y=today.getFullYear();
	var mt=today.getMonth()+1;
	var d=today.getDate();
	//var mms=today.getMilliseconds();
	var weekChn = ["日","一","二","三","四","五","六"];

	// add a zero in front of numbers<10
	h=checkTime(h);
	m=checkTime(m);
	s=checkTime(s);

	$("#nowTime").text(h+":"+m+":"+s);
	$("#nowDate").text(y+"年"+mt+"月"+d+"日");
	$("#nowWeek").text("星期"+weekChn[w]);
	setTimeout('startTime()',1000);
}
function checkTime(i)
{
	if (i<10) {i="0" + i}
	return i
}
/*-------------*/

/*公告提示和弹窗*/
function noticeWindow(noticeStr){
	var newCoverDiv = document.createElement("div");
	newCoverDiv.id = "noticeCoverLayerDiv";
	$("body").append(newCoverDiv);
	$("#noticeCoverLayerDiv").css('width',win_w);
	$("#noticeCoverLayerDiv").css('height',win_h);
	var newNoticeDiv = document.createElement("div");
	newNoticeDiv.id = "noticeDiv";
	newNoticeDiv.className = "windowBody";
	$("#noticeCoverLayerDiv").append(newNoticeDiv);

	var newNoticeTitleDiv = document.createElement("div");
	newNoticeTitleDiv.id = "noticeTitleDiv";
	newNoticeTitleDiv.className = "windowTitle"
	$("#noticeDiv").append(newNoticeTitleDiv);
	$("#noticeTitleDiv").text("通知公告");

	var newNoticeCloseImg = document.createElement("img");
	newNoticeCloseImg.id = "noticeCloseImg";
	newNoticeCloseImg.className = "windowClose";
	newNoticeCloseImg.src = "images/icons/close-1.png";
	$("#noticeDiv").append(newNoticeCloseImg);

	var newNoticeContentDiv = document.createElement("div");
	newNoticeContentDiv.id = "noticeContentDiv";
	$("#noticeDiv").append(newNoticeContentDiv);
	$("#noticeContentDiv").text(noticeStr);

	$("#noticeDiv").draggable({
			handle:'#noticeTitleDiv'
		}
	);

	$("#noticeCloseImg").on("click",function(){
			$("#noticeCoverLayerDiv").fadeOut(250,function(){
				$("#noticeCoverLayerDiv").remove();
			});
		}
	);

	$("#noticeCoverLayerDiv").on("click",function(){
			$("#noticeCoverLayerDiv").fadeOut(250,function(){
				$("#noticeCoverLayerDiv").remove();
			});
		}
	);
	$("#noticeDiv").on("click",function(event){
		event.stopPropagation();
	});
}
/*跳转页面*/
function addLocationHref(){
	/*转到视图总览页面*/
	$("#subSystemPage").click(function(){
		window.location.href="campusMap.htm";
	});
	/*子系统页面跳转*/
	$("#pageSelect li").click(function(){
		location.href = $(this).attr("id") + ".htm";
	});
	/*业务管理功能选择*/
	$("#functionSelect li").click(function(){
		location.href = $(this).attr("id") + ".htm";
	});

}


function lsy () {
	var url = location.search; //获取url中"?"符后的字串
	/*url=decodeURI(url);*/
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/*var noticeWidth="450px";弹框宽度
var noticeHeight="220px";弹框高度*/
function noticeWindowForLogin(titleName,content,noticeWidth,noticeHeight,operation){

    if(typeof($("#noticeDivForLogin")) != undefined){
        $("#noticeDivForLogin").remove();
    }

    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDivForLogin";
    newNoticeDiv.className = "windowBodyForLogin";
    $("body").append(newNoticeDiv);
    $("#noticeDivForLogin").css({"width":noticeWidth,"height":noticeHeight});


    var newNoticeTitleDiv = document.createElement("div");
    newNoticeTitleDiv.id = "noticeTitleDivForLogin";
    newNoticeTitleDiv.className = "windowTitleForLogin";
    $("#noticeDivForLogin").append(newNoticeTitleDiv);
    $("#noticeTitleDivForLogin").html('<span>'+titleName+'</span>'+'<span class="iconfont" id="windowCloseForLogin">'+'&#xf081'+'</span>');
    $("#noticeTitleDivForLogin").css({'background-color':'rgb(44, 146, 146)','color':'#fff'});

    var newNoticeContentDiv = document.createElement("div");
    newNoticeContentDiv.id = "newNoticeContentDivForLogin";
    $("#noticeDivForLogin").append(newNoticeContentDiv);
    
    var contentFormDiv = document.createElement("div");
    contentFormDiv.id = "contentFormDivForLogin";
    $("#newNoticeContentDivForLogin").append(contentFormDiv);
    $("#contentFormDivForLogin").html('<form>'
        +'<div id="formSubmitForLogin">'+'<input name="sure" type="button" value="确定" id="newButtonDiv1ForLogin" class="newButtonDivForLogin">'
        +'<input name="no" type="button" value="取消" id="newButtonDiv2ForLogin" class="newButtonDivForLogin">'
        +'<div>'
        +'</form>');

    var formContentDiv=document.createElement("div");
    formContentDiv.id = "formContentDivForLogin";
    $("#contentFormDivForLogin form").append(formContentDiv);
    $("#formContentDivForLogin").html(content);
    

    $("#noticeDivForLogin").draggable({
            handle:'#noticeTitleDivForLogin'
        }
    );

    $("#windowCloseForLogin").on("click",function(){
            $("#noticeDivForLogin").fadeOut(0,function(){
                $("#noticeDivForLogin").remove();
            });
        }
    );

	/*表单提交按钮*/
	$("#newButtonDiv1ForLogin").on("click",function() {
		switch (operation) {
			case "changeBasicInfo":
				var formData = [];
				formData.push(staffInfo["StaffID"]);

				var $editInput = $("input[class='fileInputForLogin']");
				$editInput.each(function(){
					formData.push($(this).val());
				});
				ajaxForStaff("changeBasicInfo",formData);
				break;
			case "changePassword":
				var oldPassword,newPassword,newPasswordAgain,formData=[];

				oldPassword = $("input[name='oldPassword']").val();
				newPassword = $("input[name='newPassword']").val();
				newPasswordAgain = $("input[name='newPasswordAgain']").val();
				if(newPassword != newPasswordAgain){
					$("#submitCheck").html("两次密码输入不一致");
				}
				else{
					formData=[staffInfo["StaffID"],oldPassword,newPasswordAgain];
					ajaxForStaff("changePassword",formData);
				}
				break;
		}
		event.stopPropagation();
	});
    $("#newButtonDiv2ForLogin").on("click",function(){
            $("#noticeDivForLogin").fadeOut(0,function(){
                $("#noticeDivForLogin").remove();
            });
        }
    );
}
//用户部分的弹框
function loginSelect(){
$("#pop-select ul li").hover(function(){
	$(this).css("color","white");
	$(this).css("background","rgb(70, 126, 215)");
	$(this).find("span").css("color","white");
},function(){
	$(this).css("color","#646464");
	$(this).css("background","white");
	$(this).find("span").css("color","#646464");
});
	var flag=true;
	$("#login").on("click",function(){
		if(flag==true) {
			$("#user-pop").slideDown(400);
			$("#login-button").html("&#xf0aa;");
			flag = false;
			
			$("#userInformation").on("click",function() {
				var infoContent = '&nbsp&nbsp用&nbsp&nbsp户&nbsp&nbsp名：' + /*'<input name="StaffID" type="text" value="" maxlength="11" class="fileInput" chname="用户名" necessity="1">'*/'<span id=StaffID></span>' + '<br>'
					+ '<span style="color:red">*</span>' + '&nbsp姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名：' + '<input name="StaffName" type="text" value="" class="fileInputForLogin" chname="姓名" necessity="1">' + '<br>'
					+ '<span style="color:red">*</span>' + '&nbsp联系方式：' + '<input name="StaffPhoneNumber" type="text" value="" class="fileInputForLogin" chname="手机号码" necessity="1">' + '<br>'
					+ '<div id="submitCheck"></div>';

				noticeWindowForLogin("个人资料", infoContent, "300px", "220px", "changeBasicInfo");

				$("#StaffID").text(staffInfo["StaffID"]);
				$("input[name='StaffName']").val(staffInfo["StaffName"]);
				$("input[name='StaffPhoneNumber']").val(staffInfo["StaffPhoneNumber"]);
			});
			
			$("#passWord").on("click",function(){
				
				var infoContent='<span style="color:red">*</span>'+'&nbsp原&nbsp密&nbsp码：'+'<input name="oldPassword" type="password" value="" maxlength="11" class="fileInputForLogin" chname="原密码" necessity="1">'+'<br>'
	    	    +'<span style="color:red">*</span>'+'&nbsp新&nbsp密&nbsp码：'+'<input name="newPassword" type="password" value="" class="fileInputForLogin" chname="新密码" necessity="1">'+'<br>'
	    	    +'<span style="color:red">*</span>'+'&nbsp确认密码：'+'<input name="newPasswordAgain" type="password" value="" class="fileInputForLogin" chname="确认密码" necessity="1">'+'<br>'
	    	    +'<div id="submitCheck"></div>';
	    	   
				noticeWindowForLogin("修改密码",infoContent,"300px","220px","changePassword");
				$(".fileInputForLogin").on("focus",function(){
					$(".fileInputForLogin").on("blur",function(){
						if($(this).val() == ""){
							$("#submitCheck").html($(this).attr("chname")+"不能为空");
						}
					});
				});
			});
			
		}
		else{
			$("#user-pop").slideUp(400);
			$("#login-button").html("&#xf05b;");
			flag=true;
		}
			event.stopPropagation();
	});
	$(document).click(function(){
		$("#user-pop").slideUp(400);
		$("#login-button").html("&#xf05b;");
		flag=true;
	});

}
/**
 * 判断一个json对象是否为空，即{}
 *
 * @param jsonObject
 * @returns {boolean}
 */
var jsonObjectIsEmpty = function(jsonObject){
    var isEmpty = true;
    for (var prop in jsonObject){
        isEmpty = false;
        break;
    }

    return isEmpty;
}
/**
 * 发生错误
 */
function noInternet(address,text){
    $('#noInternet').remove();
    $('#noInternet').css("display","none");
    var noInternet=document.createElement("div");
    noInternet.id="noInternet"; 
    $("#"+address).append(noInternet);
    var img = document.createElement("img");
    img.id = "imageDiv";
    img.src="img/noData.png";
    $("#noInternet").append(img);
    var imgFalse=document.createElement("span");
    imgFalse.id="imgFalseDiv";
    $("#noInternet").append(imgFalse);
    $("#imgFalseDiv").text(text);   
}

/*
* 修改密码和修改个人信息
* */
function ajaxForStaff(data,formData){
	
	formData = JSON.stringify(formData);
	$.ajax({
		type:"post",
		url:"../servlet/DispatchServlet",
		data:{"controller":"AdministratorInfoChange","enum":data,"jsonPara":formData},
		success:function(feedback) {
			switch (feedback){
				case "Success":
					$("#submitCheck").html("修改成功");
					if(data == "changeBasicInfo"){
						formData = $.parseJSON(formData);
						SetCookie("StaffName",formData[1]);
						SetCookie("StaffPhoneNumber",formData[2]);
						staffInfo["StaffName"]=formData[1];
						staffInfo["StaffPhoneNumber"]=formData[2];
						$("#login span:eq(0)").text(formData[1]);
					}
					break;
				case "Error":
					$("#submitCheck").html("修改失败");
					break;
				case "OldPassword Error":
					$("#submitCheck").html("密码错误");
			}
		},
		error:function() {
			$("#submitCheck").html("修改失败");
		}
	});
}
/*获取cookie*/
function getCookie(name){
    var strCookie=document.cookie;
    var arrCookie=strCookie.split(";");
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].trim().split("=");
        if(arr[0]==name)
        	return unescape(arr[1]);
    }
    return "";
}
/*删除cookie*/
function DelCookie(name)
{
	var exp = new Date();
    exp.setTime(exp.getTime()-1);
    var cval=getCookie(name);
     if(cval!=null)
     document.cookie=name+"="+cval+";expires="+exp.toGMTString();
}
function SetCookie(name, value)
//设定Cookie值
{
var expdate = new Date();
var argv = SetCookie.arguments;
var argc = SetCookie.arguments.length;
var expires = (argc > 2) ? argv[2] : null;
var path = (argc > 3) ? argv[3] : null;
var domain = (argc > 4) ? argv[4] : null;
var secure = (argc > 5) ? argv[5] : false;
if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
document.cookie = name+"="+ escape(value) +((expires == null) ?"":(";expires="+ expdate.toGMTString()))
+((path==null)?"":("; path=" + path)) +((domain == null) ?"":(";domain=" + domain))
+((secure==true)?";secure":"");
}
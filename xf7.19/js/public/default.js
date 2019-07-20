$(document).ready(function() {
	var patrolRecord='<li id="patrolRecord" ><img src="images/public/clipboard_check_edit.png"/><span> 巡查记录</span></li>';
	$("#functionSelect").append(patrolRecord);

	$(".anchorBL").remove();//百度地图字去掉
	$("#scrollDiv").css({"width":1800,"float":"left"});
	$("#scrollDiv").before("<div id='changeDom' style='width:50px;height:25px;margin-right:20px;float:left'>"+"</div>");
	$("#changeDom").html("<div class='iconfont' id='controlServlet' state='start'>"+"&#xea16;"+"</div>");
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
        	 $("#scrollBegin").html("<a style='color:#41d687' href='notificationDocument.htm'>"+scrollBeginContent+"</a>");
        	 $("#scrollEnd").html("<a style='color:#41d687' href='notificationDocument.htm'>"+scrollBeginContent+"</a>");
         }
     });
/*	sizeset();*/
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
/*自定义String原生计算长度的方法*/
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
					$("#businessManagement").css("background-color","#567086");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						/*$("#pageSelect").slideDown();*/
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#567086");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						/*$("#pageSelect").slideDown();*/
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						$("#menuName").css("background-color","#567086");
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
					$("#menuName").css("background-color","#567086");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						// $("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						$("#businessManagement").css("background-color","#567086");
						functionSelectFlag = !functionSelectFlag;
					}
				}
			});
			break;

		case"subsystemSelect":

			$("#menuName").css("background-color","#f5a623");
			$("#menuName .menuDown").html("&#xf0aa;");
			var pageSelectFlag = false;
			$("#menuName").on("click", function () {
				if(functionSelectFlag==false){
					$("#functionSelect").slideUp();
					$("#businessManagement .menuDown").html("&#xf05b;");
					// $("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag==false) {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						// $("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag==false) {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						// $("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
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
					// $("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						// $("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag) {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						// $("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}

				}
			});
			break;

		case"functionSelect":

			$("#businessManagement").css("background-color","#f5a623");
			$("#businessManagement .menuDown").html("&#xf0aa;");
			var functionSelectFlag = false;
			$("#businessManagement").on("click", function () {
				if(pageSelectFlag==false){
					$("#pageSelect").slideUp();
					$("#menuName .menuDown").html("&#xf05b;");
					// $("#menuName").css("background-color","#037b7b");
					pageSelectFlag = !pageSelectFlag;
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						// $("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
						functionSelectFlag = !functionSelectFlag;
					}
				}else{
					if (functionSelectFlag==false) {
						$("#functionSelect").slideUp();
						$("#businessManagement .menuDown").html("&#xf05b;");
						// $("#businessManagement").css("background-color","#037b7b");
						functionSelectFlag = !functionSelectFlag;
					}
					else {
						$("#functionSelect").slideDown();
						$("#businessManagement .menuDown").html("&#xf0aa;");
						$("#businessManagement").css("background-color","#f5a623");
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
					// $("#businessManagement").css("background-color","#037b7b");
					functionSelectFlag = !functionSelectFlag;
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						// $("#menuName").css("background-color","#037b7b");
						pageSelectFlag = !pageSelectFlag;
					}
				}else{
					if (pageSelectFlag) {
						$("#pageSelect").slideDown();
						$("#menuName .menuDown").html("&#xf0aa;");
						$("#menuName").css("background-color","#f5a623");
						pageSelectFlag = !pageSelectFlag;
					}
					else {
						$("#pageSelect").slideUp();
						$("#menuName .menuDown").html("&#xf05b;");
						// $("#menuName").css("background-color","#037b7b");
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
						$("#menuName").css("background-color","#f5a623");
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

//横向滚动文字的js
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

//滚动文字的通知弹框
function noticeWindoww(){
	var newCoverDiv = document.createElement("div");
	newCoverDiv.id = "noticeCoverLayerDivvv";
	$("body").append(newCoverDiv);
	$("#noticeCoverLayerDivvv").css('width',1920+'px');
	$("#noticeCoverLayerDivvv").css('height',1080+'px');//设定窗口大小为1920*1080
	$("#noticeCoverLayerDivvv").css({'z-index':'900','position':'absolute','top':'-1px'});
	var newNoticeDiv = document.createElement("div");
	newNoticeDiv.id = "noticeDivv";
	newNoticeDiv.className = "windowBody";
	$("#noticeCoverLayerDivvv").append(newNoticeDiv);
	var newNoticeContentDiv = document.createElement("div");
	var newnoticetitle = document.createElement("div");
	var zhexianlogo=document.createElement("div");
	var noticeTitlefont=document.createElement("div");
	newnoticetitle.id="noticeTitleDivvv";
	newNoticeContentDiv.id = "noticeContentDivv";
	noticeTitlefont.id="noticeTitlefont";
	$("#noticeDivv").css('top','12.62962963%');
	$("#noticeDivv").css('left','30.62962963%');
	$("#noticeDivv").css('height','29%');
	$("#noticeDivv").css('width','15%');
	$("#noticeDivv").css('z-index','899');
	$("#noticeDivv").append(newnoticetitle);
	$("#noticeDivv").append(newNoticeContentDiv);
	$('#noticeTitleDivvv').css("cursor", "move");

	$("#noticeTitleDivvv").append(noticeTitlefont);
	$('#noticeTitlefont').css('text-align','center');
	$('#noticeTitlefont').css('line-height','1.8');
	$('#noticeTitlefont').html('通知公告详情');

	$("#noticeDivv").draggable({
		handle:'#noticeTitleDivvv'});
	$("#noticeCoverLayerDivvv").on("click",function(){

		$("#noticeCoverLayerDivvv").fadeOut(250,function(){
			$("#noticeCoverLayerDivvv").remove();});});
	$("#noticeDivv").on("click",function(event){
		event.stopPropagation();});}


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
/*-----------*/
//获取网页传参

//function getCookie(name){
//	var strCookie=document.cookie;
//	var arrCookie=strCookie.split("; ");
//	for(var i=0;i<arrCookie.length;i++){
//		var arr=arrCookie[i].split("=");
//		if(arr[0]==name)return unescape(arr[1]);
//	}
//	return "";
//}
//var param=lsy();
//cookie=getCookie('cookie1');
//if(cookie=='')
//{
//	location.href="login.htm";
//}
//
//else if(param.num!=cookie){
//	location.href="login.htm";
//}
//else
//{
//	someinform=param.num;
//}
/*添加页面各内容的点击跳转*/
/*function addLocationHref(){
	$("#subSystemPage").click(function(){
		window.location.href="campusMap.htm";
	});
	$("#xfsxtMetro").click(function(){
		window.location.href="waterpressure.htm";
	});
	$("#lwbjMetro").click(function(){
		window.location.href="networkAlarm.htm";
	});
	$("#xfxjMetro").click(function(){
		window.location.href="networkAlarm.htm";
	});
	$("#facilitiesInspection").click(function(){
		window.location.href="facilityPatrol.htm";
	});

	//转到首页
	$("#linkIndex,#indexPage").click(function(){
		window.location.href="index.htm";
	});
	$("#abnormalManagement").click(function(){
		window.location.href="abnormal.htm";
	});
	$("#laws").click(function(){
		window.location.href="laws.htm";
	});
	$("#equipmentManagement").click(function(){
		window.location.href="equipmentManage.htm";
	});
	$("#personManagement").click(function(){
		window.location.href="personManage.htm";
	});
	$("#xfgwMetroDiv").click(function(){
		window.location.href="xfsxtDiv.htm";
	});
	$("#qtjkMetroDiv").click(function(){
		window.location.href="xfdyDiv.htm";
	});
	$("#xfsxMetroDiv").click(function(){
		window.location.href="lwbjDiv.htm";
	});
	$("#dqhzMetroDiv").click(function(){
		window.location.href="dqhzDiv.htm";
	});
	$("#fhmMetroDiv").click(function(){
		window.location.href="fhmDiv.htm";
	});
	$("#xfdyMetroDiv").click(function(){
		window.location.href="xfdyDiv.htm";
	});
	$("#spjkMetroDiv").click(function(){
		window.location.href="spjkDiv.htm";
	});
	$("#ssxcMetroDiv").click(function(){
		window.location.href="ssxcDiv.htm";
	});
	$("#abnormalDiv2Title").click(function(){
		window.location.href="abnormal.htm";
	});
	$("#xfsxtDetailButton1").click(function(){
		window.location.href="xfsxtDetail.htm";
	});

	$("#xfsbDetailButton1").click(function(){
		window.location.href="xfsbDetail.htm";
	});
	/!*			$("#dqhzDetailButton1,#dqhzDetailButton2,#dqhzDetailButton3,#dqhzDetailButton4").click(function(){
	 window.location.href="dqhzDetail.htm"+'?'+'num'+'='+someinform;
	 });*!/
	$("#fhmDetailButton1,#fhmDetailButton2,#fhmDetailButton3,#fhmDetailButton4").click(function(){
		window.location.href="fhmDetail.htm"+'?'+'num'+'='+someinform;
	});
	$("#xfdyDetailButton1,#xfdyDetailButton2,#xfdyDetailButton3,#xfdyDetailButton4").click(function(){
		window.location.href="xfdyDetail.htm"+'?'+'num'+'='+someinform;
	});
	$("#spjkDetailButton1").click(function(){
		window.location.href="spjkDetail.htm"+'?'+'num'+'='+someinform;
	});
	$("#ssxcDetailButton1").click(function(){
		window.location.href="ssxcDetail.htm"+'?'+'num'+'='+someinform;
	});
	$(".functionButton1").click(function(){
		window.location.href="personDetail.htm"+'?'+'num'+'='+someinform;
	});

}*/
function addLocationHref(){
	//转到首页
	$("#linkIndex,#indexPage").click(function(){
		window.location.href="index.htm";
	});
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
			$("#login-button").html("&#xf0aa;")
			flag = false;
		}
		else{
			$("#user-pop").slideUp(400);
			$("#login-button").html("&#xf05b;")
			flag=true;
		}
			event.stopPropagation();
	});
	$(document).click(function(){
		$("#user-pop").slideUp(400);
		$("#login-button").html("&#xf05b;")
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
 * 无网络连接
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
/**
 * 百度地图覆盖物
 *
 * @param 百度地图对象
 * @returns {百度地图覆盖物对象}
 */
function loadMap(mp) {
    function ComplexCustomOverlay(point, text,state,bmapabnormal,bmapalarm) {
        //写入的点
        this._point =point;
        //写入点的内容
        this._text = text;
        //鼠标选中后的内容
        this._state = state;
        //异常数据
        this._bmapabnormal=bmapabnormal;
        //报警数据
        this._bmapalarm=bmapalarm;
        //覆盖物DOM
        this._div="";
    }

    //继承百度地图覆盖物对象
    ComplexCustomOverlay.prototype=new BMap.Overlay();
    //写它的初始方法
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        //最外层div宽度不定
        var div = document.createElement("div");
        this._div = div;

        var that = this;
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        var addressDiv = "url(images/Bmap/" + this._state + "1.gif) repeat-x 0 -33px";
        div.style.background = addressDiv;
        div.style.color = "white";
        div.style.height = "21px";
        div.style.padding = "2px";
        /*  div.style.lineHeight?=?"18px";*/
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px";
        var span = document.createElement("span");
        this._span = span;
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        //作用，改变THIS的作用域，使得内部函数仍然可以调用
        var that = this;
        //添加下面
        var arrow = this._arrow = document.createElement("div");

        var arrow = document.createElement("div");
        this._arrow = arrow;
        var addressArrow = "url(images/Bmap/" + this._state + "1.gif) no-repeat -10px -100px";
        arrow.style.background = addressArrow;
        arrow.style.position = "absolute";
        arrow.style.width = "30px";
        arrow.style.height = "12px";
        arrow.style.top = "19px";
        arrow.style.left = "10px";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);
        //左边
        var leftBar = document.createElement("div");
        this._leftBar = leftBar;
        var addressLeftBar = "url(images/Bmap/" + this._state + "1.gif) no-repeat -12px -2px";
        leftBar.style.background = addressLeftBar;
        leftBar.style.position = "absolute";
        leftBar.style.width = "11px";
        leftBar.style.height = "24px";
        leftBar.style.top = "0px";
        leftBar.style.left = "-10px";
        leftBar.style.overflow = "hidden";
        div.appendChild(leftBar);

        //右边
        var rightBar = document.createElement("div");
        this._rightBar = rightBar;
        var addressRightBar = "url(images/Bmap/" + this._state + "1.gif) no-repeat -22px -2px";
        rightBar.style.background = addressRightBar;
        rightBar.style.position = "absolute";
        rightBar.style.width = "11px";
        rightBar.style.height = "24px";
        rightBar.style.top = "0px";
        rightBar.style.right = "-10px";
        rightBar.style.overflow = "hidden";
        div.appendChild(rightBar);
        div.onmouseover = function () {
            //使用that
            var addressDiv2 = "url(images/Bmap/" + that._state + "2.gif) repeat-x 0 -33px";
            var addressArrow2 = "url(images/Bmap/" + that._state + "2.gif) no-repeat -10px -100px";
            var addressLeftBar2 = "url(images/Bmap/" + that._state + "2.gif) no-repeat -12px -2px";
            var addressRightBar2 = "url(images/Bmap/" + that._state + "2.gif) no-repeat -22px -2px";
            this.style.background = addressDiv2;
            arrow.style.background = addressArrow2;
            leftBar.style.background = addressLeftBar2;
            rightBar.style.background = addressRightBar2;
            $(".abnormalNumber").remove();
          /*  if(that._bmapalarm>0){*/
      		  //总框
      	  var topBar=document.createElement("div");
      	      topBar.className="abnormalNumber";
      	      topBar.style.position = "absolute";
      	      topBar.style.height="18px";
      	      topBar.style.top = "-22px";
      	      topBar.style.left = "-5px";
      	      topBar.style.border="0.5px solid #9e9e9e";
      	      topBar.style.background="rgba(255,255,255,0.8)";
      	      topBar.style.color = "#9e9e9e";
      	      this.appendChild(topBar);
      	      //子框添加数据根据状态添加
      	    if(that._bmapalarm>0){
      	 var listBar1=document.createElement("li");
      	     listBar1.style.float="left";
      	     listBar1.style.height="100%";
      	     listBar1.style.width="25px";
      	     topBar.appendChild(listBar1);
      	 var BarImgAlarm=document.createElement("img");
      	     BarImgAlarm.src="images/Bmap/111.gif";
      	     BarImgAlarm.style.height="10px";
      	     BarImgAlarm.style.width="10px";
      	     listBar1.appendChild(BarImgAlarm);
    	 var BartextAlarm=document.createElement("span");
    	      BartextAlarm.style.fontSize="12px";
    	      BartextAlarm.style.fontWeight="500";
    	      BartextAlarm.style.color="#9e9e9e";
    	      BartextAlarm.innerHTML=that._bmapalarm;
    	      listBar1.appendChild(BartextAlarm);
      	  }
            if(that._bmapabnormal>0){
      	     listBar2=document.createElement("li");
      	   topBar.appendChild(listBar2);
    	     listBar2.style.float="left";
    	     listBar2.style.height="100%";
    	     listBar2.style.width="25px";
    		 var BarImgAbnormal=document.createElement("img");
      	     BarImgAbnormal.src="images/Bmap/211.gif";
      	     BarImgAbnormal.style.height="10px";
      	     BarImgAbnormal.style.width="10px";
      	     listBar2.appendChild(BarImgAbnormal);
      	   var BartextAbnormal=document.createElement("span");
 	         BartextAbnormal.style.fontSize="12px";
 	         BartextAbnormal.style.fontWeight="500";
 	         BartextAbnormal.style.color="#9e9e9e";
 	         BartextAbnormal.innerHTML=that._bmapabnormal;
 	         listBar2.appendChild(BartextAbnormal);
            }
            if(that._bmapabnormal=="数据接收异常"){
            	 listBar2=document.createElement("li");
            	   topBar.appendChild(listBar2);
          	     listBar2.style.float="left";
          	     listBar2.style.height="100%";
          	     listBar2.style.width="80px";
            	   var BartextAbnormal=document.createElement("span");
       	         BartextAbnormal.style.fontSize="12px";
       	         BartextAbnormal.style.fontWeight="500";
       	         BartextAbnormal.style.color="#9e9e9e";
       	         BartextAbnormal.innerHTML=that._bmapabnormal;
       	         listBar2.appendChild(BartextAbnormal);
            }

        };
        div.onmouseout = function () {
        	$(".abnormalNumber").remove();
            this.style.background = addressDiv;
            arrow.style.background = addressArrow;
            leftBar.style.background = addressLeftBar;
            rightBar.style.background = addressRightBar;
        };
        mp.getPanes().labelPane.appendChild(div);
        return div;
    };
    //实现绘制方法
    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        //?根据地理坐标转换为像素坐标，并设置给容器
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top = pixel.y - 30 + "px";
    };
    ComplexCustomOverlay.prototype.getPosition = function () {
        return this._point;
    };
    //?自定义覆盖物添加事件方法
    ComplexCustomOverlay.prototype.addEventListener = function (event, fun) {
        this._div['on' + event]=fun;//点击事件
    };
    return ComplexCustomOverlay;
}

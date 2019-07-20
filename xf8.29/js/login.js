
$(document).ready(function(){
	var StaffID=getCookie('StaffID');
	if(StaffID!=""){
	     var   url='systemManage.htm'/*+'?'+'num'+'='+ID*/;/*这个地址要改*/
         location.href=url;
	}
        identifyResult();
        $("#userid").val('');
        $("#pwd").val('');
        $("#vdcode").val('');
        $("#change").click(function(){
            identifyResult();
        });
        /*下载App切换*/
        $(".content .con_right .left").click(function (e) {
            $(this).css({"color": "#333333", "border-bottom": "2px solid #2e558e"});
            $(".content .con_right .right").css({"color": "#999999", "border-bottom": "2px solid #dedede"});
            $(".content .con_right ul .con_r_left").css("display", "block");
            $(".content .con_right ul .con_r_right").css("display", "none");
            /*if (fluCodeInterval == null || fluCheckCodeInterval == null) {
             show();
             flushQRCode();
             checkQRCodeStatus();
             }*/
        });
        $(".content .con_right .right").click(function (e) {
            $(this).css({"color": "#333333", "border-bottom": "2px solid #2e558e"});
            $(".content .con_right .left").css({"color": "#999999", "border-bottom": "2px solid #dedede"});
            $(".content .con_right ul .con_r_right").css("display", "block");
            $(".content .con_right ul .con_r_left").css("display", "none");
        });
        //选择密码可见还是不可见
        $("#box i").click(function(){
            if($(this).attr('state')=='off'){
                $("#pwd").attr('type','text');
                $(this).attr('state','on');
                $(this).css('opacity',0.5);
            }
            else{
                $("#pwd").attr('type','password');
                $(this).attr('state','off');
                $(this).css('opacity',1);
            }

        });
        $("#vdcode").on({
            "keydown": function (e) {
                var key = e.which;
                if (key == 13) {//按enter键成立
                    testVerify();
                    }
                }

        });
        $("#userid").on({
            "keydown": function (e) {
                var key = e.which;
                if (key == 13) {//按enter键成立
                    testVerify();
                    }
                }

        });
        $("#pwd").on({
            "keydown": function (e) {
                var key = e.which;
                if (key == 13) {//按enter键成立
                    testVerify();
                    }
                }

        });
        $('#btn_Login').click(function(){
                   testVerify();
        });
        $('#cancel_Login').click(function(){
            window.location.href="../xf5.19/index.htm";
        });

        $("#flushLoginValiCode1,#flushLoginValiCode2").click(function () {
            $("#loginImgCode").attr("src", "/handler/GetLoginCode.ashx?" + Math.random());
        });
});
/**
 * 设置cookies
 * **/
/*function setCookie(simuData)
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp   = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    var cookieCon="";
    for(var key in simuData){
    	cookieCon+=key+"="+escape (simuData[key])+";";
    }
    cookieCon+=exp.toGMTString();
    document.cookie=cookieCon;
}*/
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
/**
 * 输入验证，发送请求 
 * */
function testVerify() {
	//匹配验证码
    var yznum=$("#change").val();
    yznum=yznum.split(' ');
    var nyznum='';
    for(var i=0;i<4;i++){
        nyznum+=yznum[i];
    }
    var ID=$.trim($('#userid').val());
    var PWD=$.trim($('#pwd').val());
    var verifyNum=$.trim($('#vdcode').val());
    if (ID== '') {
        alert('请输入您的用户名');
        return false;
    } else if (PWD== '') {
        alert('请输入密码');
        return false;
    }
    else if(verifyNum==''){
        alert('请输入验证码');
        identifyResult();
        return false;
    }
    else if(verifyNum!=nyznum){
        alert('验证码错误');
        $("#vdcode").val('');
        identifyResult();
        return false;
    }else{
        $.ajax({
            type: "post",
            url: "../servlet/DispatchServlet",
            data: {'controller':'LoginAndLogoff','enum':'Login','staffID':ID,'password':PWD},
            success: function (simuData) {
                console.log(simuData);
                //后端匹配成功
              
                if(simuData=='Password Error'){
                    alert('密码错误，请重新输入');
                    $("#userid").val('');
                    $("#pwd").val('');
                    $("#vdcode").val('');
                    identifyResult();
                }
                else if (simuData=='ID Error'){                	
                    alert('该用户不存在');
                    $("#userid").val('');
                    $("#pwd").val('');
                    $("#vdcode").val('');
                    identifyResult();
                }
                else {//输入正确
                	  simuData=JSON.parse(simuData);
                	  SetCookie("StaffID",simuData["StaffID"]);
                	  SetCookie("StaffName",simuData["StaffName"]);
                	  SetCookie("StaffPhoneNumber",simuData["StaffPhoneNumber"]);
                     var   url='systemManage.htm'/*+'?'+'num'+'='+ID*/;/*这个地址要改*/
                     location.href=url;
                     
                }
            }
        });

    }
}
/**
 * 验证码随机生成
 * **/
    function identifyResult(){
        var changenumber = '';
        //随机插入4位验证码
        for (var i = 0; i < 4; i++) {
            changenumber += Math.floor(Math.random() * 9 + 1) + ' ';
        }
        $("#change").attr('value', changenumber);
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
   

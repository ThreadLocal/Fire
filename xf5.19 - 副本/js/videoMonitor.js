/**
 * Created by sponge on 2017/6/12.
 */
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase() ;

    var regStr_ie = /msie [\d.]+;/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;
//IE
    if(agent.indexOf("msie") > 0)
    {
        return agent.match(regStr_ie) ;
    }

//firefox
    if(agent.indexOf("firefox") > 0)
    {
        return agent.match(regStr_ff) ;
    }

//Chrome
    if(agent.indexOf("chrome") > 0)
    {
        return agent.match(regStr_chrome) ;
    }

//Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
    {
        return agent.match(regStr_saf) ;
    }

}
titleNameData=["是否下载火狐浏览器安装包？","是否下载VLC media player安装包？"];
function noticeWindow(contentName){
    if(typeof($("#noticeDiv")) != undefined){
        $("#noticeDiv").remove();
    }

    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDiv";
    newNoticeDiv.className = "windowBody";
    $("body").append(newNoticeDiv);

    var newNoticeTitleDiv = document.createElement("div");
    newNoticeTitleDiv.id = "noticeTitleDiv";
    newNoticeTitleDiv.className = "windowTitle";
    $("#noticeDiv").append(newNoticeTitleDiv);
    $("#noticeTitleDiv").html('<span>'+"提示"+'</span>'+'<span class="iconfont" id="windowClose">'+'&#xf081'+'</span>');
    $("#noticeTitleDiv").css({'background-color':'rgb(44, 146, 146)','color':'#fff'});

    var newNoticeContentDiv = document.createElement("div");
    newNoticeContentDiv.id = "noticeContentDiv";
    $("#noticeDiv").append(newNoticeContentDiv);

    var contentDetailDiv = document.createElement("div");
    contentDetailDiv.id = "contentDetailDiv";
    $("#noticeContentDiv").append(contentDetailDiv);
    $("#contentDetailDiv").html(contentName);

    var newButtonDiv1 = document.createElement("div");
    newButtonDiv1.id = "newButtonDiv1";
    newButtonDiv1.className= "newButtonDiv";
    $("#noticeContentDiv").append(newButtonDiv1);
    $("#newButtonDiv1").html("确定");

    var newButtonDiv2 = document.createElement("div");
    newButtonDiv2.id = "newButtonDiv2";
    newButtonDiv2.className= "newButtonDiv";
    $("#noticeContentDiv").append(newButtonDiv2);
    $("#newButtonDiv2").html("取消");



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
    $("#newButtonDiv2").on("click",function(){
            $("#noticeDiv").fadeOut(0,function(){
                $("#noticeDiv").remove();
            });
        }
    );
}

$(document).ready(function(){
    menuZoom("subsystemSelect");
    var browser = getBrowserInfo() ;
    var browserName = browser[0].split("/")[0];
    var browserNum = parseInt(browser[0].split("/")[1]);
    if(browserName == "chrome" && browserNum!=49){
        $(".prompt").css("display","block");
        $(".monitorContent object").css("display","none");

        $(".prompt .browser").on("click",function(){
            noticeWindow(titleNameData[0]);
            $("#newButtonDiv1").on("click",function(){
                window.open("http://www.firefox.com.cn/");
            })
        })
        $(".prompt .media").on("click",function(){
            noticeWindow(titleNameData[1]);
            $("#newButtonDiv1").on("click",function(){
                window.open("http://www.videolan.org/");
            })

        })
    }
});




jsonData=[
    {
        "ID":"1010","name":"主教学楼","address": "重庆大学沙正街174号", "abnormal": "25", "normal": "175","经度":"29.5651917541°","维度":"106.4686618784°"
    },
    {
        "ID":"1011","name":"第五教学楼","address": "重庆大学沙正街174号", "abnormal": "20", "normal": "180","经度":"29.5711170000°","维度":"106.4751790000°"
    }
]
var address=jsonData[0].address;
var abnormal=jsonData[0].abnormal;
var normal=jsonData[0].normal;

var contentHTML='<a id="address">' +'地址'+':'+address+'</a>'+'</br>'
    +'<a id="abnormal">'+'异常个数'+'：'+abnormal+'</a>' +'</br>'
    +'<a id="normal">'+'正常个数'+'：'+normal+'</a>'+'</br>';

var imgUrl="images/"+jsonData[0].ID+".jpg";

/*弹框*/
function noticeWindow(noticeStr,noticeTitle,imageUrl){
    /*var newCoverDiv = document.createElement("div");
    newCoverDiv.id = "noticeCoverLayerDiv";
    $("body").append(newCoverDiv);*/

    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDiv";
    newNoticeDiv.className = "windowBody";
    $("body").append(newNoticeDiv);

    var newNoticeTitleDiv = document.createElement("div");
    newNoticeTitleDiv.id = "noticeTitleDiv";
    newNoticeTitleDiv.className = "windowTitle"
    $("#noticeDiv").append(newNoticeTitleDiv);
    $("#noticeTitleDiv").text(noticeTitle);

    var newNoticeCloseImg = document.createElement("img");
    newNoticeCloseImg.id = "noticeCloseImg";
    newNoticeCloseImg.className = "windowClose";
    newNoticeCloseImg.src = "images/icons/close.png";
    $("#noticeDiv").append(newNoticeCloseImg);

    var newNoticeContentDiv = document.createElement("div");
    newNoticeContentDiv.id = "noticeContentDiv";
    $("#noticeDiv").append(newNoticeContentDiv);
    $("#noticeContentDiv").html(noticeStr);

    var newNoticeContentImg = document.createElement("img");
    newNoticeContentImg.id = "noticeContentImg";
    newNoticeContentImg.className = "contentImg";
    newNoticeContentImg.src = imageUrl;
    $("#noticeDiv").append(newNoticeContentImg);

    $("#noticeDiv").draggable({
            handle:'#noticeTitleDiv'
        }
    );

    $("#noticeCloseImg").on("click",function(){
            $("#noticeDiv").fadeOut(0,function(){
                $("#noticeDiv").remove();
            });
        }
    );

    /*$("#noticeCoverLayerDiv").on("click",function(){
            $("#noticeCoverLayerDiv").fadeOut(0,function(){
                $("#noticeCoverLayerDiv").remove();
            });
        }
    );*/

    $("#noticeDiv").on("click",function(){
        event.stopPropagation();
    });
}

/*
$(document).ready(function(){

    $("span").on("click",function(){
        noticeWindow(contentHTML,jsonData[0].name,imgUrl);
    });
});*/

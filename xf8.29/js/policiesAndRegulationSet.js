/**
a * Created by 章黎 on 2017/8/29.
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
            fileData = $.extend(true, [], simuData);
            dataProcessing(fileData, false);
            documentOperate();
            
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
        lirow+="<a value="+domContent[domString]["Id"]+" href="+"../"+domContent[domString]["Address"]+" download"+">"+domContent[domString]["Name"]+"</a>"+"&";
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
	$("input[name='test']").remove();
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
        	var valueId= $("#detailNotice .views-row").eq(parseInt(i)).find("span").find("a").attr("value");
            $("#detailNotice .views-row").eq(parseInt(i)).find("span").eq(0).before("<input class='checkboxclass' type='checkbox' name='test' value="+valueId+" /> ");
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
/*查询部分*/
function ajaxForSearch(){
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data:{"controller":"FuzzySearch","page": "policeandregulation","searchValue":searchValue},
        dataType: "json",
        success: function(simuData){
            var fileData = $.extend(true,[],simuData);
            dataProcessing(fileData,true);
            documentOperate();
        }
    });
}
function documentOperate(){
    //删除
    var  sendObject={};
     sendObject["controller"]="SystemManagement";
    sendObject["system"]="policeAndRegulation";
    sendObject["enum"]="deletePoliceandregulation";
    //sendObject.jsonPara="operation";
       $("#inputDelete").click(function(){
    	var  deleteArray=[];
    	//获取数据来源
    /*	$("input[name='test']").attr("checked",true)
    	console.log($("input[name='test']").attr("checked",true));*/
    	  $(".checkboxclass").each(function () {
    	    	if ($(this).is(":checked")) { 
    	    		deleteArray.push($(this).attr("value"));
    	    	}
    	    	});
    	var deleteArrayToStr=JSON.stringify(deleteArray);
    	var selectLength=$("input[name='test']:checked").length; 
    	//选中条数
    	     sendObject["jsonPara"]=deleteArrayToStr;
    	 //弹框
    	     var noticeWidth="360px";/*弹框宽度*/
    	        var noticeHeight="150px";/*弹框高度*/
    	        if(selectLength>0){
    	          var formContent='<div id="ContentDiv">确定删除这'+selectLength+'项</div>';
                  noticeWindow("删除",formContent,noticeWidth,noticeHeight);
                  $("#contentFormDiv").css("height","56%");
                  $("#newButtonDiv1").attr("class","newButtonDiv deleteDiv");
              }else  {
            	  var formContent='<div id="ContentDiv">删除项为空</div>';
            	  noticeWindow("删除",formContent,noticeWidth,noticeHeight);
            	 
            	  $(".newButtonDiv").remove();
              } 	
    	        $('.deleteDiv').click(function(){
    	               
    	        	    $.ajax({
    	        	        type: "post",
    	        	        url: "../servlet/DispatchServlet",
    	        	        data:sendObject,
    	        	        /*dataType: "json",*/
    	        	        success: function (simuData) {
    	        	           $("#ContentDiv").html("删除成功");
    	        	           $(".newButtonDiv").remove();
    	        	         setTimeout(function(){
    	        	        	  $("#noticeDiv").fadeOut(0,function(){
    	        	                 $("#noticeDiv").remove();
    	        	                  
    	        	             });
    	        	         },2000);
    	        	         //重新请求数据
    	        	         location.reload();
    	        	        },
    	        	        error:function(){
    	        	          $("#ContentDiv").html("删除失败");
    	        	          $(".newButtonDiv").remove();
    	         	         setTimeout(function(){
    	         	        	  $("#noticeDiv").fadeOut(0,function(){
    	         	               
    	         	              $("input[name='test']").attr("checked",false);   
    	         	             });
    	         	         },2000); 
    	        	            
    	        	        }
    	        	    });
    	        	    });
    });
    //弹框加载  
    $("#upload").click(function(){
        //弹框加载
        var noticeWidth="360px";/*弹框宽度*/
        var noticeHeight="200px";/*弹框高度*/
        contentString="";
        var formContent='标&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp题：'+'<input name="test" type="text" placeholder="标题" class="fileInput">'+'<br>'
            +'文件路径：'+'<input name="文件路径" type="file"  class="fileInput">'
            +'<div id="fileSize">'+'</div>';
        noticeWindow("政策法规上传",formContent,noticeWidth,noticeHeight);
        $("#newButtonDiv1").attr("class","newButtonDiv upLoadDiv");
        var fileReader=fileRead();
        $('.upLoadDiv').click(function(){
            //获取表单的内容 
        	var file_title=$(".fileInput").val();
        	if( file_title==""){
        		$("#fileSize").text("请输入标题"); 
        		$("#fileSize").css("color","red");
        		return false;
        	}
        	var file_data=$('input[type="file"]').prop("files")[0];
        	if(file_data==undefined){
        		$("#fileSize").text("请选择文件路径");
        		$("#fileSize").css("color","red");
        		return false;
        	}
            var fileSize=Math.round(file_data.size/1000);
        	var ext=file_data.type.substring(file_data.type.lastIndexOf("."),file_data.type.length).toLowerCase();
        	var typeArray=[".document",".sheet",".ms-excel","application/msword"];
        	var extFlag=false;
			for(var i=0;i<typeArray.length;i++){
				if(typeArray[i]==ext){
					extFlag=true;
				
				}	
			}
        	if(file_data.size>10*1024*1024){
        		$("#fileSize").text("文件大于10M，请重新上传"); 
        		$("#fileSize").css("color","red");
        		return false;
        	}else if(extFlag!=true){
        		$("#fileSize").text("请输入以下类型的文件: .doc,.docx,.xls,.xlsx"); 
        		$("#fileSize").css("color","red");
        		return false;
        	}else{
        		$("#fileSize").text("文件大小"+fileSize+"KB"); 
        		$("#fileSize").css("color","black");
        		
        		fileReader().append("Name",file_title);
        		$.ajax({
            		type:"post",
            		url:"../servlet/FileUploadServlet",
            		//dataType:"json",
            		processData:false,
            		contentType:false,
            		data:fileReader(),
            		success:function(e){
            			$("#fileSize").text("上传成功"); 
            			$("#fileSize").css("color","black");
            			setTimeout(function(){
    						$("#noticeDiv").fadeOut(0,function(){
    							ajaxForTotal();
    							$("#noticeDiv").remove();

    						});
    					
    					},2000);
            		},
            	
            	})
        		
        	}
        });	 
        
    });
    //上传提交
   
}
function fileRead(){
	var form_data="";
	$('input[type="file"]').on("change",function(e){
	var file=e.target.files[0]; //获取文件资源,其中file中包含了文件大小、类型等
	//以下绑定提交事件，并判断文件类型
	reader=new FileReader();
	reader.readAsDataURL(file);//读取文件
	reader.onload=function(arg){
		form_data=new FormData();
		form_data.append("document",$('input[type="file"]').prop("files")[0]);
		form_data.append("formName","policeandregulation");
		form_data.append("controller","SaveOrUpdateInfoAboutUpload");
		
        }
	})
	function getForm_data(){	
		return form_data;
	}
	return getForm_data;
}
/*弹出框*/
function noticeWindow(titleName,formContent,noticeWidth,noticeHeight){

    if(typeof($("#noticeDiv")) != undefined){
        $("#noticeDiv").remove();
    }

    var newNoticeDiv = document.createElement("div");
    newNoticeDiv.id = "noticeDiv";
    newNoticeDiv.className = "windowBody";
    $("body").append(newNoticeDiv);
    $("#noticeDiv").css({"width":noticeWidth,"height":noticeHeight});


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
    $("#contentFormDiv").html(formContent);
   var newButtonDiv1 = document.createElement("div");
     newButtonDiv1.id = "newButtonDiv1";
     newButtonDiv1.className= "newButtonDiv";
     $("#newNoticeContentDiv").append(newButtonDiv1);
     $("#newButtonDiv1").html("确定");

     var newButtonDiv2 = document.createElement("div");
     newButtonDiv2.id = "newButtonDiv2";
     newButtonDiv2.className= "newButtonDiv";
     $("#newNoticeContentDiv").append(newButtonDiv2);
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

//    menuZoom("functionSelect");
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


/*$("#detailNotice .views-row").eq(parseInt(domString)).find("span").eq(0).html("<a href="+"dom/"+domContent[domString]["DocumentAddress"]+">"+domContent[domString]["DocumentName"]+"</a>");
 $("#detailNotice .views-row").eq(parseInt(domString)).find("span").eq(2).html(domContent[domString]["DocumentCreatTime"]);*/
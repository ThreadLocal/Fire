$(document).ready(function(){
	menuZoom("functionSelect");
	ajaxForTotal();
});
function ajaxForTotal() {
    $.ajax({
    	type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": "BasicDocumentQuery","enum":"BasicDocumentQuery"},
        dataType: "json",
        success: function (simuData) {
        	console.log(simuData);
        	allData=simuData;
        	if(jsonObjectIsEmpty(simuData)==false){//如何获取一个对象的长度
        		$("#noPicture").remove();
        		   $("#page_navigation").css("display","block");
        		ajaxResult(simuData);
        	}else{
             $("#page_navigation").css("display","none");
       		 noData("topMainDiv","当前资料目录为空");
    		 $("#catalogDetail").html("<span style='font-size: 20px; margin-left: 691px;'>当前资料目录下文档为空</span>");
    		docunmentUpload();
    		deleteDocument(); 
    		//如何解除点击事件
    		$("#uploadContent").unbind(); 
    		
    	}
        }
    });
}
function ajaxResult(simuData){
    fileData = $.extend(true, [], simuData);
	dataProcessing(fileData);
}
/**
 * 具体项的生成
 * */
function dataProcessing(domContent){
    $('.num_box').val(1);
    var lirowArray=[];
    pagenum=0;
    var newpagenum=1;
    var rowline=0;
    var lirow='';
    var alllength=0;
    for(var domId in domContent){
        rowline++;
        alllength++;
        if(rowline == 17){
            lirow='';
            rowline=1;
            pagenum++;
        }
			lirow+="<span class='open' value="+domId+">"+domContent[domId]["Name"]+"</span>"+"&";/*一页的内容*/
		lirowArray[pagenum]=lirow;
    }
    pagenum++;
    $("#totalPage").text(pagenum);
    PageChange(lirowArray,0);
    $("#totalNum").html(alllength);//填充总页数
    operaView(newpagenum,lirowArray);
}
/*分页*/
function operaView(newpagenum,contentArray){
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
	    		PageChange(contentArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
	    	}
	    	else if(inputPage<1){
	    		newpagenum=1;
	    		PageChange(contentArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
	    	}
	    	else {
	    		newpagenum=inputPage;
	    		PageChange(contentArray,newpagenum-1);
	    		$('.num_box').val(newpagenum);
	    	}
	    	}
	    }
   });
    //向上翻页
    $("#previous_page").click(function(){
        if(newpagenum==1){
        	$('.num_box').val(newpagenum);
            return
        }
        else{
            newpagenum--;
            PageChange(contentArray,newpagenum-1);
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
            PageChange(contentArray,newpagenum-1);
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
            PageChange(contentArray,newpagenum-1);
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
            PageChange(contentArray,newpagenum-1);
            $('.num_box').val(newpagenum);
        }
    });
}
/*分页执行内容*/
function PageChange(lirowArray,pageNum){
	$("#topMainDiv").html("");
	var lirow=lirowArray[pageNum];
   var  noticeContent=lirow.split("&");/*每一小段落的内容*/
        for(var i=0;i<noticeContent.length-1;i++){
			var dataDiv=document.createElement("div");
			dataDiv.className="dataDiv";
			$("#topMainDiv").append(dataDiv);
			var dataEntry=document.createElement("div");
			dataEntry.className="dataEntry";
			$(".dataDiv").eq(parseInt(i)).append(dataEntry);
			var buttonDiv=document.createElement("div");
			buttonDiv.className="buttonDiv";
			$(".dataDiv").eq(parseInt(i)).append(buttonDiv);
			$(".dataDiv").eq(parseInt(i)).find(".dataEntry").html(noticeContent[i]);
        	var valueId=$(".dataDiv").eq(parseInt(i)).find("span").attr("value");
			var Address="..\\"+fileData[valueId]["modelAddress"];//地址待修改
			$(".dataDiv").eq(parseInt(i)).find(".buttonDiv").html('<a href='+Address+' class="download" value='+valueId+' " download"><image  title="下载模板"  src=images/dataSet/download.png></a>');
        }
      
	openClick();
}
/**
 *
 * 展开按钮点击事件*/
 function openClick(){
	 $(".open:eq(0)").addClass("openSelect");
	 $("#documentContent").find("span:eq(0)").text(fileData["1"]["Name"]);
	 $(".open:eq(0)").css({"color":"#43039f","text-decoration":"underline"});
       var valueIdFirst= $(".open:eq(0)").attr("value");
	   documentCreate(fileData,valueIdFirst);
	    $(".open").on("click",function(){
	    	//第一次点击,展开
	    	$('#upload').css("opacity","0.2");
	    	$("#selectedDataDiv").css("display","none");
	        if($(this).hasClass("openSelect")==false){
				$(".openSelect").css({"color":"","text-decoration":""});
	            $(".openSelect").attr("class","open");
	            $(this).addClass("openSelect");
	            var valueId= $(this).attr("value");
				$(".openSelect").css({"color":"#43039f","text-decoration":"underline"});
				$("#documentContent").find("span:eq(0)").text(fileData[valueId]["Name"]);
				documentCreate(fileData,valueId);
	        }
	        //已经打开过
	        else if($(this).hasClass("openSelect")==true){
	           /* $(".catalogDiv").css({"display":"none"});*/
	            $(this).attr("class","open");
				$(this).find("span:eq(0)").css({"color":"","text-decoration":""});
				$("#documentContent").find("span:eq(0)").text(fileData["1"]["Name"]);
				$(".open:eq(0)").addClass("openSelect");
				var valueIdFirst= $(".open:eq(0)").attr("value");
				documentCreate(fileData,valueIdFirst);
	        }
			selectMore();
		
	    });
	 /*加入搜索*/
	 selectMore();
 }
 function documentCreate(fileData,valueId){
	 var i=0;
	 $("#catalogDetail").html("");
	 $("#deleteButton").css("display","block");
	 $(".catalogDiv").remove();
	 $("#selectContent ul li").remove();
	 for(var detailContent in fileData[valueId]["detail"]){
		 if(detailContent==''){
			 $("#catalogDetail").html("<span>当前资料目录下文档为空</span>");
			 $("#catalogDetail>span").css({"font-size":"20px",
				                            "margin-left":"691px",                           
			                                 });
			 $("#deleteButton").css("display","none");
		 }else{	
			
		 var catalogDiv=document.createElement("div");
		 catalogDiv.className="catalogDiv";
		 $("#catalogDetail").append(catalogDiv);
		 $(".catalogDiv:eq("+i+")").attr("name",i);
		 var dataTitle=document.createElement("span");
		 dataTitle.className = "dataTitle";
		 $(".catalogDiv:eq("+i+")").append(dataTitle);
		$(".dataTitle:eq("+i+")").html(detailContent);
		 var dataAuthor=document.createElement("span");
		 dataAuthor.className = "dataAuthor";
		 $(".catalogDiv:eq("+i+")").append(dataAuthor);
		 var authorAndTime="发布人:"+fileData[valueId]["detail"][detailContent].author+" | "+"发布时间:"+fileData[valueId]['detail'][detailContent].createTime;
		 $(".dataAuthor:eq("+i+")").html(authorAndTime);
		 i++;
	 }
	 }
	 dataSearch();
 }
/**
 *
 * 选择多选选项*/
function selectMore(){
	_uploadMore();
	_cancelClick();
	/*取消点击*/
	function _cancelClick(){
		$("#cancel").click(function(){
			$("#selectedDataDiv").css("display","none");
			$(".uploadSelect").attr("class","catalogDiv");
			$(".catalogDiv").css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
			$(".catalogDiv").find("i").remove();
			$("#delete").css({"opacity":"0.2","cursor":"auto"});
			$("#selectContent ul li").remove();
		});
	}
	function _uploadMore(){
		$(".catalogDiv").click(function(){
			//选中某一个
			if($(this).hasClass("uploadSelect")==false){
				$("#selectedDataDiv").css("display","block");
				var finalId=$(".openSelect").attr("value");
				var subTitle=$(this).find("span:eq(0)").text();
				var address="..\\"+allData[finalId]["detail"][subTitle]["address"];
				$(this).append("<i class='uploadone' href="+address+" ' download'></i>");
				
				$(this).css({"border":"1px solid #53a091","color":"#53a091","background-color":"#EEFAFC"});
				$(this).addClass("uploadSelect");
				$("#upload").css({"opacity":"1","cursor":"pointer"});
				$("#upload").addClass("uploadOpcity");
				//加入选择结果框框
                 var  uploadTitle= $(this).find("span:eq(0)").text();
				var selectNumber=$(this).attr("name");

				_uploadItemList(uploadTitle, selectNumber);
			}
			//已经选择过的,没有任何选中的情况
			else if($(this).hasClass("uploadSelect")==true){
				$(this).css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
				$(this).find("i").remove();
				var deleteID=$(this).attr("name");
				$(this).attr("class","catalogDiv");

				$("."+ deleteID).remove();
				if($(".catalogDiv").hasClass("uploadSelect")==false){
					$("#selectedDataDiv").css("display","none");
					$("#upload").css({"opacity":"0.2","cursor":"auto"});
				}
			}
			_uploadItem();
			/*防止循环绑定*/
			try{
				var event_click=$._data($(".uploadOpcity")[0],"events")["click"];
			}
			catch(e){
				uploadDocument();
			}					
		});
		//弹框

	}
	/**/
	function  _uploadItemList(uploadTitle, selectNumber){
		var searchResult=document.createElement("li");
		searchResult.className=selectNumber;
		$("#selectContent ul").append(searchResult);
		var searchTitle=document.createElement("a");
		$("."+selectNumber).append(searchTitle);
		searchTitle.setAttribute("title",uploadTitle);
		$("."+selectNumber).find("a").append("<i></i>"+uploadTitle);
	}
	function _uploadItem(){
		var size=$(".catalogDiv").length;
		$("#selectContent ul li").click(function(){
			if(size==1){
				$("#selectedDataDiv").css("display","none");
				$("#upload").css({"opacity":"0.2","cursor":"auto"});
			}
			var cancelNumber=$(this).attr("class");
			$(".catalogDiv[name="+cancelNumber+"]").attr("class","catalogDiv");
			$(".catalogDiv[name="+cancelNumber+"]").css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
			$(".catalogDiv[name="+cancelNumber+"]").find("i").remove();
			$(this).remove();
			size=size-1;
			event.stopPropagation();
		});
	}
}
function uploadDocument(){
	$(".uploadOpcity").click(function(){
		for(var i=0;i<$(".uploadone").length;i++){
			   (function(index){setTimeout(function(){ var address=$(".uploadone").eq(index).attr("href");
			   location.href=address;
			   if(index+1 == $(".uploadone").length){
				   setTimeout(function(){
					   $(".uploadone").each(function(){
						  $(this).click(); 
					   });  
				   },200);
			   }
			   },index*200);
			   })(i); 
		}
		
	});
}
/**
 * 资料搜索*
 * */
function dataSearch(){
	/*回车提交输入值*/
    $("#searchInput").on("keydown",function(event){
        if( event.which == 13 ){
            $("#searchSubmit").click();
        }
    });
    /*提交按钮*/
    $("#searchSubmit").on("click",function(){
		//把选框样式去掉
		$("#selectedDataDiv").css("display","none");
		$(".uploadSelect").attr("class","catalogDiv");
		$(".catalogDiv").css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
		$(".catalogDiv").find("i").remove();
		$("#delete").css({"opacity":"0.2","cursor":"auto"});
		var searchWord = $("#searchInput").val().trim();//获取输入的文字,去掉空格
		var reg= new RegExp(searchWord,"g");
		if(searchWord!=""){
			var matchLength=0;
				$(".catalogDiv").each(function () {
					var   $this = $(this);
					//重新写匹配条件
					var catalogDivTest=$this.find(".dataTitle").text();
					if ( catalogDivTest.match(reg)) {//匹配成功
						$(this).css("display","block");
						matchLength++;
						catalogDivTest=catalogDivTest.replace(reg,"<strong style='color:#44998e'>"+searchWord+"</strong>");
						$this.find(".dataTitle").html(catalogDivTest);
					}else{
						$(this).css("display","none");

					}
				});
				$("#selectDiv>span").css("display","inline-block");
				$("#selectDiv strong").html(matchLength);
		}else{
			$("#selectDiv>span").css("display","none");
			$(".catalogDiv").css("display","block");
			$(".catalogDiv").each(function () {
				var catalogDivTest=$(this).find(".dataTitle").text();
				$(this).find(".dataTitle").html(catalogDivTest);

			});
		}
	});
    /*重置按钮*/
    $("#searchReset").on("click",function(){
        $("#searchInput").val("");
        $("#searchSubmit").click();
    });
}
/**
 * 弹出框*
 * */
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
/**
 * 无数据添加备注
 * */
function noData(address,text){
    $('#noPicture').remove();
    var noPicture=document.createElement("div");
    noPicture.id="noPicture"; 
    $("#"+address).append(noPicture);
    var img = document.createElement("img");
    img.id = "imagePic";
    img.src="img/noData.png";
    $("#noPicture").append(img);
    var imgText=document.createElement("span");
    imgText.id="imgText";
    $("#noPicture").append(imgText);
    $("#imgText").text(text);   
}


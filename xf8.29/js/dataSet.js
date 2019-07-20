
$(document).ready(function(){
	$.getJSON("../xf5.19/js/buildingFloor.js",function(buildingData) {
		optionForManagers = buildingData["optionForManagers"];
		ajaxForTotal();
		//没有数据也需要绑定点击事件
	});
});
function ajaxForTotal() {
    $.ajax({
    	type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": "BasicDocumentQuery","enum":"BasicDocumentQuery"},
        dataType: "json",
        success: function (simuData) {
        	allData=simuData;
        	console.log(simuData);
        	if(jsonObjectIsEmpty(simuData)==false){//如何获取一个对象的长度
        		$("#noPicture").remove();
        		  $("#page_navigation").css("display","block");
        
        		ajaxResult(simuData);
        	}else{
        		   $("#page_navigation").css("display","none");
        		 noData("topMainDiv","当前资料目录为空");
        		 $("#catalogDetail").html("<span style='font-size: 20px; margin-left: 655px;'>当前资料目录下文档为空，请上传文档</span>");
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
    $("#totalPage").text(parseInt(pagenum));
    PageChange(lirowArray,0);
    $("#totalNum").html(alllength);//填充总页数
    operaView(newpagenum,lirowArray);
    
}
/**
 * 
 * 分页
 * */
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
/**
 * 
 * 分页执行内容
 * */
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
			var Address="..\\"+fileData[valueId]["modelAddress"];
			$(".dataDiv").eq(parseInt(i)).find(".buttonDiv").html('<div class="upload" value='+valueId+'><image title="更新模板" src=images/dataSet/upload.png></div><a href='+Address+' class="download" value='+valueId+' " download"><image  title="下载模板"  src=images/dataSet/download.png></a>');
			$(".dataDiv").eq(parseInt(i)).find(".dataEntry").before("<input class='checkboxclass' type='checkbox' name='test' value="+valueId+" /> ");
        }
      
	openClick();
	deleteDocument();
	docunmentUpload();
}
/**
 *
 * 展开按钮点击事件*/
 function openClick(){
	 $(".open:eq(0)").addClass("openSelect");
	 var documentID=$(".open:eq(0)").attr("value");
	 $("#documentContent").find("span:eq(0)").text(fileData[documentID]["Name"]);
	 $(".open:eq(0)").css({"color":"#43039f","text-decoration":"underline"});
       var valueIdFirst= $(".open:eq(0)").attr("value");
	   documentCreate(fileData,valueIdFirst);
	    $(".open").on("click",function(){
	    	//第一次点击,展开
	      	$('#delete').css("opacity","0.2");
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
				$(this).css({"color":"","text-decoration":""});
				$(".open:eq(0)").addClass("openSelect");
				$(".openSelect").css({"color":"#43039f","text-decoration":"underline"});
				var valueIdFirst= $(".open:eq(0)").attr("value");
				$("#documentContent").find("span:eq(0)").text(fileData[valueIdFirst]["Name"]);
				documentCreate(fileData,valueIdFirst);
	        }
			selectMore();
			docunmentUpload();
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
			 $("#catalogDetail").html("<span>当前资料目录下文档为空，请上传文档</span>");
			 $("#catalogDetail>span").css({"font-size":"20px",
				                            "margin-left":"655px",                           
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
 * 删除资料
 * */
function deleteDocument(){
	$("#titleDelect").click(function(){
		var  sendObject={};
		sendObject["controller"]="SystemManagement";
		sendObject["system"]="basicdocuments";
		sendObject["enum"]="deleteBasicDocument";
		var deleteArray=[];
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
		_deleteAjax(sendObject,selectLength)
	  });
	$(".deleteOpcity").click(function(){
		var  sendObject={};
		
		sendObject["controller"]="SystemManagement";
		sendObject["system"]="notificationDocument";
		sendObject["enum"]="deleteDetailBasicDocument";
		var deleteArray=[];
		 deleteArray.push($(".openSelect").attr("value"));
		$("#selectContent ul li a").each(function(){
			deleteArray.push($(this).attr("title"));
		});
		var deleteArrayToStr=JSON.stringify(deleteArray);
		var selectLength=$("#selectContent ul li a").length;
		//选中条数
		sendObject["jsonPara"]=deleteArrayToStr;
		_deleteAjax(sendObject,selectLength);
		$("#noticeDiv").css("top","70%");
	});
    function _deleteAjax(sendObject,selectLength){
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
					setTimeout(function(){
						$("#noticeDiv").fadeOut(0,function(){
							if(sendObject["system"]=="basicdocuments"){
								ajaxForTotal();	
							}else{
								$(".deleteSelect").remove();
								$(".newButtonDiv").remove();
								$("#selectContent ul li").remove();
								$("#selectedDataDiv").css("display","none");
								$("#delete").css({"opacity":"0.2","cursor":"auto"});
								$("#upload").css({"opacity":"0.2","cursor":"auto"});
							}
							
							$("#noticeDiv").remove();

						});
					
					},2000);
					//这里需要区分是上面部分的删除还是下面的删除,如果为上面部分，需要重新加载数据，
					//如果为下面数据，直接删除
					
					
					
					
				},
				error:function(){
					$("#ContentDiv").html("删除失败");
					$(".newButtonDiv").remove();
					setTimeout(function(){
						$("#noticeDiv").fadeOut(0,function(){

							$("input[name='test']").attr("checked",false);
						});
					},2000);
					$("#delete").css({"opacity":"0.2","cursor":"auto"});
					$("#upload").css({"opacity":"0.2","cursor":"auto"});

				}
			});
		});
	};
}
/**
 * 文档模块的上传
*/
function docunmentUpload(){
	//上传新的模板
	$("#titleUpload").click(function(){
		//弹框加载
		var noticeWidth="360px";/*弹框宽度*/
		var noticeHeight="200px";/*弹框高度*/
		var formContent='标&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp题：'+'<input name="test" type="text" placeholder="标题" class="fileInput">'+'<br>'
			+'选择模板：'+'<input name="上传模板" type="file"  class="fileInput">'
			+'<div id="fileSize">'+'</div>';
		noticeWindow("资料模板上传",formContent,noticeWidth,noticeHeight);
		$("#newButtonDiv1").attr("class","newButtonDiv upLoadDiv");
		_uploadSure1();

	});
    //更新已有模板
	$(".upload").click(function(){
		var valueId=$(this).attr("value");
       var uploadTitle=$(".open[ value="+ valueId+"]").text();
		var noticeWidth="360px";/*弹框宽度*/
		var noticeHeight="200px";/*弹框高度*/
		var formContent='已有模板：'+'<span>xxx.doc</span>'+'<br>'
			+'上传模板：'+'<input name="上传模板" type="file"  class="fileInput">'
			+'<div id="fileSize">'+'</div>';
		noticeWindow(uploadTitle,formContent,noticeWidth,noticeHeight);
		$("#newButtonDiv1").attr("class","newButtonDiv upLoadDiv");
		$("#contentFormDiv span").text(uploadTitle);
		_uploadSure2();
	});
	/*具体资料的上传,包括多个资料的上传*/
	$("#uploadContent").click(function(){
		var noticeWidth="500px";/*弹框宽度*/
		var noticeHeight="400px";/*弹框高度*/
		var formContent='';
		var documentTitle=$("#documentContent>span").text();
		noticeWindow(documentTitle,formContent,noticeWidth,noticeHeight);
		$("#contentFormDiv").append("<div id='authorFlow'>发布人：<select id='authorInput' name='test'><option value=''>请选择发布人</option></select></div>");
		addStaffList();
		$("#contentFormDiv").append("<div id='fileList'><div class='fileListOne'>标题：<input class='titleInput'name='test' placeholder='请输入标题'>文件：<input  type='file'  class='fileAddress'><input value='删除' type='button'  class='Addressdelete'></div></div>");
		$("#contentFormDiv").append("<div id='fileAdd'><span class='iconfont'>&#xea0a;</span>添加</div>");
		$("#contentFormDiv").append("<div id='fileSize'></div>");
		$("#fileSize").css("margin-top","25px");
		$("#fileSize").css("padding-left","3%");
		$("#fileSize").css("font-size","14px");
		$("#newButtonDiv1").addClass("upLoadAll");
		function addStaffList(){
			for ( i in optionForManagers) {
				var newOption = document.createElement("option");
				newOption.value = optionForManagers[i][0];
				newOption.text = optionForManagers[i][1];
				$("#authorInput").append(newOption);
			}
		}
		$(".fileAddress").on("change",
			function(e) {
				var file_data=e.target.files[0]; // 获取文件资源,其中file中包含了文件大小、类型等
				// 判断文件类型
				$("#fileSize").text("");
				var fileSize=Math.round(file_data.size/1000);
				var ext=file_data.type.substring(file_data.type.lastIndexOf("."),file_data.type.length).toLowerCase();
				if(file_data.size>10*10*1024*1024){
					$("#fileSize").text("文件大于10M，请重新上传");
					$("#fileSize").css("color","red");
					return false;
				}else if(ext!=".document"){
					$("#fileSize").text("输入的文件类型不符合.doc");
					$("#fileSize").css("color","red");
					return false;
				}else {
				}
			});
		$("#fileAdd").click(function(){
			$("#fileSize").text("");
			$("#fileList").append("<div class='fileListOne'>标题：<input class='titleInput'name='test' placeholder='请输入标题'>文件：<input  type='file'  class='fileAddress'><input value='删除' type='button'  class='Addressdelete'></div></div>");
			$(".Addressdelete").click(function(){
				$(this).parent().remove();
			});

			$(".fileAddress").on("change",
				function(e) {
					var file_data=e.target.files[0]; // 获取文件资源,其中file中包含了文件大小、类型等
					// 判断文件类型
					$("#fileSize").text("");
					$("#fileSize").css("color","red");
				
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
		        	}else {
					}
				});
		});
		$(".Addressdelete").click(function(){
            $(this).parent().remove();
		});

	  $(".upLoadAll").click(function(){
				if($("#authorInput option:selected").val() != ""){
					_uploadProcess(); //去执行批量上传程序
				}
				else{
					$("#fileSize").text("请选择发布人");
					$("#fileSize").css("color","red");
				}
			});
		function _uploadProcess(){
			var file_array=[];//用于批量存储上传文件
			var file_name=[];//用于批量存储文件名称;
			var author_name=$("#authorInput option:selected").text();//获取发布人姓名
			var form_data=new FormData();//新建文件流容器
			var total_file_dom=$(".fileAddress");
			form_data.append("Author",author_name);
			for(var i=0;i<total_file_dom.length;i++){
				if(total_file_dom.eq(i).prev().val() != "" && total_file_dom.eq(i).prop("files")[0] != undefined){
					form_data.append("basicdocument",total_file_dom.eq(i).prop("files")[0]);
					file_name.push(total_file_dom.eq(i).prev().val());
				}
				else{
					$("#fileSize").text("请填写完整文件内容");
					$("#fileSize").css("color","red");
					return false;
				}
			}
			form_data.append("Name",JSON.stringify(file_name));
			form_data.append("controller","Detailbasicdocuments");
			//添加ID
			var finalId=$(".openSelect").attr("value");
			form_data.append("parentPath","fileModel"+finalId);
			$.ajax({
				type:"post",
				url:"../servlet/FileUploadServlet",
	            dataType:"json",
				processData:false,
				contentType:false,
				data:form_data,
				success:function(e){
					$("#fileSize").text("上传成功");	
					  ajaxForTotal();
					setTimeout(function(){
						  
							
							/*$("#fileSize").css("color","black");
							$("#catalogDetail").html("");
							$(".openSelect").css({"color":"","text-decoration":""});
							$(".openSelect").attr("class","open");
							$(".open[value="+finalId+"]").addClass("openSelect");					
							$(".openSelect").css({"color":"#43039f","text-decoration":"underline"});*/
							$(".open[value="+finalId+"]").click();
							$("#noticeDiv").remove();
							
					},1000);
				},
				error:function(e){
					$("#fileSize").text("上传失败");
					$("#fileSize").css("color","red");
				}
			})
		}


	});
   function _uploadSure1(){
	   $('.upLoadDiv').click(function(){
		   //获取表单的内容
		   var file_title=$(".fileInput").val();
		   if( file_title==""){
			   $("#fileSize").text("请输入标题");
			   $("#fileSize").css("color","red");
			   return false;
		   }
		   var  sendObject={};
		   sendObject["Name"]=file_title;
		   sendObject["basicDocument"]=$('input[type="file"]').prop("files")[0];
		   sendObject["formName"]="basicdocuments";
		   sendObject["controller"]="basicdocuments";
           uploadJudge(sendObject);
	   });
   }
	function _uploadSure2(){
		$('.upLoadDiv').click(function(){
			//获取表单的内容
			var sendObject=new Object();
			sendObject["notificationdocument"]=$('input[type="file"]').prop("files")[0];
			sendObject["formName"]="notificationdocument";
			sendObject["controller"]="SaveOrUpdateInfoAboutUpload";
			uploadJudge(sendObject);
		});
	}
function uploadJudge(sendObject){
	var file_data=$('input[type="file"]').prop("files")[0];
	var file_title="";
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
	}{
		$("#fileSize").text("文件大小"+fileSize+"KB");
		$("#fileSize").css("color","black");
		var form_data=new FormData();
		for(var value in sendObject){
			form_data.append( value,sendObject[value]);
		}
		$.ajax({
			type:"post",
			url:"../servlet/FileUploadServlet",
	/*		dataType:"string",*/
			processData:false,
			contentType:false,
			data:form_data,
			success:function(e){
				$("#fileSize").text("上传成功");
				//重新刷新页面，并且需要模拟对应项目的点击事件
				ajaxForTotal();
				setTimeout(function(){
						$("#noticeDiv").remove();	
				},1000);  	
			},
			error:function(e){
				$("#fileSize").text("上传失败");
				$("#fileSize").css("color","red");
			}
		})

	}
}
}
/**
 *
 * 选择多选选项*/
function selectMore(){
	_deleteMore();
	_cancelClick();
	/*取消点击*/
	function _cancelClick(){
		$("#cancel").click(function(){
			$("#selectedDataDiv").css("display","none");
			$(".deleteSelect").attr("class","catalogDiv");
			$(".catalogDiv").css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
			$(".catalogDiv").find("i").remove();
			$("#delete").css({"opacity":"0.2","cursor":"auto"});
			$("#upload").css({"opacity":"0.2","cursor":"auto"});
			$("#selectContent ul li").remove();
		});
	}
	function _deleteMore(){
		$(".catalogDiv").click(function(){
			//选中某一个
			if($(this).hasClass("deleteSelect")==false){
				$("#selectedDataDiv").css("display","block");
				var finalId=$(".openSelect").attr("value");
				var subTitle=$(this).find("span:eq(0)").text();
				
				var address="..\\"+allData[finalId]["detail"][subTitle]["address"];
				$(this).append("<i class='uploadone' href="+address+" ' download'></i>");				
				$(this).css({"border":"1px solid #e4393c","color":"#e4393c","background-color":"#FFF3F8"});
				$(this).addClass("deleteSelect");
				$("#delete").css({"opacity":"1","cursor":"pointer"});
				$("#upload").css({"opacity":"1","cursor":"pointer"});
				$("#upload").addClass("uploadOpcity");
				$("#delete").addClass("deleteOpcity");
				//加入选择结果框框
                 var  deleteTitle= $(this).find("span:eq(0)").text();
				var selectNumber=$(this).attr("name");
				_deleteItemList(deleteTitle, selectNumber);
				
			}
			//已经选择过的,没有任何选中的情况
			else if($(this).hasClass("deleteSelect")==true){
				$(this).css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
				$(this).find("i").remove();
				var deleteID=$(this).attr("name");
				$(this).attr("class","catalogDiv");
				$(".deleteItemList[name="+deleteID+"]").remove();
				/*已经没有可删除的*/
				if($(".catalogDiv").hasClass("deleteSelect")==false){
					$("#selectedDataDiv").css("display","none");
					$("#delete").css({"opacity":"0.2","cursor":"auto"});
					$("#upload").css({"opacity":"0.2","cursor":"auto"});
				}
			}
			
			_deleteItem();
			_uploadDocument();
			deleteDocument();
			try{
				var event_click=$._data($(".uploadOpcity")[0],"events")["click"];
			}
			catch(e){
				_uploadDocument();
			}	
		});
		//弹框

	}
	/**/
	function  _deleteItemList(deleteTitle, selectNumber){
		var searchResult=document.createElement("li");
		searchResult.className="deleteItemList";
		searchResult.setAttribute("name",selectNumber);
		$("#selectContent ul").append(searchResult);
		var searchTitle=document.createElement("a");
		$(".deleteItemList[name="+selectNumber+"]").append(searchTitle);
		searchTitle.setAttribute("title",deleteTitle);
		$(".deleteItemList[name="+selectNumber+"]").find("a").append("<i></i>"+deleteTitle);
	}
	function _deleteItem(){	
		var size=$(".deleteSelect").length;
		$(".deleteItemList").click(function(){
			//这个值会自动变化			
			if(size==1){
				$("#selectedDataDiv").css("display","none");
				$("#delete").css({"opacity":"0.2","cursor":"auto"});
				$("#upload").css({"opacity":"0.2","cursor":"auto"});
			}
			var cancelNumber=$(this).attr("name");
			$(".catalogDiv[name="+cancelNumber+"]").attr("class","catalogDiv");
			$(".catalogDiv[name="+cancelNumber+"]").css({"border":"1px solid #bababa","color":"","background-color":"#fffffd"});
			$(".catalogDiv[name="+cancelNumber+"]").find("i").remove();
			$("#selectContent ul li[name="+cancelNumber+"]").remove();
			size=size-1;
			
			event.stopPropagation();
		});
	
	}
	function _uploadDocument(){
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
}
/*资料搜索*/
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
		$(".deleteSelect").attr("class","catalogDiv");
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
						catalogDivTest=catalogDivTest.replace(reg,"<strong style='color:red'>"+searchWord+"</strong>");
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



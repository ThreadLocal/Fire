
submitData={"controller":"FacilityPatrolQuery",
    "enum":"facilityPatrolRecord",
    "jsonPara":{
        "page":"1",
        "lengthPerPage":15,
    }
};
/*detailTable={'facilityID':"1552485",
    'tableHeader':["灭火器托架是否损坏","机筒有无损失","压力是否正常",'皮管是否良好','提手把有无断裂','药剂是否在有效期限内',"安全插栓是否被拔掉",'周围是否被物品堵塞',"喷嘴、罐体是否损坏或腐蚀"],
    'tableContent':[1,0,0,0,0,0,0,0,0],
    'url':'images/facilityPatrol/fire.png ',
    "remark":"有未检查项目有未检查项目有未检查项目有未检查项目有未检查项目有未检查项目有未检查项目有未检查项目"
};*/
/*
 * 左边筛选对象
 * */
function patrolSearch(tablebuilding){
    this._tablebuilding=tablebuilding;
    this. _areaArray={};
}
patrolSearch.prototype= {
    campusSet: function () {
        /*加载校区*/
    	  $("#areaCampus").html("<option value='0'>校区选择</option>");
        for (var key in this._tablebuilding) {
            $("#areaCampus").append("<option value='" + key + "'>" + key + "</option>");
        }
        var that=this;
        $("#areaCampus").change(function(){
            var i=1;
            that._areaArray=[];
            $("#selectListArea").remove();
            $("#areaBuilding").empty();
            $("#areaBuilding").append("<option value='0'>楼栋选择&nbsp;&nbsp;&nbsp;</option>");
            $("#areaStair").empty();
            $("#areaStair").append("<option value='0'>楼层选择</option>");
            if($("#areaCampus").val()!="0"){/*选择发生了改变，且不为校区选择*/
            	
                var select= $("#areaCampus").find("option:selected").text();
                that._areaArray.unitName=select;
                /*  submitData['jsonPara']['unitName']=select;*/
               /*把值加入下一层*/
                for(var building in that._tablebuilding[select]){
                    $("#areaBuilding").append("<option value='" + i + "'>" +building + "</option>");
                    i++;
                }
                that.campusSelect();
                that.resultListF();
            }else{//选择了校区选择
            	delete that._areaArray["unitName"];
            	$("#selectListArea").remove();
            }
        });
        /*楼栋判断校区是不是为校区选择选中*/
      /*  $("#areaBuilding").click(function(){
           
            if($("#areaCampus").val()=="0") {前面一项未选择，则change无效
                $("#areaCampus").css("border","1px solid red");
                $("#areaCampus").after("<span class='faultSelect' id='faultArea' style='color:red;'>*</span>");
            }
        });*/
        $("#areaBuilding").change(function(){
        	delete that._areaArray["floor"];
            $("#areaBuilding").css("border","1px solid #9e9e9e");  
            $("#areaStair").empty();
            $("#areaStair").append("<option value='0'>楼层选择</option>");
          /*  if($("#areaCampus").val()=="0") {前面一项未选择，则change无效
                $("#areaCampus").css("border","1px solid red");
                $("#areaCampus").after("<span class='faultSelect' id='faultArea' style='color:red;'>*</span>");
               return false;
            }*/
            if($(this).val()!="0"){
             
                var select= $(this).find("option:selected").text();
                that._areaArray.buildingName=select;
                var campus=that._areaArray["unitName"];
                /*  submitData['jsonPara']['buildingID']=select;*/
                var floorKey=1;
                for(var j=0;j<that._tablebuilding[campus][select].length;j++){
                    var floor=that._tablebuilding[campus][select][j];
                    $("#areaStair").append("<option value='" + floorKey + "'>" + floor+ "</option>");
                    floorKey++;
                }
                that.campusSelect();
                that.resultListF();
            }else{
            	delete that._areaArray["buildingName"];
            	   that.campusSelect();
                   that.resultListF();
            }
        });
        $("#areaStair").change(function(){
           /* if($("#areaCampus").val()=="0") {
                 $("#areaCampus").css("border","1px solid red");
                 $("#areaCampus").after("<span class='faultSelect' id='faultArea' style='color:red;'>*</span>");
                 return false;
             }
             if($("#areaBuilding").val()=="0") {
                 $("#areaBuilding").css("border","1px solid red");
                 $("#areaBuilding").after("<span class='faultSelect' id='faultStair' style='color:red;'>*</span>");
                 return false;
             }*/
             if($("#areaStair").val()!="0"){
            	 var select= $(this).find("option:selected").text();
                 that._areaArray.floor=select;
                 /* submitData['jsonPara']['floor']=select;*/
                 that.campusSelect();
                 that.resultListF();
             }else{
                 delete that._areaArray["floor"]; 
                 that.campusSelect();
                 that.resultListF();
             }
            

        });
        this.radioSelect();
    },
    campusSelect:function(){
        //生成框框
        $("#selectListArea").remove();//开始全部删除，重新生成
        /*  var selectString=this._campus+" "+this._building+" "+this._floor;
         console.log(selectString);*/
        var selectResult=document.createElement('a');
        selectResult.id='selectListArea';
        selectResult.setAttribute('value', "01");
        selectResult.setAttribute('class', "resultList");
        $("#searchResult").append(selectResult);
        //遍历选择数组
        var selectText='';
        for(var key in  this._areaArray){
            selectText+="<span id="+key+" class='usefulNumber'>"+this._areaArray[key]+"</span>";
        }
        $("#selectListArea").append(selectText);
        $("#selectListArea").append("<span class='iconfont'>&#xf081;</span>");
    },
    resultListF:function() {
    	var that=this;
        $(".resultList").click(function () {
            var selectValue=$(this).attr("value");
            var selectId=$(this).attr("id");     
            $(this).remove();
            $(".selectRadioBackground[value="+selectId+"]").attr("class","");
            //获取id
            if(selectValue=="01"){
                $(".selectResult").empty();
                
                $("#areaCampus").append("<option value='0'>校区选择</option>");
                $("#areaBuilding").append("<option value='0'>楼栋选择&nbsp;&nbsp;&nbsp;</option>");
                $("#areaStair").append("<option value='0'>楼层选择</option>");
                //还要输入A区数据
                for (var key in  that._tablebuilding) {
                    $("#areaCampus").append("<option value='" + key + "'>" + key + "</option>");
                }
                delete submitData['jsonPara']['buildingName'];
                delete submitData['jsonPara']['unitName'];
                delete submitData['jsonPara']['floor'];

            }
            if(selectValue=="02"){
                //后面几项
                delete submitData['jsonPara'][selectId];
                $(".selectRadioBackground").each(function(){
                    if($(this).attr("value")== selectId){
                        $(this).removeClass(".selectRadioBackground");
                    }
                });
                //改变提交data
            }
            console.log(submitData);
        });

    },
    radioSelect:function(){
        var that=this;
        $(".selectRadio a").click(function(){
            //只能单选
            var selectId=$(this).attr("value");
            var selectState=$(this).attr("attr");
            var selectText= $(this).text();
            if($(this).hasClass("selectRadioBackground")){
                $(this).removeClass("selectRadioBackground");
                //下面对应的要取消
                $("#"+selectId).remove();
                
            }
            else{
                $(this).addClass("selectRadioBackground");
                if( $(this).siblings("a").hasClass("selectRadioBackground")){
                    //表明同级之间存在了点击，此时要删除
                    $(this).siblings("a").removeClass("selectRadioBackground");

                    $("#"+selectId).html("<span class='usefulNumber'>"+selectText+"</span>"+"<span class='iconfont'>&#xf081;</span>");
                    $("#"+selectId).attr("attr",selectState);
                    /*submitData['jsonPara'][selectId]=selectState;*/
                }else{
                    var selectTextSpan="<span class='usefulNumber'>"+selectText+"</span>";

                    $("#"+selectId).remove();
                    var selectStringHtml="<a  class='resultList' id="+selectId+"  value='02' attr="+selectState+">"+selectTextSpan+"<span class='iconfont'>&#xf081;</span></a>";
                    /*submitData['jsonPara'][selectId]=selectState;*/
                    $("#searchResult").append(selectStringHtml);
                }
            }
            that. resultListF();

        });
    }
};
/*
表格生成对象
* */
function tableGenerate(tableItem,tableId){
    this.tableItem=tableItem;
    this._tableId=tableId;
}
tableGenerate.prototype.searchNowPage=1;
tableGenerate.prototype.searchTotalPage=1;
tableGenerate.prototype= {
    initTableHeader:function(){
        var  tableHeader= this.tableItem["tableHeader"];
        $("#" +  this._tableId + " tr").remove();
        var newTr = "<tr id='header'><th>序号</th>";
        for (var i in tableHeader){
            var newTd = "<th>" + tableHeader[i] + "</th>";
            newTr += newTd;
        }
        $("#" +  this._tableId).append(newTr + "</tr>");
    },
    addTable:function() {
        var tableContent =  this.tableItem["tableContent"];
        $("#page_navigation ul").css("display","block");
        $("#" +   this._tableId + " td").remove();
        $("#" +   this._tableId + " tr[id!=header]").remove();
        $("#allImageFalse").remove();
        //返回没有数据
        if (Object.keys(tableContent).length == 0) {
            this.noData();
            //右边添加没数据Div   
        }
        else {
            for (var i in tableContent) { 
            	var pageLength=submitData['jsonPara']["lengthPerPage"];
            	var orderNumber=((parseInt(submitData['jsonPara']["page"])-1)*pageLength)+parseInt(i);           	
                var newTr = "<tr id=\'patrolTr_"+orderNumber+"\'><td>" +orderNumber +"</td>";
               var patrolflag=false;
                for (var j in tableContent[i]) {
                	//添加判断
                	if(j=='5'){
                		if(tableContent[i][j]=="1"){
                			tableContent[i][j]="已巡查";
                			
                		}else{
                			tableContent[i][j]="未巡查";		
                		}
                	}else if(j=='6'){
                		if(tableContent[i][j]=="1"){
                			tableContent[i][j]="正常";
                		}else if(tableContent[i][j]=="0"){
                			tableContent[i][j]="异常";
                		} 
                	}
                	/*表示未巡查，对应的行加ID*/
                	if(tableContent[i][j]==""){
                		tableContent[i][j]="--";
                		patrolflag=true;
                	}
                    var newTd = "<td>" + tableContent[i][j] + "</td>";
                    newTr += newTd;
                }
                $("#" +   this._tableId).append(newTr + "</tr>");
                if(patrolflag==true){
                $("#patrolTr_"+i).attr({
                    "class": "trRaw",
                    "nodeID": tableContent[i][0]
                });}else{
                	  $("#patrolTr_"+i).attr({
                          "class": "trRaw patrolClick",
                          "nodeID": tableContent[i][0]
                      });
                }
            }
            //行数不够时补足
            if ($("#" +   this._tableId+ " tr[id!=header]").length <  this.tableItem["lengthPerPage"]) {
                var tableLength=this.tableItem["lengthPerPage"] - $("#" + this._tableId + " tr[id!=header]").length;
                for (var i = 0; i < tableLength; i++) {
                    var newTr = "<tr>";
                    for (var j = 0; j < ($("#" + this._tableId + " tr[id=header] th").length); j++)
                        newTr += "<td><br></td>";
                    $("#" +this._tableId).append(newTr + "</tr>");
                }
            }
            /*重置页码信息*/
            tableClick();
            this.searchNowPage=this.tableItem["page"];
            currentPage=this.searchNowPage;
            this.searchTotalPage=this.tableItem['totalPage'];
            $('#search_nowPage').val(this.searchNowPage);
            $("#totalPage").text(this.searchTotalPage);
        }
        if($("#facilityTableContent tr").hasClass(".trClick")!=true){//没有选中对象
   		    $("#noPatrol").css("display","block");
            $("#detailContent").css("display","none");
            $("#noPatrolDiv").css("display","none");
        }
    },
    ajaxTable:function(){
        var that=this;
       //判断是否存在选项
        if(submitData["flag"]==true){//有选项
        	submitData["enum"]="facilityPatrolRecord";
        }else{//无选项
        	submitData["enum"]="facilityPatrolStatus";
        }
        submitData["jsonPara"]["planArea"]=selePlanArea;
        submitData["jsonPara"]["fireFacilityPatrolPlanID"]=selePlanId;     
        submitData.jsonPara=JSON.stringify(submitData.jsonPara);
        $.ajax({
            type: "post",
            url: "../servlet/DispatchServlet",
            data: submitData,
            dataType: "json",
            success: function (simuData) {
                //调用生成表格程序
                submitData["jsonPara"]=$.parseJSON(submitData["jsonPara"]);
                that.tableItem=simuData['tableItem'];
                that.initTableHeader();
                that.addTable();
            }
        });
    },

    noData:function(){
    	$("#page_navigation ul").css("display","none");
        var allimgFalse=document.createElement("div");
        allimgFalse.id="allImageFalse";
        //这个id不对
        $("#facilityTableContent").append(allimgFalse);
        var img = document.createElement("img");
        img.id = "imageFalse";
        img.src="img/noData.png";
        $("#allImageFalse").append(img);
        var imgFalse=document.createElement("span");
        imgFalse.id="imgFalseTest";
        $("#allImageFalse").append(imgFalse);
        $("#imgFalseTest").text("抱歉，未搜索到相关异常数据");
    }

}
//表格提交和重置
function   submitSelect(tablebuilding){
    var tabgenerate=new tableGenerate(tableitem,"tableTbody");
    $("#searchSubmit").click(function(){
        //对submitdata赋值
    	
        submitData={"controller":"FacilityPatrolQuery",
            "enum":"facilityPatrolRecord",
            "jsonPara":{
                "page":"1",
                "lengthPerPage":15,
            }
        };
         if($("#searchResult").children().hasClass("resultList")==true){
        	    submitData["flag"]=true;
        	   $(".resultList").each(function(){
                   if($(this).attr("value")=="01"){
                       $('.usefulNumber').each(function(){
                           var key=$(this).attr("id");
                           var value=$(this).text();
                           submitData['jsonPara'][key]=value;
                       });
                   }else{
                       var key1=$(this).attr("id");
                       var value1=$(this).attr("attr");
                       submitData['jsonPara'][key1]=value1;
                   }
               });
        	 }else{
        		 delete  submitData["flag"];
        	 }     
        console.log(submitData['jsonPara']);
        tabgenerate.ajaxTable();
    });
    $('#searchRestart').click(function(){
    	delete  submitData["flag"];
        $(".resultList").remove();
        $(".selectResult").empty();
        $("#areaCampus").append("<option value='0'>校区选择</option>");
        for (var key in tablebuilding) {
            $("#areaCampus").append("<option value='" + key + "'>" + key + "</option>");
        }
        $("#areaBuilding").append("<option value='0'>楼栋选择&nbsp;&nbsp;&nbsp;</option>");
        $("#areaStair").append("<option value='0'>楼层选择</option>");
        $(".selectRadioBackground").attr("class","");
        //将传送数据清空
        submitData={"controller":"FacilityPatrolQuery",
            "enum":"facilityPatrolStatus",
            "jsonPara":{
                "page":"1",
                "lengthPerPage":15,
            }
        };
       
        tabgenerate.ajaxTable();
    });
}
function  pageClick(){
    var tabGenerate1=new  tableGenerate(tableitem,"tableTbody");
    //改变数据，并发送
    $('#first_page').click(function () {//首页
        if (currentPage==1) {
        	$('#search_nowPage').val(currentPage);
            return
        }
        currentPage=1;
        
        submitData['jsonPara']["page"]=currentPage;
        tabGenerate1.ajaxTable();
    });
    $('#previous_page').click(function () {//上一页
        if (currentPage == 1) {
        	$('#search_nowPage').val(currentPage);
            return
        }
        currentPage--;

        submitData['jsonPara']["page"]=currentPage;
        tabGenerate1.ajaxTable();
    });
    $('#next_page').click(function () {//下一页
        if (currentPage == (tabGenerate1.tableItem["totalPage"])) {
        	$('#search_nowPage').val(currentPage);
            return
        }
        currentPage++;

        submitData['jsonPara']["page"]=currentPage;
        console.log(submitData);
        tabGenerate1.ajaxTable();
    });

    $('#last_page').click(function () {//尾页
        if (currentPage==tabGenerate1.tableItem["totalPage"]) {
        	$('#search_nowPage').val(currentPage);
            return
        }
        currentPage=tabGenerate1.tableItem["totalPage"];

        submitData['jsonPara']["page"]=currentPage;
        tabGenerate1.ajaxTable();
    });
    //页码点击事件
    $("#search_nowPage").on("keydown",function(event){
        if( event.which==13 ){//判断输入的正确性
        	var inputPage=$("#search_nowPage").val();
        	if(isNaN(inputPage)){
        		$('#search_nowPage').val(currentPage);
        	}
        	else{
        	if(inputPage==""){
    			return false;
    		}
        	else if(inputPage<1){
        		currentPage=1;
        		
			}
        	else if(inputPage>tabGenerate1.tableItem["totalPage"]){
				currentPage=tabGenerate1.tableItem["totalPage"];
			} 
        	else{
        		currentPage=inputPage;
        	}
        		$('#search_nowPage').val(currentPage);
        		submitData['jsonPara']["page"]=currentPage;
        		tabGenerate1.ajaxTable();
        	
        	}
        }
    });
}
//右边部分程序

//表格点击事件
function tableClick(){
	var tableClickFlag="";	
	/*已经巡查的才会发生点击*/
    $(".patrolClick").click(function(){  
    	$(this).attr("class","trRaw patrolClick");
        var nodeId= $(this).attr("nodeid");
        var address=$(this).find("td:eq(2)").text()+$(this).find("td:eq(3)").text()+$(this).find("td:eq(4)").text();
        var patrolIsNormal=$(this).find("td:eq(7)").text();
        var patrolState=$(this).find("td:eq(6)").text();
        var facilityType=$(this).find("td:eq(5)").text();
        var datadetail=new dataDetail(nodeId,address,facilityType,patrolIsNormal,patrolState);
    	if(tableClickFlag==$(this).find("td:eq(1)").text()){//表示选择的是同一个,去掉背景色，取消选择
    		tableClickFlag="";
    	  $("#facilityTableContent tr:nth-child(even)").css("background-color","#fdfdfd");
      	  $("#facilityTableContent tr:nth-child(odd)").css("background-color","#f7f7f7");
      	 $("#noPatrol").css("display","block");
         $("#detailContent").css("display","none");
         $("#noPatrolDiv").css("display","none");
    	  //取消右边选择
    	}else{//选择为不同的
    		$(this).addClass("trClick");
    		tableClickFlag=$(this).find("td:eq(1)").text();
    		 $("#facilityTableContent tr:nth-child(even)").css("background-color","#fdfdfd");
         	  $("#facilityTableContent tr:nth-child(odd)").css("background-color","#f7f7f7");
       	      $(this).css("background-color","#e8e8e8"); 
       	     datadetail.conditionGenerate();
       	      
    	}    
    });
}
/**
右边数据对象
*/
function dataDetail(nodeId,address,facilityType,patrolIsNormal,patrolState){
    this._nodeId=nodeId;
    this._address=address;
    this._facilityType=facilityType;
    this._patrolIsNormal=patrolIsNormal;
    this._patrolState=patrolState;
    this._detailTable={};
}
dataDetail.prototype={
    //生成表格和图片
    conditionGenerate:function(){
        if( this._patrolState=="0"){
            //重新写重叠数据
            this.noPatrol();
        }else{
            //发数据程序。得到数据
            this.ajaxDetail();
        }
    },
    hydrantTable:function(){
        //前五条is
    	var that=this;
    	//进入需要清空
    	 $("#tableLeft tr td").text("");
    	 $("#tableRight tr td").text("");
    	
    	  $(this).find("td:eq(1)").css("color","");
        $("#rightPictureInformation span:eq(0)").text(this._address);
        $("#rightPictureInformation span:eq(1)").text(this._facilityType);    
        $("#rightPictureInformation span:eq(2)").text(this._patrolIsNormal);
        var i=0;
        $("#tableLeft tr.tableContent").each(function(){
            if(i==that._detailTable["tableHeader"].length){//==9
                return
            }
            $(this).find("td:eq(0)").text(that._detailTable["tableHeader"][i]);
            if(that._detailTable["tableContent"][i]=="1"){
                $(this).find("td:eq(1)").html("&#xea10;");
           	   $(this).find("td:eq(1)").css("color"," #18a38b");   
            }else{
                $(this).find("td:eq(1)").html("&#xf081;");//如果有问题，要换颜色
                $(this).find("td:eq(1)").css("color","#bc525d");
            }
            //颜色得重新写入
            i++;
        });
        $("#tableRight tr.tableContent").each(function(){
            if(i==that._detailTable["tableHeader"].length){//==9
                return
            }
            $(this).find("td:eq(0)").text(that._detailTable["tableHeader"][i]);
            if(that._detailTable["tableContent"][i]=="0"){
                $(this).find("td:eq(1)").html("&#xea10;");//如果有问题，要换颜色
           	    $(this).find("td:eq(1)").css("color"," #18a38b");
            }else{
                $(this).find("td:eq(1)").html("&#xf081;");//如果有问题，要换颜色
                $(this).find("td:eq(1)").css("color","#bc525d");
            }
            i++;
        });
        $("#pictureTableNote span").text(that._detailTable["remark"]);
        var url="url("+"'"+that._detailTable["url"]+"'"+")";
        $("#patrolPicture").css("background-image", url);
    },
    //点击为已经巡查
    noPatrol:function(){
        $('#noPatrolDiv').remove();
        $("#noPatrol").css("display","none");
        $("#detailContent").css("display","none");
        var noPatrolDiv=document.createElement("div");
        noPatrolDiv.id="noPatrolDiv";
        //这个id不对
        $("#facilityRightPicture").append(noPatrolDiv);
        var img = document.createElement("img");
        img.id = "imageDiv";
        img.src="img/noData.png";
        $("#noPatrolDiv").append(img);
        var imgFalse=document.createElement("span");
        imgFalse.id="imgFalseDiv";
        $("#noPatrolDiv").append(imgFalse);
        $("#imgFalseDiv").text("该设备未巡查");

    },
    ajaxDetail:function(){
        var that=this;
        //组提交数据
        var submitDetail={"controller":"FacilityPatrolDetail",
            "enum":"facilityPatrolDetail"
            
        };
        submitDetail["fireFacilityID"]=this._nodeId;
        submitDetail["planID"]=selePlanId;
        console.log(submitDetail);
        $.ajax({
            type: "post",
            url: "../servlet/DispatchServlet",
            data: submitDetail,
            dataType: "json",
            success: function (simuData) {
                //调用生成表格程序
            	that._detailTable=simuData;
                $("#noPatrol").css("display","none");
                $('#noPatrolDiv').remove();
                $("#detailContent").css("display","block");
                that.hydrantTable();
            }
        });
    }
};

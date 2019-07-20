//发送请求函数
var  websocketflag=0;       // 楼层点击发送数据标志
var  treefolderheaderFlag=1;// 右侧表格展示判断标志
var  parentArray=[];         // 存储对应楼栋的每层父元素
var jsonBuilding={};         // 楼栋基本信息
var jsonState={};            // 楼栋状态
var buildingArray=[];
var setTotoalNum="-";
var setUnnormalNum="-";
var setAlarmNum="-";
var url_inform="";//url参数后缀

/*
 * 树状菜单对象
 */
function transferData(TreeList,treeList,systemID,url,weburl) {
    this._Treelist=TreeList;
    this._treeList=treeList;
    this.systemID=systemID;
    this._url=url;                      
    this._weburl=weburl;                                          
}
transferData.prototype.webStart=function(){
	/*固定楼栋数据*/
    this.jsonBuildingAcquire();
    /*实时状态数据*/
    this.jsonStateAcquire();
}
/*
 * 树状菜单数据获取
 */
transferData.prototype.jsonBuildingAcquire=function(){
    var That=this;
  /*  var pathArray = location.pathname.split("/");
    systemName = pathArray[pathArray.length - 1];*/
    /*表格初始化*/
  /*  if(systemName == "fireInspection.htm"){
    myCurrentTable=new CurrentTable("#tableTbody",15);
    }
    else{*/
    /*初始化第一次表格*/
    	myCurrentTable=new CurrentTable("#tableTbody",20);    
    myCurrentTable.IntitialTable(); 
    acontentTable=new CurrentTable("#tableTbody",15,""); 
    myWaterTable = new CurrentTable("#tableTbody",20,"");
    $.ajax({
        type: "post",
        url: "../servlet/DispatchServlet",
        data: {"controller": That._Treelist, "enum":That._treeList,"systemID":That.systemID},
        dataType: "json",
        success: function (simuData) {
        	 jsonBuilding=simuData;
        	 // 根据数据写百度地图覆盖物，状态是不是可以确定下，待商议
             var treeContent=new treeList(That.systemID);
              var alldata=treeContent.SystemJudge();
                treeContent.treeClick(That.systemID);
                treeContent.treeSearch();
                /*塞入固定数据*/
                
                $("#monitorCampus").text(alldata[0]);
                $("#monitorBuilding").text(alldata[1]);
                if(alldata[2]!=undefined){
                	 $("#monitorFloor").text(alldata[2]);
                }
                var  treetablechange=new treeTableChange(parentArray); 	 
                treetablechange.tableStart();
               tree_item(That._weburl);
               //以下判断url参数
               url_inform=location.search.split("?")[1];
               url_inform=unescape(url_inform);
               if(url_inform != "undefined"){
            	   var building_id=url_inform.split("&")[0].split("=")[1];
            	   var building_area=url_inform.split("&")[1].split("=")[1].charAt(0);
            	   var floor_name=url_inform.split("&")[2].split("=")[1];
            	   $("#100111").click();
            	   $("#"+building_area).click();
            	   $("#"+building_id).click();
            	   $("#"+building_id).next().find("."+floor_name).eq(0).click();           	   
               }
               
        }
    });

};
/*
 * 实时数据
 */
transferData.prototype.jsonStateAcquire=function(){
    var that=this;
    if('WebSocket' in window){
        try{
            Montior_dataPara= new WebSocket(this._url);
        }catch (e){
            alert("浏览器不支持WebSocket!");
        }
    }else{
        alert("浏览器不支持WebSocket!");
    }
    // 向后端传的数据格式
    function dataSend(){
        var flag1 = that.systemID;
        Montior_dataPara.send(flag1);
    }
    // 连接成功触发,前端向后端传数据
    Montior_dataPara.onopen = function(simuRealData){
        dataSend();
    };
    Montior_dataPara.onerror=function(simuRealData){
        alert("连接失败");
    };
    Montior_dataPara.onmessage = function(simuRealData){
    	  jsonState=eval('('+simuRealData.data+')');
          // 打表和换数据对象，根据选中的楼栋换取数据
    	  // 首先需要判断是否发生点击
    	  var  treetablechange=new treeTableChange(parentArray); 	 
           treetablechange.tableStart();
           echartsGenrete();
           Montior_dataPara.onclose = function(simuRealData){
        
    };
        };
};
/*
 * 树状菜单，以及对应点击的表格事件，输入为子系统id,以及楼栋数据
 */
function treeList(systemID){  
     this.systemID=systemID; 
     this.pointBuilding="";    // 点击选中的楼栋名称
     this.deleteFlag=0;
     }
treeList.prototype={
areaSort:function(){
	 var  keyArray=Object.keys(jsonBuilding);
     keyArray.sort(function(a,b){
  	   var aAac=a.substring(0,1).charCodeAt(); 
  	   var bAac=b.substring(0,1).charCodeAt(); 
           return   aAac-bAac;   	   
     });
     return keyArray;
},
SystemJudge:function(){
	var keyArray=this.areaSort();
	var alldata=[];
	 if(this.systemID=="7"){/*消防特殊情况*/
		 alldata=this.createInspectionTree(keyArray);  
		
		  }else{
			 alldata=this.createTree(keyArray);
		  }
	 return alldata;
		},
createInspectionTree:function(keyArray){
    var  allData=[];
    var tree= document.getElementById("tree1");
    var treefolder=this.folderCreate(tree, "重庆大学", "100111");
        treefolder.style.display = "none";
    var areaData=0;
    var  buildingData=0;
   /*排序*/
    for(var i=0;i<keyArray.length;i++){
 	   areaData++;
 	   var keyRebuild=keyArray[i].substring(0,1);
 	   var folderContentArea = this.folderCreate(treefolder,keyArray[i],keyRebuild);
 	   folderContentArea.style.display="none";
 	   var floorTest="";
        for (var key1 in jsonBuilding[keyArray[i]]) {// 楼遍历
        	floorTest=jsonBuilding[keyArray[i]][key1].buildingName;
       	     buildingData++;
        	this.itemCreate(floorTest,key1,folderContentArea);
             //增加类名便于搜索
        	
        }
    }
              allData.push(areaData);
              allData.push(buildingData);            
              return allData;
},	
/*中间层生成*/
folderCreate:function(tree, key, id){
	 var folder = document.createElement("div");
     folder.className = "tree-folder";
     tree.appendChild(folder);
     var folderHeader = document.createElement("div");
     var folderContent = document.createElement("div");
     folderContent.className = "tree-folder-content";
     folderHeader.className = "tree-folder-header";
     folderHeader.setAttribute("id", id);
     folder.appendChild(folderHeader);
     folder.appendChild(folderContent);
     var folderHeaderImg = document.createElement("i");
     folderHeaderImg.className = "icon-plus";
     folderHeader.appendChild(folderHeaderImg);
     var folderHeaderName = document.createElement("div");
     folderHeaderName.className = "tree-folder-name";
     folderHeader.appendChild(folderHeaderName);
     folderHeaderName.innerHTML = key;// 传入值为输入的内容
     return folderContent;// 返回的div,向其中添加下一层数据
},
/*最底层生成*/
itemCreate:function(floorTest,key,folderContentBuilding){
	 var treeItem = document.createElement("div");
     treeItem.id=key;
     treeItem.className = "tree-item";
     treeItem.setAttribute("class","tree-item "+floorTest);
     var itemHeaderImg = document.createElement("img");
     itemHeaderImg.className = "icon-building";
     itemHeaderImg.src = "images/Bmap/icon-building.png";
     treeItem.appendChild(itemHeaderImg);
     var itemHeaderName = document.createElement("div");
     itemHeaderName.className = "tree-item-name";
     treeItem.appendChild(itemHeaderName);
     itemHeaderName.innerHTML=floorTest;// 传入值为输入的内容
     folderContentBuilding.appendChild(treeItem);/*从哪里加入*/
},

/* 生成树形图 */
createTree:function(keyArray){
           var  allData=[];
           var tree= document.getElementById("tree1");
           var treefolder=this.folderCreate(tree, "重庆大学", "100111");
               treefolder.style.display = "none";
           var areaData=0;
           var  buildingData=0;
           var  stairData=0;
          /*排序*/
           for(var i=0;i<keyArray.length;i++){
        	   areaData++;
        	   var keyRebuild=keyArray[i].substring(0,1);
        	   var folderContentArea = this.folderCreate(treefolder,keyArray[i],keyRebuild);
        	   folderContentArea.style.display="none";
               for (var key1 in jsonBuilding[keyArray[i]]) {// 楼遍历
              	 buildingData++;
                   var folderContentBuilding=this.folderCreate(folderContentArea ,jsonBuilding[keyArray[i]][key1].buildingName,key1);// 装楼层的框，并且要为每个楼层添加类名
                   folderContentBuilding.parentNode.firstChild.setAttribute("class","tree-folder-header buildingSelect");
                   folderContentBuilding.style.display = "none";
                   // 为每个楼层遍历添加类名，便于选中
                   var floorTest="";
                   for(var j=0;j<jsonBuilding[keyArray[i]][key1]["nodeFloor"].length;j++){/*生成最底层*/
                  	 stairData++;
                  	 floorTest=jsonBuilding[keyArray[i]][key1]["nodeFloor"][j];
                  	 var key=" ";
                      this.itemCreate(floorTest,key,folderContentBuilding);
                   }
               }
           }
                     allData.push(areaData);
                     allData.push(buildingData);
                     allData.push(stairData);
                     return allData;
             },
            /* 树形图点击 */
treeClick:function(){
               var that=this;
                $(".tree-folder-header").on("click", function () {
                	 $("#tableContent").css("height","778px");
                	myCurrentTable.newpagenum=1;
                	myCurrentTable.IntitialTable();
                	$("#informationPicture").css("background",'');
      	            $(".pointArea").remove();
      	          $("#subsystemSel").empty();//清空
      	          $("#noPicture").remove();
      	            $("#informationPictureTitle").text(""); 
      	            $("#currentFloor").text(""); //去掉具体楼层信息包括：文字、背景图以及点位
                    treefolderheaderFlag=1; // 允许展示实时表格统计信息flag=1
                    try{buildstair.close();
                        websocketflag=0;
                        }  
                    catch(e){
                    	
                    }
               var $this = $(this);
              /* buildingSelect=$(this).attr("id"); */// 选中的信息
               that.treeClickResult($this);
               that.parentSearch($this);
               /* 获取教学楼的所有类型设备设置样式并先隐藏 */
               that.selectRetreat();
               that.subSystemJudge($this);
               var  treetablechange=new treeTableChange(parentArray);
                    treetablechange.tableStart();
                 
                 });
            },
subSystemJudge:function($this){
	  if(this.systemID=="2"){
		  this.get_deviceLogo($this.attr("id"));	  
		  }  
	  //其他子系统可能执行的函数不同
	  },
get_deviceLogo:function(it_self){
	            $("#selectDiv").remove();
            	if( parentArray.length==2 ){
            		var total_deviceSort=jsonBuilding[parentArray[1]][it_self]["deviceSort"];     //获取该楼栋所有设备类型
            	    $(".subsystemSelEvery").empty();   //先清除原有图标
            	    var device_num=total_deviceSort.length;
            	    /*2页*/
            	    var numberDevice=0;
            	
            		$("#subsystemSel").css({"transform":"translateX(-700px)",
                        "width":(Math.ceil(device_num/14)+2)*700+"px"});
            	    if(device_num>14){
            	    	var ceilNum=14-device_num%14;
            	    	$("#pointDraw").append("<div id='selectDiv'> <a id='selectLeft' class='selectItem'><i class='iconfont'>&#xf0a4;</i></a> <a id='selectRight' class='selectItem'><i class='iconfont'>&#xf078;</i></a> </div>")
            	    	 for(var number=(Math.ceil(device_num/14)-1)*14;number<device_num;number++){
            	    			$("#subsystemSel").append("<div class='subsystemSelEvery' circulate='2' device_sort="+total_deviceSort[number]+" select='disable' style='opacity:0.4;position:relative'><img class='subsystemSelIcon' title="+total_deviceSort[number] +" src="+'images/xfIcon/'+total_deviceSort[number]+'.png'+">"+"<div class='subsystemSelName'>"+total_deviceSort[number].split("-")[1]+"</div><div>");
            		 	    }
            	    	for(var i=0;i<ceilNum;i++){
            	    		$("#subsystemSel").append("<div class='subsystemSelEvery' circulate='2' position:relative'></div>");
            	    	}
            	    	while(numberDevice<device_num){
            	    		
            	 	    	$("#subsystemSel").append("<div class='subsystemSelEvery' circulate='1' device_sort="+total_deviceSort[numberDevice]+" select='disable' style='opacity:0.4;position:relative'><img class='subsystemSelIcon' title="+total_deviceSort[numberDevice] +" src="+'images/xfIcon/'+total_deviceSort[numberDevice]+'.png'+">"+"<div class='subsystemSelName'>"+total_deviceSort[numberDevice].split("-")[1]+"</div><div>");
            	 	    	numberDevice++;
            	    	}
            	    	for(var i=0;i<ceilNum;i++){
            	    		$("#subsystemSel").append("<div class='subsystemSelEvery' circulate='2' position:relative'></div>");
            	    	}
            	    	 for(var numberStart=0;numberStart<14;numberStart++){
            	    			$("#subsystemSel").append("<div class='subsystemSelEvery'circulate='2' device_sort="+total_deviceSort[numberStart]+" select='disable' style='opacity:0.4;position:relative'><img class='subsystemSelIcon' title="+total_deviceSort[numberStart] +" src="+'images/xfIcon/'+total_deviceSort[numberStart]+'.png'+">"+"<div class='subsystemSelName'>"+total_deviceSort[numberStart].split("-")[1]+"</div><div>");
            		 	    }
            	    	 //添加
            	    }
            	    else{
            	    	$("#selectDiv").remove();
            	    	$("#subsystemSel").css({"transform":"translateX(0px)",
                            "width":"700px"});
            	    	
            	    	while(numberDevice<device_num){
            	 	    	$("#subsystemSel").append("<div class='subsystemSelEvery' circulate='1' device_sort="+total_deviceSort[numberDevice]+" select='disable' style='opacity:0.4;position:relative'><img class='subsystemSelIcon' title="+total_deviceSort[numberDevice] +" src="+'images/xfIcon/'+total_deviceSort[numberDevice]+'.png'+">"+"<div class='subsystemSelName'>"+total_deviceSort[numberDevice].split("-")[1]+"</div><div>");
            	 	    	numberDevice++;
            	    	}
            	    	
            	    }
            	 /*   $("#pointDraw").hover(function(){
            	    	$("#selectDiv").css("display","block");
            	    },function(){
            	    	$("#selectDiv").css("display","none");
            	    });*/
            	    var clickDistance=-700;
            	    
            	   $("#selectLeft").click(function(){
            	    	clickDistance+=700;
            	    	if(clickDistance<=0){
            	    	$("#subsystemSel").css({"transform":"translateX("+clickDistance+"px)",
            	               "transition-property":"transform",
            	               "transition-duration":"0.6s"
            	            });}
            	    	if(clickDistance==0){
            	    		  clickDistance=-(Math.ceil(device_num/14))*700;
            	    		setTimeout(function(){ 	 
            				       $("#subsystemSel").css({"transform":"translateX("+clickDistance+"px)",
            					   "transition-property":"",
            		               "transition-duration":"" });
            	    	},600);
            	             }
            	    });
            	   $("#selectRight").click(function(){
            		 	clickDistance-=700;
            	    	if(clickDistance<=0){
            	    	$("#subsystemSel").css({"transform":"translateX("+clickDistance+"px)",
            	               "transition-property":"transform",
            	               "transition-duration":"0.6s"
            	            });}
            	    	var distanceMax=-(Math.ceil(device_num/14)+1)*700;
            	    	  if(clickDistance==distanceMax){
            	    		  clickDistance=-700;
            	           	setTimeout(function(){
            				   $("#subsystemSel").css({"transform":"translateX("+clickDistance+"px)",
            					                        "transition-property":"",
            		                                     "transition-duration":"" });  
            	    	},600);
            	    	  }
            	    });
            	  	}	
            },            /* 点击结果操作 */
treeClickResult:function($this){
				$("#pumpTable td").text("");
	             $(".tree-folder-header").css("background-color", "");
                 $("#searchInput").val("");
                $(".tree-item-name").parent(".tree-item").css("background-color", "");
                var divDisplay = $this.siblings(".tree-folder-content").children(".tree-folder,.tree-item");// children只查一级，存在下一级菜单
                // 选中的是楼栋
                var divBuilding=$this.hasClass("buildingSelect");
                if (divDisplay != null) {// 选中为楼栋校区
             /*
				 * $this.parent().siblings(".tree-folder").find(".tree-folder-header").css("background-color",
				 * "");///这里把同级，并且对应下一级均背景颜色清掉
				 */    if ( $this.children("i").attr("class") == "icon-plus") {// 并且未打开，则为减号
                    	 this.deleteFlag=0;
                        // 让子元素出现
                      /* $this.css("background-color", "#D3D6E1"); */                   
                        $this.siblings(".tree-folder-content").css("display", "block");
                        // 变加号为减号
                        $this.children("i").attr("class", "icon-implus");
                        $this.parent().siblings(".tree-folder").children(".tree-folder-content").css("display", "none");
                        $this.parent().siblings(".tree-folder").children(".tree-folder-header").children("i").attr("class", "icon-plus");
                        if(divBuilding==true) {// 选中为楼栋      
                            var buildingNumber = $this.attr("id");
                            $this.parent().siblings(".tree-folder").children(".tree-folder-content").css("display", "none");
                            var siblings = $this.parent().parent().parent().siblings(".tree-folder").children(".tree-folder-content").find(".tree-folder-content");
                            siblings.css("display", "none");
                            siblings.siblings(".tree-folder-header").find("i").attr("class", "icon-plus");
                            $this.parent().siblings(".tree-folder").children(".tree-folder-header").find("i").attr("class", "icon-plus");
                            var building = $this.children(".tree-folder-name").text();
                            var buildArea = $this.parent().parent().siblings(".tree-folder-header").attr("id") + "区";
                            $("#buildingPictureTitle span").html(building);                        
                        }
                    }
                    else {// 已经打开
                        // 还需要判断是不是重庆大学发生了点击
                        $this.parent().find(".tree-folder-content").css("display", "none");
                        // 变减号为加号
                        $this.parent().find("i").attr("class", "icon-plus");
                        $this.removeClass("buildSelect");
                      /* $this.css("background-color", ""); */
                        // 发生取消点击，将parentArray最后一位删除
                        this.deleteFlag=1;   
                    }
                }
            },
selectRetreat:function(){
              	$("#currentBuilding span").click(function(){
              		//获取位置信息
              		var locationText=" ";
              		var size=$("#currentBuilding span").size();
              		var index=$("#currentBuilding span").index($(this));
              		if(index+1==size&&($("#currentFloor").text()=="")){//最后一位
              			return false;
              		}else if(index+1==size&&($("#currentFloor").text()!="")){
              			locationText=$(this).text();
              			var	$areas=$(".tree-folder-header:contains("+locationText+")");
              			for(var i = 0; i < $areas.length; i++){
              				if($areas.eq(i).text() === locationText){
              					$areas.eq(i).click();
              					$areas.eq(i).click();
              				}
              			}
              			
              		}else{//出现了层
              			locationText=$(this).next().text();
              			var	$areas=$(".tree-folder-header:contains("+locationText+")");
              			for(var i = 0; i < $areas.length; i++){
              				if($areas.eq(i).text() === locationText){
              					$areas.eq(i).click();
              					
              				}
              			}
              		}
                  
              	});
              },
parentSearch:function($this){
                // 将父元素数组清空
      	 if(this.deleteFlag==1){//有收拢的情况
      		  $thisDom=$this.parent().parent().siblings(".tree-folder-header").find(".tree-folder-name").text();//获取的是父级的内容
      		  if($thisDom==""){
      			  $thisDom="重庆大学";
      		  }
      		  /*点击A区或者重庆大学，上次打开的是楼栋*/
      		  if($thisDom=="重庆大学"&& parentArray.length==2){
      			  parentArray=[];  
      			  $thisDom=$this.text();
      		  }else{
      			  parentArray.splice(parentArray.length-1,1);/**/
      		  }
      	 }else{
                 parentArray=[];
                 $thisDom=$this.text();// 仍然是选中的这一项
                 $parentDom=$this.parent().parent().siblings(".tree-folder-header");
                while($parentDom.attr("id") != undefined){
                                     parentArray.unshift($parentDom.text());
                                     $parentDom=$parentDom.parent().parent().siblings(".tree-folder-header");
                                 }
                // 换图片,看元素
      	 }
      	 //分成两个部分填写数据
                var buildingNumber = $this.attr("id");         	        
                var  backgroundImg ="images/building/"+buildingNumber+ ".jpg";
                    $("#buildingPictureContent img").attr("src", backgroundImg);
                   $('#buildingPictureContent img').error(function(){
                        $(this).attr('src',"images/building/noPic.png");
                    });             
                var currentBuildingTitle="<span>重庆大学</span>";
                if(parentArray.length!=0){
                    for(var i=0;i<parentArray.length;i++){
                    	if(i!= 0){
                    		currentBuildingTitle+=" > <span>"+parentArray[i]+"</span>";
                    	} 
                    }
                    currentBuildingTitle=currentBuildingTitle+" > <span>"+$thisDom+"</span>";// $thisDom选中的楼栋
                    $("#currentBuilding").html(currentBuildingTitle); 
                    $("#currentFloor").attr("class","");
                }
                },
/* 树形图搜索 */
treeSearch:function(){
	    var searchResult = new Array();
	    var buildingSelect="buildingSelect";
	  /*判断子系统*/
		 if(this.systemID=="7"){
			 buildingSelect="tree-item" ;
			
		}
	  /*回车提交输入值*/
	     $("#searchInput").on("keydown",function(event){
	         if( event.which == 13 ){
	             $("#searchSubmit").click();
	         }
	     });

	     /*提交按钮*/
	     $("#searchSubmit").on("click",function() {
          //去掉上一次匹配的操作
      	 $(".buildingSelect").css("background", "");
          $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");//选中的变加号号
          $(".className").css("display", "none");
          $("#explainDiv").children("li").remove();
          $("#explainDiv").css("display", "none");
          searchResult.length=0;
          var searchWord = $("#searchInput").val().trim();//获取输入的文字,去掉空格
          var reg= new RegExp(searchWord,"g");
          if (searchWord != "") {
              //遍历所有的item楼栋信息,把匹配成功的结果push入数组
           
              $("."+buildingSelect).each(function () {
                  var   $this = $(this);
                  //重新写匹配条件
                  var buildingName=$this.text();
                  
                  if (buildingName.match(reg)) {//匹配成功
                      searchResult.push($this.text());//存入数组
                      /*     $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");
                       $(".className").css("display", "none");*/
                      $this.parents(".tree-folder-content").addClass("className").css("display", "block");
                      $this.parents(".tree-folder-content").siblings(".tree-folder-header").children("i").attr("class", "icon-implus");
                      $this.css("background", " #e6e9f4");
                      //换图片，换百度地图，换数据
                  }
              });
              /*匹配的结果存入数组*/
              console.log(searchResult);
            /*显示匹配的结果*/
              if (searchResult.length > 1) {//多余一条才出现选择框
              	  var searchLi="";
                  $("#explainDiv").css("display", "block");                         
                  for (var i = 0; i < searchResult.length; i++) {
                      searchLi += "<li class='searchResult'>" +searchResult[i]+ "</li>";
                     
                  };
                  searchLi=searchLi.replace(reg,"<strong>"+searchWord+"</strong>");
                  $("#explainDiv").append(searchLi);
              }
          }
          $(".searchResult").on("click", function () {
              var searchResultString = $(this).text();
              $("#searchInput").val(searchResultString);
              treeChange(searchResultString);
          });
          $("#BuildingTree").on("click", function () {
              $("#explainDiv").css("display", "none");
              $("#explainDiv li").remove();
          });
      });
	     /*重置按钮*/
	     $("#searchReset").on("click",function(){
	         $("#searchInput").val("");
	         $("#searchSubmit").click();
	     });
      //选中一个绝对匹配
      function treeChange(finallyResult) {
          $("#explainDiv").css("display", "none");
          $("#explainDiv li").remove();
          $(".className").siblings(".tree-folder-header").children("i").attr("class", "icon-plus");
          $(".className").css("display", "none");
          $(".searchBackground").css("background", "");
          if (finallyResult != "") {
              $("."+buildingSelect).each(function () {
                  var   $this = $(this);
                  //重新写匹配条件
                  if ($this.text() === finallyResult) {
                      //匹配成功
                      $this.parents(".tree-folder-content").addClass("className").css("display", "block");
                      $this.parents(".tree-folder-content").siblings(".tree-folder-header").children("i").attr("class", "icon-implus");
                      $this.css("background", " #e6e9f4");
                      $this.addClass("searchBackground");//增加背景颜色
                  }
              });
          }
      }
  }        
        }

/*
 * 改变统计列表
 */
function treeTableChange(parentArray){
    this._parentArray=parentArray;
    this._currentTotalInfo=null;
}
treeTableChange.prototype={
    tableStart:function(){
        // 判断标志位
    	if(jsonObjectIsEmpty(jsonState)==false){
           this.showStatisticsInfo();       
        if(treefolderheaderFlag==1&& websocketflag==0){ // 首先判断是否发生了点击以展示表格
            this.statisticsTotalInfo();
        }
    	}

    },
    // 准备列表的数据
    showStatisticsInfo:function(){
        buildingTitle="<span>重庆大学</span>";        
        if(this._parentArray.length !=0){
        	// 这样直接等会改变数据
            var contentObject=jsonState;
            for(var i=0;i<this._parentArray.length;i++){
            	if(i != 0){
            		buildingTitle+=" > <span>"+this._parentArray[i]+"</span>";
            	}
                contentObject=contentObject[this._parentArray[i]][3];
            }
            buildingTitle=buildingTitle+" > <span>"+$thisDom+"</span>";// $thisDom选中的楼栋
            $("#buildingTitle").html(buildingTitle);
            /*需要绑定链接*/        
            contentObject=contentObject[$thisDom];// 此时contentObject内容为选中楼栋的所有信息
            if(contentObject==undefined){
            	 this.changeBuildInfo("-","-","-");
                                
            }else{
            	   this._currentTotalInfo=contentObject[3];  
            	  this.changeBuildInfo(contentObject[0],contentObject[1],contentObject[2]);
            }
            
        }
        else{// 选中为重庆大学
            $("#buildingTitle").html("重庆大学");
            $("#currentBuilding").html("<span>重庆大学</span>");    
            this._currentTotalInfo=jsonState["重庆大学"][3];
            this.changeBuildInfo(jsonState["重庆大学"][0],jsonState["重庆大学"][1],jsonState["重庆大学"][2]);
        }     
    },
    changeBuildInfo:function(newSetTotoalNum,newSetUnnormalNum,newSetAlarmNum){
        setTotoalNum=newSetTotoalNum;
        setUnnormalNum=newSetUnnormalNum;
        setAlarmNum=newSetAlarmNum;
        $("#buildingContent span:eq(0)").html(setTotoalNum);
        $("#buildingContent span:eq(1)").html(setUnnormalNum);
        $("#buildingContent span:eq(2)").html(setAlarmNum);
        
    },
    
    /* 表格生成 */
    statisticsTotalInfo:function(){
        $("#tableTbody").addClass("statistics");
        // 生成表格
        var contentArray=[];
        var contentArrayNum=0;
        var line=jsonState["tableHeader"].length;// 获取列数;
        if(this._currentTotalInfo!=null){
        for(var key in  this._currentTotalInfo){
            for(var i=0;i<line-1;i++){
                if(contentArray[contentArrayNum]!= undefined){
                    contentArray[contentArrayNum].push(this._currentTotalInfo[key][i]);
                }
                else{
                    contentArray[contentArrayNum]=[];
                    contentArray[contentArrayNum].push(key);
                    contentArray[contentArrayNum].push(this._currentTotalInfo[key][i]);
                }
            }
            contentArrayNum++;
        }
        var option={         		// 初始化功能模块
        		tableHeader:jsonState["tableHeader"],// 输入表格显示的表头,参数为数组
        		sort:function(a,b){
        			return parseInt(b[2])-parseInt(a[2]);
        		},               //自定义排序回调函数，根据字符串长短排序
        		tableContent:contentArray,// 输入表格内容提供,形式为json，json的value内的数组元素为表头参数需要显示的具体值
        	}
        myCurrentTable.drawTable(option);
        myCurrentTable.clickTable();
      
        }
        }, 
        /*绑定后退的点击事件*/
  
}
 /*
	 * 扇形图的加载
	 */
 function echartsGenrete(){
                $("#monitorNode").html(jsonState["重庆大学"][0]);
                var myChartPie =echarts.init(document.getElementById('situationChart'));
                var optionPie = {
                    title : {
                        text: '异常占比',
                        x:'46%',
                        textStyle: {
                            color: '#333',
                            fontSize: 15
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        top:'top',
                        data: ['正常','异常','报警'],
                        itemWidth: 9,
                        itemHeight: 7,
                        itemGap: 5,
                        selectedMode: false
                    },
                    series : [
                        {
                            hoverAnimation: false,
                            animation:false,
                            type: 'pie',
                            radius : '75%',
                            center: ['65%', '56%'],
                            label: {
                                normal: {
                                    show:false
                                }
                            },
                            data:[
                                /* {value:335, name:'故障'}, */
                                {value:  jsonState["重庆大学"][0]-jsonState["重庆大学"][1]-jsonState["重庆大学"][2], name:'正常'},
                                {value:jsonState["重庆大学"][1], name:'异常'},
                                {value:jsonState["重庆大学"][2], name:'报警'}
                            ],
                            color:['#34689a','#76b0d0',"#66d6e5"]
                        }
                    ]
                };
                myChartPie.setOption(optionPie);
          }
/*
 * 表格加载
 */
function CurrentTable(container,rowline,cursor){
	this.container=container;// 指定要绘制表格的容器名称
	this.rowline=rowline;// 指定行数
	this.newpagenum=1;// 加载当前页面为1
	this.pagenum=0;
	this.trcontent=[];
	if(arguments.length === 2){
		this.cursor_style = "forPageChange";
	}
	else{
		this.cursor_style = cursor;
	}
}

/* 以下为表格原生方法 */
CurrentTable.prototype={
  IntitialTable:function(){	
		$("#page_navigation ul").remove();
		 var ul=document.createElement("ul");
		 var navigation=document.getElementById("page_navigation");
		 navigation.appendChild(ul);
		 var navigation_html = '<li class="icon-page iconfont" id="first_page" title="首页">&#xea1a;</li><li class="icon-page iconfont" id="previous_page" title="上一页">&#xea44;</li>';
	     // 图重新找
	     navigation_html += '<li class="page_span1">第</li>';
	     navigation_html += '<li class="input_box"><input  class="num_box" type="text"><li>'// 这里关于表单的还不知道
	     navigation_html += '<li class="page_span2"> /' + '<span id="totalpage">&nbsp</span>'+'页</li>';
	     navigation_html += '<li class="icon-page iconfont" id="next_page"  title="下一页">&#xea42;</li><li class="icon-page iconfont" id="last_page"  title="尾页">&#xea1b;</li>';// 链接到对应页
	     $("#page_navigation ul").html(navigation_html);
	     $('.num_box').val(1);
	    // 页码操作上下页，跳转事件
	    this.changeNum();
	},
	clickTable:function(){
   	 $("#tableTbody tr[class=forPageChange]").click(function(){
   		 /*层级个数*/
   		 var $span = $("#currentBuilding span")
   		 var length = $span.length;
        	var locationText=$(this).find("td").eq(0).text();//获取位置信息
        	/*重庆大学层级下点击校区*/
        	if(length === 1){
        		if($("#100111>i:eq(0)").attr("class")=="icon-plus"){
        			$("#100111").click();
        			var $areas = $(".tree-folder-header:contains("+locationText+")");
        			for(var i = 0,length = $areas.length; i < length; i++){
        				if($areas.eq(i).find(".tree-folder-name:eq(0)").text() === locationText){
        					$areas.eq(i).click();
        				}
        			}
        			
        		}
        		else{
        			var $areas = $(".tree-folder-header:contains("+locationText+")");
        			for(var i = 0,length = $areas.length; i < length; i++){
        				if($areas.eq(i).find(".tree-folder-name:eq(0)").text() === locationText){
        					$areas.eq(i).click();
        				}
        			}	
        		}
        	}
        	/*校区层级下点击匹配楼栋*/
        	else if(length === 2){
        		var path_array = location.pathname.split("/"); 
        		system_name = path_array[path_array.length - 1];
        		if(system_name !== "fireInspection.htm"){
        			var $matched_builds = $(".tree-folder-header:contains("+$span.eq(1).text()+")").next().children(".tree-folder:contains("+locationText+")");
            		for(var i = 0,length = $matched_builds.length; i < length; i++){
            			if($matched_builds.eq(i).find(".tree-folder-name").text() === locationText){
            				$matched_builds.eq(i).find(".tree-folder-header:eq(0)").click();
            			}
            		}	
        		}
        		else{
        			var $matched_builds = $(".tree-folder-header:contains("+$span.eq(1).text()+")").next().children(".tree-item"+"."+locationText);
            		for(var i = 0,length = $matched_builds.length; i < length; i++){
            			if($matched_builds.eq(i).children(".tree-item-name").text() === locationText){
            				$matched_builds.eq(i).click();
            			}
            		}	
        		}        		
        	}
        	/*楼栋层级下点击匹配楼层*/
        	else {
        		var $matched_floors = $(".tree-folder-header:contains("+$span.eq(1).text()+")").next().children(".tree-folder:contains("+$span.eq(2).text()+")").find(".tree-item"+"."+locationText);
        		for(var i = 0,length = $matched_floors.length; i < length; i++){
        			if($matched_floors.eq(i).text() === locationText){
        				$matched_floors.eq(i).click();
        			}
        		}
        	}
        	
        	/*else{楼层点击
        		var building_id=$(".tree-folder-name:contains("+$("#currentBuilding").text().split(" ")[2]+")").parent().attr("id");
        		$("#"+building_id).next().find("."+locationText).eq(0).click();
        	}*/
        	
        });	
   },
   changeStateColor:function(){
	   $("#tableContent tr").not(":has(td:eq(3):contains('正常')),:not(':has(td[title])')").css("color","red");  
   },
	changeNum:function(){
		var that=this;
		liuzhuo = that;
		var thatChange=this.Pagechange;
		var thatClick=this.clickTable;		 // 键盘翻页
	    $(".num_box").on("keydown",function(){
	        if( event.which == 13 ){
	        	var inputPage=$(this).val();
	        	if(isNaN(inputPage)){
	        		$('.num_box').val(that.newpagenum);
	        	}
	        	else{
	  	        if(inputPage>(that.pagenum+1)){
	  	        	 that.newpagenum=that.pagenum+1;
	  	        	thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);	  	        	
	  	        	if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm")
	  	        	{
	  	        		that.changeStateColor();
	  	        	}
	  	        	thatClick();
	  	            $('.num_box').val(that.newpagenum);
	  	            
	  	        }
	  	        else if(inputPage<1){
	  	            that.newpagenum=1;
	  	          thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	  	        if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
	  	        	thatClick();
	  	            $('.num_box').val(that.newpagenum);
	  	            
	  	        }
	  	        else {
	  	            that.newpagenum=inputPage;
	  	          thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	  	        if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
	  	        	thatClick();
	  	            $('.num_box').val(that.newpagenum);
	  	            
	  	        }
	        	}
	        }
	      
	    });
	    // 向上翻页
	    $("#previous_page").click(function(){
	        if(that.newpagenum == 1){
	        	$('.num_box').val(that.newpagenum);
	            return
	        }
	        else{
	        	that.newpagenum--;
	        	thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	        	if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
  	        	thatClick();
	            $('.num_box').val(that.newpagenum);
	            
	        }
	    });
	    // 翻到首页
	    $("#first_page").click(function(){
	        if(that.newpagenum == 1){
	        	$('.num_box').val(that.newpagenum);
	            return
	        }
	        else{
	        	that.newpagenum=1;
	        	thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	        	if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
  	        	thatClick();
	            $('.num_box').val(that.newpagenum);          
	        }
	    });
	    // 翻到尾页
	    $("#last_page").click(function(){
	        if(that.newpagenum == that.pagenum+1){
	        	$('.num_box').val(that.newpagenum);
	            return
	        }
	        else{
	        	that.newpagenum=that.pagenum+1;
	        	thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	        	if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
  	        	thatClick();
	            $('.num_box').val(that.newpagenum);          
	        }
	    });
	    // 向下翻页
	    $("#next_page").click(function(){
	        if(that.newpagenum == that.pagenum+1){
	        	$('.num_box').val(that.newpagenum);
	            return;
	        }
	        else{
	        	that.newpagenum++;
	        	thatChange.call(myCurrentTable,that.trcontent,that.newpagenum);
	        	if($("#tableTbody tr:has(th:contains('参数值'))").length != 0 && location.pathname != "/Fire/xf5.19/fireInspection.htm"){
  	        		that.changeStateColor();
  	        	}
  	        	thatClick();
	            $('.num_box').val(that.newpagenum);           
	        }
	    });
	},
	systemIntital:{sort:false},// 用于设置默认功能,此处以sort为例
	drawTable:function(option){
		// 初始化默认option
		for(var key in this.systemIntital){
			if(option[key] == undefined){
			   option[key]=this.systemIntital[key];
			}
		}
		var codeindex=option.tableHeader.indexOf('状态');// 获取“状态”所在索引
	    var line=option.tableHeader.length;// 获取列数;
	    // 获取表头内容
	    tableheadercontent=this.gettableHeader(option.tableHeader,'');
	    var tableinfo=option.tableContent;// 获取表内容对象
	    if(option.sort != false){ // 进行排序
	        var contentArray=this.sort(tableinfo,option.sort);// 排序内容
	        this.pagenum=this.showSortTable(contentArray,line,0);// 遍历所有内容,将所有内容赋给内容数组
	    }
	    else{	    	
	    	this.pagenum=this.showCurrentInfo(tableinfo,line,0);// 遍历所有内容,实时展示表格
	    	
	    }
	    lz = this;
	    // 对内容进行排序
	    // $(".pointArea").unbind("dblclick");
	    // clickPoint();//点位点击事件
	    $("#totalpage").text(parseInt(this.pagenum)+1);
	    // 默认加载第一页内容
	    this.Pagechange(this.trcontent,this.newpagenum);
	},
	gettableHeader:function(Header,content){
	    content+='<tr>';
	    for(var key in Header){
	        content+='<th>';
	        content+=Header[key];
	        content+='</th>';
	    }
	    content+='</tr>';
	    return content;
	},
	Pagechange:function(trcontent,pagenum){
		
	    $(this.container).html(tableheadercontent+trcontent[pagenum-1]);
	},
	sort:function(tableinfo,fn){
	    var contentArray=[];// 存储所有内容到2维数组（包括编号）用于排序;
	    var indexNum=0;// 2维数组索引初始化
	    for(var key in tableinfo){
	        if(contentArray[indexNum] == undefined){
	            contentArray[indexNum]=tableinfo[key];
	            contentArray[indexNum].push(key);
	        }
	        else{
	            contentArray[indexNum].push(tableinfo[key]);
	            contentArray[indexNum].push(key); // 二维数组的每一个元素存储行内所有信息
	        }
	        indexNum++;
	    }
	    // sort排序很easy
	    contentArray.sort(fn);
	    return contentArray;
	},
	showCurrentInfo:function(tableinfo,line,pagenum){
		this.trcontent=[];
		var rowline=0;
		var row='';
	    for(var key in tableinfo){
	    	rowline++;
	    	// 每20行为一页（不包括表头的行数）
	        if(rowline == this.rowline+1){
	        	this.trcontent[pagenum]=row;
	        	row='';
	            rowline=1;
	            pagenum++;
	        }
	   row+="<tr class="+this.cursor_style+">";     
	for(var j=0;j<line;j++){
	    row+='<td title='+tableinfo[key][j]+'>'+tableinfo[key][j]+'</td>';   	        
	}
	    row+='</tr>';  
	    this.trcontent[pagenum]=row;        
	    }
	    // 将所有内容赋给trcontent数组，并将不足10行的补足空格
	    var complement=this.rowline-rowline; // 获取需要补足的行数个数
	    for(var i=0;i<complement;i++){
	    	this.trcontent[pagenum]+='<tr>';
	        for(var j=0;j<line;j++){
	        	this.trcontent[pagenum]+='<td>'+'&nbsp'+'</td>';
	        }
	        this.trcontent[pagenum]+='</tr>';
	    }
	    return pagenum
	},
	showSortTable:function(contentArray,line,pagenum){
		this.trcontent=[];
		var rowline=0;
		var row='';
	    for(var i=0;i<contentArray.length;i++){
	    	rowline++;
	    	// 每20行为一页（不包括表头的行数）
	        if(rowline == this.rowline+1){
	        	this.trcontent[pagenum]=row;
	        	row='';
	            rowline=1;
	            pagenum++;
	        }
	        // $("#"+contentArray[i][line]+'point').css('color',statecolor[contentArray[i][codeindex]]);
	        // $("#"+contentArray[i][line]+'point').attr({"location":contentArray[i][2],"state":stateinfo[contentArray[i][codeindex]],"sort":contentArray[i][1]});//为点位增加信息属性
	   row+="<tr class="+this.cursor_style+' '+'id'+'='+contentArray[i][line]+'>';     
	for(var j=0;j<line;j++){
	            row+='<td title='+contentArray[i][j]+'>'+contentArray[i][j]+'</td>';       
	}
	row+='</tr>';  
	this.trcontent[pagenum]=row;        
	    }
	    // 将所有内容赋给trcontent数组，并将不足10行的补足空格
	    var complement=this.rowline-rowline; // 获取需要补足的行数个数
	    for(var i=0;i<complement;i++){
	    	this.trcontent[pagenum]+='<tr>';
	        for(var j=0;j<line;j++){
	        	this.trcontent[pagenum]+='<td>'+'&nbsp'+'</td>'
	        }
	        this.trcontent[pagenum]+='</tr>';
	    }
	    return pagenum;
	}
}
/*
 * 楼层图不存在
 * 
 */
function nopicture(address,text){
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
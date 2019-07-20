/*










$(document).ready(function(){
    var ID=someinform;
    $.ajax({
        type: "post",
        url: "http://localhost:8080/fireMonitor/servlet/StaffServlet",
        data: {'controller':'staff','enum':'1','staffID':ID},
        dataType: "json",
        success: function (simuData) {
            console.log(simuData);
            var IDex=simuData.tableItem.tableContent[0];
            
            if(IDex=='staffIDerror'){
            	location.href="login.htm";
            }
            else if(IDex=='0'){
             	location.href="login.htm";
            }
            else{
            	
            var idname=simuData.tableItem.tableContent[2];
            var flag=simuData.tableItem.tableContent[1];
            var contentinform=idname;
            contentinform='<span id=workname style="color:#19a3d4;">'+contentinform+'</span>';
            $("#personManagement").before(contentinform); 
            var unlogin='<span id=dislogin style="color:red">'+'<img src="img/exist.png" style="margin-top:2px;height:18px;width:18px">'+'</span>';
            $("#workname").before(unlogin);
}
        }
    });
    
    addLocationHref();
setTimeout(function(){$("#dislogin").click(function(){
	  function delCookie(name)
	    {
	       var exp = new Date();
	       exp.setTime(exp.getTime() - 1);
	       var cval=getCookie(name);
	        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}  
	  delCookie('cookie1');
location.href='login.htm';
$.ajax({
    type: "post",
    url: "http://localhost:8080/fireMonitor/servlet/StaffServlet",
    data: {'controller':'staff','enum':'2','staffID':ID},
    dataType: "json",
    success: function (simuData) {
    	
        }
    }
);
});},1000);

});

*/

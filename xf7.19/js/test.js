$(document).ready(function() {
	$("#svg").load("images/floor/networkAlarm/2028/15层.svg", function() {
		sendPosition("2", "2028", "15层");
	});
});
function sendPosition(systemName, buidName, floorName) {
	var positionInfo = {};
	positionInfo["point"] = [];
	positionInfo["point"][0] = systemName;
	positionInfo["point"][1] = buidName;
	positionInfo["point"][2] = floorName;
	positionInfo["point"][3] = {};
	var $equipText = $("#equipNum").children();
	for ( var i = 0; i < $equipText.length; i++) {
		var $device = $equipText.eq(i).find("text");
		var deviceNum = $device.text();
		var positionLeft = $device.offset().left - 14;
		positionLeft=positionLeft/688;		
		var positionTop = $device.offset().top;
		positionTop=positionTop/688;
		positionInfo["point"][3][deviceNum] = [];
		positionInfo["point"][3][deviceNum].push(positionLeft);
		positionInfo["point"][3][deviceNum].push(positionTop);
	}
	positionInfo["point"] = JSON.stringify(positionInfo["point"]);
	positionInfo["controller"] = "SetPictureNode";
	$.ajax({
		type : "post",
		url : "../servlet/DispatchServlet",
		data : positionInfo,
		dataType : "",
		success : function(simuData) {
			console.log(simuData)
		}
	});
}
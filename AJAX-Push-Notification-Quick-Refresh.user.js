// ==UserScript==
// @name        AJAX Push Notification Quick Refresh 1.0
// @namespace   http://fluidapp.com
// @description Uses XHR requests on a timer to speed up the refresh rate of the GV SMS Inbox for pushing out to Prowl for enhanced iPhone OS Push Notifications
// @include     https://www.google.com/voice*
// @include     http://www.google.com/voice*
// @author      Tim Novinger {http://www.github.com/timnovinger} and Mike Krisher {http://www.github.com/mkrisher}
// ==/UserScript==

(function () {
    if (window.fluid) 
    {
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Setup variables
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		var xmlhttp;
		var currentCount = 0;
		var url = 'https://www.google.com/voice/inbox/recent/';
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		//! INITIALIZE
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		var init = setInterval(Ajax, 5000);
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		//!  AJAX REQUEST
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		function Ajax()
		{
			xmlhttp = null;
			xmlhttp = new XMLHttpRequest();
		
			if (xmlhttp != null) {
				xmlhttp.onreadystatechange = state_Change;
				xmlhttp.open("GET",url,true);
				xmlhttp.send(null);
			} else {
				alert("Your browser does not support XMLHTTP.");
			}
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		//!  STATE CHANGE HANDLER
		/////////////////////////////////////////////////////////////////////////////////////////////////////////	
		function state_Change()
		{
			if (xmlhttp.readyState == 4) { 								// 4 = "loaded"
				if (xmlhttp.status == 200) {							// 200 = OK
					
					//save ajax response
					var json = xmlhttp.responseText;
					
					//parse response string as XML
					var xmlobject = (new DOMParser()).parseFromString(json, "text/xml");
					
					//look for only JSON data within XML
					var messages = xmlobject.getElementsByTagName('json')[0];
					
					//eval it and turn it into a JSON object
					var msgObj = eval( '(' + messages.firstChild.nodeValue + ')' );
					
					//parse JSON object for SMS notification
					currentCount = getByAjaxSMS(msgObj);
					
					//console.log(currentCount);
				} else {
					alert("Problem retrieving XML data");
				}
			}
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		//!  GET SMS via AJAX
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		function getByAjaxSMS(msgObj){
			//get unread SMS count
			var count = Number(msgObj['unreadCounts']['sms']);
			
			//determine message gramar
			if(count == 1){
				var postfix = '';
			} else {
				var postfix = 's';
			}
		   	
		   	//format message
		   	var msg = count+' new SMS message'+postfix;
		
			//only push out if we've received a NEW message
			if(count>currentCount)
			{	
				//send to Prowl
				fluid.showGrowlNotification({
					title: "Google Voice",
					description: msg,
					priority: 3,
						sticky: false
				});
			}
			//console.log(count +" " + currentCount);
			return count;
		}
		
    }
})();
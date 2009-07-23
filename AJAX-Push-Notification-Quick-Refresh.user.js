// ==UserScript==
// @name        AJAX Push Notification Quick Refresh v2.0
// @namespace   http://fluidapp.com
// @description Uses XHR requests to increase refresh rate of GV's SMS Inbox when used to push notifications to Prowl
// @include     https://www.google.com/voice*
// @include     http://www.google.com/voice*
// @author      Tim Novinger {http://www.github.com/timnovinger}, Mike Krisher {http://www.github.com/mkrisher}
// ==/UserScript==

(function () {
    if (window.fluid) 
    {
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// !VARIABLES
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		var debug = false;
		var xmlhttp, json, xml;
		var count = 0;
		var actualCount = 0;
		var msg = '';
		var url = 'https://www.google.com/voice/inbox/recent/';
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// !INITIALIZE
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		var init = setInterval(get, 5000);
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		//  AJAX REQUEST
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		function get()
		{
			xmlhttp = null;
			xmlhttp = new XMLHttpRequest();
		
			if (xmlhttp != null) {
				xmlhttp.onreadystatechange = eventHandler;
				xmlhttp.open("GET",url,true);
				xmlhttp.send(null);
			} else {
				alert("Your browser does not support XMLHTTP.");
			}
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// PARSE XML FEED FOR JSON
		/////////////////////////////////////////////////////////////////////////////////////////////////////////	
		function eventHandler()
		{
			if (xmlhttp.readyState == 4) { 					// 4 = "loaded"
				if (xmlhttp.status == 200) {				// 200 = "OK"
					
					//save ajax response
					xml = xmlhttp.responseText;
					
					//parse json object
					json = parse(xml);
					
					//push SMS notification
					push(json);
					
					//!debug
					if(debug){ console.log(actualCount); }
				} else {
					alert("Problem retrieving XML data");
				}
			}
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// PARSE JSON OBJECT
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		function parse(xml)
		{
			//parse response string as XML
			var xmlobject = (new DOMParser()).parseFromString(xml, "text/xml");
			
			//look for only JSON data within XML
			var obj = xmlobject.getElementsByTagName('json')[0];
			
			//eval it and turn it into a JSON object
			return eval( '(' + obj.firstChild.nodeValue + ')' );
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// PUSH NOTIFICATION OUT
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		function push(json)
		{
			//get unread SMS count
			actualCount = Number(json['unreadCounts']['sms']);
			
			//determine message gramar
			var postfix = (count == 1) ? '' : 's';
		   	
		   	//format message
		   	msg = actualCount + ' new SMS message' + postfix;
		
			//only push out if we've received a NEW message
			if(actualCount > count)
			{	
				//send to Prowl
				fluid.showGrowlNotification({
					title: "Google Voice",
					description: msg,
					priority: 3,
					sticky: false
				});
			}
			
			//update counter
			count = actualCount;
			
			//!debug
			if(debug){ console.log(actualCount +" " + count); }
		}
    }
})();
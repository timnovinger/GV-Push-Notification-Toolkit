// ==UserScript==
// @name        Notifications
// @namespace   http://fluidapp.com
// @description Display a dock badge for Google Voice when using Fluid.
// @include     https://www.google.com/voice*
// @include     http://www.google.com/voice*
// @author		Ajax SMS Feature by Tim Novinger (tim.novinger AT gmail DOT com) http://www.timnovinger.com
// ==/UserScript==

if (!window.fluid) {
	return;
}

// Setup variables
var currentCount = 0;
var currentVMCount = 0;
var currentSMSCount = 0;
var currentAjaxSMSCount = 0;
var currentRecCount = 0;
var doAlerts = false;

var xmlhttp;
var url = 'https://www.google.com/voice/inbox/recent/';

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//! CALL MAIN FUNCTION
/////////////////////////////////////////////////////////////////////////////////////////////////////////
doBadgeUpdates(5000);
var runAjax = setInterval(Ajax, 5000);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  AJAX
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
			currentAjaxSMSCount = getByAjaxSMS(msgObj);
			//console.log(currentAjaxSMSCount);
		} else {
			alert("Problem retrieving XML data");
		}
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  BADGE UPDATES
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function doBadgeUpdates(timeout) 
{
	// Total number of items (Voicemail+SMS+Recorded)
	// Remember to typecast these as numbers
	currentCount = Number(getNotificationTotal());
	currentVMCount = Number(getVoicemailTotal());
	currentSMSCount = Number(getSMSTotal());

	// Notify if we have a new Recorded message
	if((currentVMCount + currentSMSCount)!=currentCount){
		if((currentCount-(currentVMCount + currentSMSCount))>currentRecCount) {
			currentRecCount = currentCount-(currentVMCount + currentSMSCount);
			doGrowlAlert('rec',currentRecCount);
		}
	}

	if(currentCount&&currentCount!=0) {
		window.fluid.dockBadge = currentCount;
		if(!doAlerts){
			//doGrowlAlert('base',currentCount);
		}
	}else{
		window.fluid.dockBadge = "";
	}

	// Wait 5 seconds before doing it again, then repeat infinitely
	setTimeout(doBadgeUpdates, timeout);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  GROWL ALERT
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function doGrowlAlert(type,count) 
{
	var title;
	var msg;

	// doAlerts is set when we have a call for 'base'
	if(type=='base'){
		doAlerts = true;
	}
	var item = Number(count);
	if(item==1){
		var postfix = '';
	}else{
		var postfix = 's';
	}

	if(doAlerts){
		switch(type) {
			case 'vm':
				msg = count+' new voicemail'+postfix;
			break;
			case 'sms':
				msg = count+' new SMS message'+postfix;
			break;
			case 'rec':
				msg = count+' new call recording'+postfix;
			break;
			case 'base':
				msg = count+' new Inbox item'+postfix;
			break;
		}
		// Show Growl Alert
		fluid.showGrowlNotification({
			title: "Google Voice",
			description: msg,
			priority: 3,
 			sticky: false
		});
		// Play Sound
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  GET VOICEMAIL
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getVoicemailTotal()
{
	var sidebar = document.getElementById(':b').innerHTML;
	// Split it so that we only have the number parts just to make sure theres no other number here
	var number = sidebar.split('>Voicemail')[1];
	// Get the number from the 
	var count = number.match(/(\d+)/g);
	
	if(count>currentVMCount){
		doGrowlAlert('vm',count);
	}
	
	return count;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  GET SMS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getSMSTotal(){
	var sidebar = document.getElementById(':c').innerHTML;
	// Split it so that we only have the number parts just to make sure theres no other number here
	var number = sidebar.split('>SMS')[1];
	// Get the number from the 
	var count = number.match(/(\d+)/g);
	
	if(count>currentSMSCount){
		doGrowlAlert('sms',count);
	}
	
	return count;
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
	if(count>currentAjaxSMSCount)
	{	
		//send to Prowl
		fluid.showGrowlNotification({
			title: "Google Voice",
			description: msg,
			priority: 3,
				sticky: false
		});
	}
	//console.log(count +" " + currentAjaxSMSCount);
	return count;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//!  GET INBOX COUNT
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getNotificationTotal() {
	// Get the HTML from the Inbox element on the sidebar
	var sidebar = document.getElementById(':5').innerHTML;
	// Split it so that we only have the number parts just to make sure theres no other number here
	var number = sidebar.split('>Inbox')[1];
	// Get the number from the 
	var count = number.match(/(\d+)/g);

	return count;
}
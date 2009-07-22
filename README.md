#Google Voice Toolkit

##INSTALL GROWL
- Using the included installer

##INSTALL FLUID.APP
- Using the included installer

##INSTALL PROWL
- On your iPhone/iPod Touch    http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=320876271&mt=8 
- On your Computer using the included Prowl.growlView 
	- This can also be installed on a SERVER if you have one. In this setup, notifications are always available to be pushed to you.

##CREATE GOOGLE VOICE APPLICATION
- Name the new Fluid application "Google Voice"
- Use Google-Voice-256.png as the icon for it
- Set the URL as: http://www.google.com/voice
- Make SURE that the allowed browsing URLs are ONLY the following, or it will attempt to open links inside of your default browser instead of within your new Fluid application. (asterisks ARE necessary)
	- *google.com/voice*
	- *google.com*/accounts/ServiceLogin*

##SETUP SMS GROWL NOTIFICATIONS
- Copy GV-Growl-Notifications.user.js to 			~/Library/Application Support/Fluid/SSB/Google Voice/Userscripts
- Copy AJAX-Push-Notification-Quick-Refresh.user 	~/Library/Application Support/Fluid/SSB/Google Voice/Userscripts

##SETUP PROWL NOTIFICATIONS
- Go into the Google Voice application in the Growl applications list
- Select Prowl for your Javascript Notification
- Make sure the Prowl plugin for Growl is setup with their Push Notification server (register, enter your credentials in, send a test message)
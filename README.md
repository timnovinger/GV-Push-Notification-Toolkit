#Google Voice Toolkit

##INSTALL GROWL
- Included

##INSTALL FLUID.APP
- Included

##INSTALL PROWL
- On your iPhone/iPod Touch    http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=320876271&mt=8 
- On your Computer using the included Prowl.growlView 
	- This can also be a SERVER if you have one so that these notifications are always available.

##CREATE GOOGLE VOICE APPLICATION
- Name application Google Voice
- Use Google-Voice-256.png as the icon
- URL is http://www.google.com/voice
- Make SURE that allowed browsing URLs are ONLY the following or it will try to open links up inside Safari instead (asterisks ARE necessary)
	- *google.com/voice*
	- *google.com*/accounts/ServiceLogin*

##SETUP SMS GROWL NOTIFICATIONS
- copy 50521.user.js (don't change the filename) in ~/Library/Application Support/Fluid/SSB/Google Voice/Userscripts

##SETUP PROWL NOTIFICATIONS
- Go into the Google Voice application in the applications list
- Select Prowl for your Javascript Notification
- Make sure the Prowl plugin for Growl is setup with their Push Notification server (register, enter your credentials in, send a test message)
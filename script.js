//===========================================================================
// volume.js
// Steampunk Volume Xwidget  1.0.0
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//
// The way this widget is coded might seem a little strange
// It was coded this way to ensure the code was 90% the same as the yahoo
// widget of the same name and also so that it functioned the same way in most
// respects.
//
// This file consists of four scripts bundled together - I would separate them
// but there is no include statement in Xwidgets.
//
//===========================================================================
var sliderSetClicked,mdx,mdy;
var sliderMouseWheelClicked = false;
var wheelX = 10;
var ctrlPressed = 0;
var size = 1,
         maxLength = 100,
         minLength = 10,
         ticks = 18
         var Scale = 1;

var oldVol = systemvolume.volume;
var oldMute = systemvolume.mute;
var perc=0;

var windowPos = 0;

var buzzer = "buzzer.wav";
var zzzz = "zzzz.wav";
var tingingSound = "ting.wav";
var currIcon = "speaker.png";
var lock = "lock.wav";

var originalCableWidth = cable.width;
var debugFlg = 1;

// wscript required to enable F5
var wsc=new ActiveXObject("WScript.Shell");

//===========================================
// this function runs on startup
//===========================================
function widgetOnLoad() {
    widget.MagneticBorders = 0;
    //widget.WindowZPosition = 0;   //normal

    getPrefs();                       // set the preferences - required by Xwidget as it has no native prefs
    createLicence();
    mainScreen();                     // check the widget is on-screen
    resize();                         // resize if required
    volumeDevice.visible = true;
    lockWidget();
    startVolume();                    // check the start volume levels
    setmenu();                        // build the menu
    settooltip();                     // build the tooltips
    //buildVitality(currIcon, perc);    // build the dock vitality   - Xwidget can't do this
    forcePositionButtonOnMouseDown();
}
//=====================
//End function
//=====================



//===========================================
// this function sets the widget position to normal
//===========================================
function forcePositionButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencesForceNormalPosition.text === "enabled")
  {
      forcePositionButton.src="buttonpushed.png";
      widget.WindowZPosition=2; //top
  }
}
//=====================
//End function
//=====================



//===========================================
// Function to slide the volume slider
//===========================================
function sliderSetOnMouseMove(Sender,Shift,X,Y,Dx,Dy)
{
  var rightmost,
        leftmost,
        sliderwidth,
        currpos;
  if(sliderSetClicked)
  {
    Sender.left = Sender.left + X - mdx;
    //determine slider travel limits
    rightmost = bar.left + bar.width - (100 ); // limit
    leftmost = bar.left + (25 ); //  limit
    if (sliderSet.left >= rightmost) {
        sliderSet.left = rightmost;
    }
    if (sliderSet.left <= leftmost) {
        sliderSet.left = leftmost;
    }
    stretchCable();

    //calculate the percentage
    sliderwidth = rightmost - leftmost;
    currpos = sliderSet.left - leftmost;
    perc = parseInt((currpos / sliderwidth) * 100);
    if (perc < 0) {
        perc = 0;
    }
    //log ("system.volume in % = " + perc);
    //this is where the sound should play asynchronously but it does not work in Xwidgets
    systemvolume.volume = perc;
    oldVol = systemvolume.volume;       // this stops the checkTimer from kicking off
    //text1.data = perc + "%";     //achieved automatically by binding the text control to the volumecore
    //log ("system.volume = " + system.volume);
  }
}
//=====================
//End function
//=====================

//===========================================
// Function to determine what happens when the mouse is pressed on the size slider
//===========================================
function sliderSetOnMouseDown(Sender,Button,Shift,X,Y)
{
   //checkTimer.enabled = false;
   sliderSetClicked = true;
   mdx = X;
   mdy = Y;
   sliderSet.hint.enabled = false;   // the hint gets in the way on the Xwidget
}
//=====================
//End function
//=====================



//===========================================
// Function to determine what happens when the mouse is lifted from the size slider
//===========================================
function sliderSetOnMouseUp(Sender,Button,Shift,X,Y)
{
    if (sliderSetClicked === true) {
        sliderSetClicked = false;
        if (preferencesHintsPrefValue.text === "enabled") {
           sliderSet.Hint.enabled = true;
        } else {
           sliderSet.Hint.enabled = false;
        }
    }
    if (preferencessoundprefvalue.text === "enabled") {
              print("Playing the sound");
              PlaySound(zzzz);
    }
    //log("Running function sizeSliderMouseUp clicked is now "+ clicked);
}
//=====================
//End function
//=====================


//=========================================================
// Function to determine the system sound levels at startup
//=========================================================
function startVolume() {
        //log("running start volume");
	if ( systemvolume.mute == true )
	{
             indicatorRed.src = "indicatorfalse.png";
        }else{
             indicatorRed.src = "indicatortrue.png"
	}
	sliderSet.left = (bar.left + 25  + (systemvolume.volume )) ;
        perc = systemvolume.volume;
        stretchCable();
}
//=====================
//End function
//=====================



//======================================================================
// Function to check the volume level set by other tools, run by a timer
// this timer is a little slow as Xwidgets does not allow a timer less than 1 second in duration
//======================================================================
function checkTimerOnUpdate(Sender) {

 if (oldVol != systemvolume.volume) {

	sliderSet.left = (bar.left + 25  + (systemvolume.volume )) ;
        stretchCable();
	oldVol = systemvolume.volume;
        //buildVitality(currIcon, parseInt(systemvolume.volume *6.25));    // build the dock vitality
 }
}
//=====================
//End function
//=====================



//=========================================================
// Function to stretch the cable
//=========================================================
 function stretchCable()
{
    var scaleamount,
    cableWidth;

    //now calculate the stretch of the cable
    cable.left = sliderSet.left + sliderSet.width - 2 ;
    cableWidth = (cableWheelSet.left + cableWheelSet.width) - (cable.left);

    // Xwidgets do not handle width in the same way as YWE so cannot be used for resizing
    // we use the Xwidgets scaleto function instead
    // now actually stretch or scale the cable
    scaleamount = cableWidth / originalCableWidth;
    cable.scaleto(scaleamount,1,0.0000000001,"");        //resizing function
    cable.left = sliderSet.left + sliderSet.width - 2 ;  //must be here after the scaleto
}
//=====================
//End function
//=====================


//=================================================================
// Function - when the mouse is released when over the volumeDevice or the sliderSet
//=================================================================
function sliderSetOnMouseWheelUp(Sender)
{
 if (ctrlPressed === 1) {
     backgroundOnMouseWheelUp(Sender);  // resize
 } else {
        sliderMouseWheelClicked = true;
        //print ("Wheel up Sender.left " + Sender.left);
        if ( preferencesMouseWheelPrefValue.text == "right" ) {
               sliderSet.left = sliderSet.left + wheelX;
        } else {
               sliderSet.left = sliderSet.left - wheelX;
        }

        limitSliderSet();
 }
}
//=====================
//End function
//=====================


//================================================================
// Function - when the mouse is pressed when over the volumeDevice or the sliderSet
//================================================================
function sliderSetOnMouseWheelDown(Sender)
{
 if (ctrlPressed === 1) {
     backgroundOnMouseWheelDown(Sender);  // resize
 } else {        //print ("Wheel down Sender.left " + Sender.left);
        sliderMouseWheelClicked = true;
        if ( preferencesMouseWheelPrefValue.text == "right" ) {
               sliderSet.left = sliderSet.left - wheelX;
        } else {
               sliderSet.left = sliderSet.left + wheelX;
        }

        limitSliderSet();
  }
}
//=====================
//End function
//=====================



//===========================================
// Function to slide the volume slider
//===========================================
function limitSliderSet()
{
  var rightmost,
        leftmost,
        sliderwidth,
        currpos;


    //determine slider travel limits
    //print("sliderMouseWheelClicked Clicked " + sliderMouseWheelClicked);
    rightmost = bar.left + bar.width - (100 ); // limit
    leftmost = bar.left + (25 ); //  limit
    if (sliderSet.left >= rightmost) {
        sliderSet.left = rightmost;
    }
    if (sliderSet.left <= leftmost) {
        sliderSet.left = leftmost;
    }
    stretchCable();

    //calculate the percentage
    sliderwidth = rightmost - leftmost;
    currpos = sliderSet.left - leftmost;
    perc = parseInt((currpos / sliderwidth) * 100);
    if (perc < 0) {
        perc = 0;
    }
    //log ("system.volume in % = " + perc);
    //this is where the sound should play asynchronously but it does not work in Xwidgets
    systemvolume.volume = perc;
    oldVol = systemvolume.volume;       // this stops the checkTimer from kicking off
    //text1.data = perc + "%";     //achieved automatically by binding the text control to the volumecore
    //log ("system.volume = " + system.volume);

  if (preferencessoundprefvalue.text === "enabled") {
              PlaySound(zzzz);
  }
  sliderMouseWheelClicked = false;

}
//=====================
//End function
//=====================



//==============================
// pins the widget in place
//==============================
function lockAreaOnMouseDown(Sender,Button,Shift,X,Y)
{
	if (!widget.lockposition) {
               //print("ere 1.");
		widget.lockposition = true;
		lockAreaFree.visible = false;
		lockAreaLocked.visible = true;

	} else {
                //print("ere 2.");
                widget.lockposition = false;
		lockAreaFree.visible = true;
		lockAreaLocked.visible = false;

        }

	if (preferencessoundprefvalue.text === "enabled") {
		PlaySound(lock);
	}
};


//==============================
// pins the widget in place
//==============================
function lockWidget()
{
	if (widget.lockposition) {
               //print("ere 1.");
		lockAreaFree.visible = false;
		lockAreaLocked.visible = true;

	} else {
                //print("ere 2.");
		lockAreaFree.visible = true;
		lockAreaLocked.visible = false;

        }

	if (preferencessoundprefvalue.text === "enabled") {
		PlaySound(lock);
	}
};



//======================================================================================
// END script volume.js
//======================================================================================


//===========================================================================
// functions.js
// Steampunk Volume Xwidget  1.0.0
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//===========================================================================

//======================================================================================
// Function to move the main_window onto the main screen
//======================================================================================
function mainScreen() {
    // if the widget is off screen then move into the viewable window
    if ( preferencesForceNormalPosition.text !="enabled" ) {
                  // dean // widget.WindowZPosition=0; //Normal
    }
    if ( preferenceshoffsetprefvalue.text !="" ) {
              widget.left= preferenceshoffsetprefvalue.text;
    }
    if (preferencesvoffsetprefvalue.text !="" ) {
              widget.top=preferencesvoffsetprefvalue.text;
    }
    if (widget.left < 0) {
        widget.left = 10;
    }
    if (widget.top < 0) {
        widget.top = 10;
    }
}
//=====================
//End function
//=====================

//==============================================================
// function to resize all images using the volumeDevice single layer
//==============================================================
function resize() {
    var Scale = Number(preferencessizePrefvalue.percent+30) / 100;
    volumeDevice.scaleto(Scale,Scale,0.0000000001,"topleft");
}
//=====================
//End function
//=====================

//=========================================================================
// this function assigns translations to preference descriptions and titles
//=========================================================================
function setmenu() {
   //nothing here as this can't be done in javascript with Xwidgets
}
//=====================
//End function
//=====================


//===========================================
// this function opens the online help file
//===========================================
function menuitem1OnClick(Sender)
{
          if (confirm2("This button opens a browser window and connects to the help page for this widget. Will you proceed?"))
          {
              OpenURL("");
          }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function menuitem2OnClick(Sender)
{
          if (confirm2("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Ko-Fi donate page for this widget). Will you be kind and proceed?"))
          {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
			if (preferencessoundprefvalue.text === "enabled") {
				//PlaySound(winding);
			}
          }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function menuitem3OnClick(Sender)
{
          if (confirm2("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?"))
          {
               openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
          }
}
//=====================
//End function
//=====================

//=========================================================================
// this function opens the rocketdock URL
//=========================================================================
function menuitem4OnClick(Sender)
{
          if (confirm2("Log in and vote for the widget on Rocketdock. This button opens a browser window and connects to the Rocketdock page where you can give the widget a 5 star rating... Will you be kind and proceed?"))
          {
			openURL("http://rocketdock.com/addon/icons/46779");
			if (preferencessoundprefvalue.text === "enabled") {
				//PlaySound(winding);
			}
          }
}
//=====================
//End function
//=====================
//===========================================
// this function opens other widgets URL
//===========================================
function menuitem5OnClick(Sender)
{
          if (confirm2("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed?"))
          {
                 openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981273/xwidgets");
          }
}
//=====================
//End function
//=====================
//===========================================
// this function opens the download URL
//===========================================
function menuitem6OnClick(Sender)
{
          if (confirm2("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?"))
          {
              openURL("https://www.deviantart.com/yereverluvinuncleber/art/XWIDGET-Version-1-0-0-Dieselpunk-Volume-XWidget-761692195");
          }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function menuitem7OnClick(Sender)
{
          if (confirm2("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?"))
          {
              openURL("https://www.facebook.com/profile.php?id=100012278951649");
          }
}
//=====================
//End function
//=====================



 //==============================================================
// this function reloads the widget when preferences are changed
//==============================================================
function settooltip() {
    if ( preferenceswidgetTooltipvalue.text != "" )
    {
        if (preferencesHintsPrefValue.text === "enabled") {
           pipes.hint = preferenceswidgetTooltipvalue.text;
           speaker.hint = preferenceswidgetTooltipvalue.text;
        } else {
           pipes.Hint.enabled = false;
           speaker.Hint.enabled = false;
        }

    } else {
        //not all of these hints are enabled on the Xwidget version as the tooltip is annoying
        if ( preferencesimageCmdPrefvalue.text == "" ) {
           if (preferencesHintsPrefValue.text === "enabled") {
            cableWheelSet.hint = "Double click on me to assign a double-click function to this widget";
            cable.hint = "Double click on me to assign a double-click function to this widget";
            pipes.hint = "Double click on me to assign a double-click function to this widget";
            bell.hint = "Double click on me to assign a double-click function to this widget";
            indicatorRed.hint = "Double click on me to assign a double-click function to this widget";
            speaker.hint = "Double click on me to assign a double-click function to this widget";
            bar.hint = "Double click on me to assign a double-click function to this widget";
           } else {
            cableWheelSet.Hint.enabled = false;
            cable.Hint.enabled = false;
            pipes.Hint.enabled = false;
            bell.Hint.enabled = false;
            indicatorRed.Hint.enabled = false;
            speaker.Hint.enabled = false;
            bar.Hint.enabled = false;
           }
         } else {
           if (preferencesHintsPrefValue.text === "enabled") {
            cableWheelSet.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            cable.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            pipes.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            bell.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            indicatorRed.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            speaker.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            bar.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
           } else {
            cableWheelSet.Hint.enabled = false;
            cable.Hint.enabled = false;
            pipes.Hint.enabled = false;
            bell.Hint.enabled = false;
            indicatorRed.Hint.enabled = false;
            speaker.Hint.enabled = false;
            bar.Hint.enabled = false;
           }
       }
    }
}
//=====================
//End function
//=====================


//======================================================================================
// Function to perform commands
//======================================================================================
function performCommand() {
    if ( preferencesimageCmdPrefvalue.text == "" )
    {
        if (confirm2("This widget has not been assigned a double-click function yet - You need to open the preferences and set a function for this widget. Do you wish to proceed?"))
        {
             showWidgetPreferences.visible = true;
        }
    } else {
        if (preferencessoundprefvalue.text === "enabled") {
                PlaySound(tingingSound);
        }
        run(preferencesimageCmdPrefvalue.text);
    }
}
//=====================
//End function
//=====================


//======================================================================================
// END script functions.js
//======================================================================================









//===========================================================================
// vitality.js
// Steampunk Volume Xwidget  1.0.0
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//===========================================================================

//=========================================================================
// this function builds vitality for the dock
//=========================================================================
function buildVitality(bg, perc)
{

}
//=====================
//End function
//=====================



//======================================================================================
// END script vitality.js
//======================================================================================
















//===========================================================================
// kon.js  - this the file that corresponds roughly to the YWE .kon file
// Steampunk Volume Xwidget  1.0.0
// Written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
//===========================================================================



//=========================================================================
// this function simply buzzes when
//=========================================================================
function button1OnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencessoundprefvalue.text === "enabled" ) {
      PlaySound(buzzer);    //this won't sound when the mute is set
  }
      preferencesLicenceHideValue.text = "1";
      Licence.visible = false;
      SavePrefs();
}
//=====================
//End function
//=====================

//==================================================
// this function calls the user-specified command on a double click on the speaker
//==================================================
function speakerOnDblClick(Sender)
{
  performCommand();
}
//=====================
//End function
//=====================

//==================================================
// this function calls the user-specified command on a double click on the pipes
//==================================================
function pipesOnDblClick(Sender)
{
  performCommand();
}
//=====================
//End function
//=====================

//==================================================
// this function calls the user-specified command on a double click on the slider bar
//==================================================
function barOnDblClick(Sender)
{
  performCommand();
}
//=====================
//End function
//=====================


//=========================================================================
// this function
//=========================================================================
function button1OnClick(Sender)
{
  button1OnMouseDown.click;
}
//=====================
//End function
//=====================

//=========================================================================
// this function shows the preferences when the first menu option is chosen
//=========================================================================
function menuitem8OnClick(Sender)
{
         windowPos = widget.WindowZPosition;
         showWidgetPreferences.top =  volumeDevice.top + 50;
         showWidgetPreferences.visible = true;
         // dean // widget.WindowZPosition=0;
}
//=====================
//End function
//=====================

//=========================================================================
// this function saves the preferences to an ini file for later use
//=========================================================================
function saveButtonOnClick(Sender)
{
         showWidgetPreferences.visible = false;
         //print("preferencessizePrefvalue.percent "+ preferencessizePrefvalue.percent);
         SavePrefs();
         // dean // widget.WindowZPosition=windowPos;
         widgetOnLoad();
}
//=====================
//End function
//=====================


//=========================================================================
// this function saves the preferences to an ini file for later use
//=========================================================================
function SavePrefs()
{
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceshoffsetprefvalue",preferenceshoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesvoffsetprefvalue",preferencesvoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencessoundprefvalue",preferencessoundprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetTooltipvalue",preferenceswidgetTooltipvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesimageCmdPrefvalue",preferencesimageCmdPrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencessizePrefvalue",preferencessizePrefvalue.percent);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesLicenceHideValue",preferencesLicenceHideValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesMouseWheelPrefValue",preferencesMouseWheelPrefValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","prefsHideTimeValue",prefsHideTime.text);

}
//=====================
//End function
//=====================


//=========================================================================
// this function sets the preference values to the defaults for this widget
//=========================================================================
function defaultbuttonOnClick(Sender)
{
         preferenceshoffsetprefvalue.text= "100";
         preferencesvoffsetprefvalue.text= "350";
         preferenceswidgetTooltipvalue.text= "Double-Click on me to set the widget command";
         preferencesimageCmdPrefvalue.text= "control mmsys.cpl sounds";
         preferencessizePrefvalue.percent= 100;
         preferencessoundprefvalue.text="enabled";
}
//=====================
//End function
//=====================



//=========================================================================
// this function sets the preference values to saved values
//=========================================================================
function getPrefs(){
    var  timerInt = 0;
    var prefsHideTimeValue = 0;
    
    preferenceshoffsetprefvalue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferenceshoffsetprefvalue","350");
    preferencesvoffsetprefvalue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencesvoffsetprefvalue","350");
    preferencessoundprefvalue.text =       Getinivalue(widgetpath+"prefs.ini","prefs","preferencessoundprefvalue","enabled");
    preferenceswidgetTooltipvalue.text =   Getinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetTooltipvalue","arseburgers");
    preferencesimageCmdPrefvalue.text =    Getinivalue(widgetpath+"prefs.ini","prefs","preferencesimageCmdPrefvalue","arseburgers");
    preferencessizePrefvalue.percent =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencessizePrefvalue",100);
    preferencesLicenceHideValue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencesLicenceHideValue",0);
    preferencesMouseWheelPrefValue.text =  Getinivalue(widgetpath+"prefs.ini","prefs","preferencesMouseWheelPrefValue","right");
    prefsHideTime.text                  =  Getinivalue(widgetpath+"prefs.ini","prefs","prefsHideTimeValue","10");

    prefsHideTimeValue= parseInt(prefsHideTime.text);
    
    timerInt = prefsHideTimeValue * 1000  ;
    hideTimer.setinterval = timerInt ;
    
    if (preferencessoundprefvalue.text === "enabled") {
        soundbutton.src="buttonpushed.png";         // this in place of a checkbutton which I could not get to work correctly
    } else {
        soundbutton.src="button.png";
    }
}
//=====================
//End function
//=====================



//=========================================================================
// this function links the URL on the top of the preferences page
//=========================================================================
function linkOnClick(Sender)
{
          if (confirm2("Visiting the widgets page - this button opens a browser window and connects to our widgets page where you can view the other widgets. Proceed?"))
          {
                   openURL("https://yereverluvinuncleber.deviantart.com");
          }
}
//=====================
//End function
//=====================

//=========================================================================
// this function states the slider size in percentage in the little box on the prefs page
//=========================================================================
function preferencessizePrefvalueOnChange(Sender)
{
     var  adjustedVal =      preferencessizePrefvalue.percent + 30;
     preferencessizePrefvalue.hint =     "The widget size will be "  + adjustedVal + "%";
     widgetSize.text =     adjustedVal +"%";
}
//=====================
//End function
//=====================

//=========================================================================
// this function stops the slider from following the mouse all the time
// and it acts as a flag to allow the checktimer to restart again.
//=========================================================================
function sliderSetOnMouseLeave(Sender)
{
  //sliderSetClicked=false;
}
//=====================
//End function
//=====================

//=========================================================================
// this function mutes or unmutes if the bell is pressed
//=========================================================================
function bellOnMouseUp(Sender,Button,Shift,X,Y)
{
  if (systemvolume.mute == false)
  {
      systemvolume.mute = true;
      indicatorRed.src="indicatorfalse.png";
  }
  else
  {
      systemvolume.mute = false;
      indicatorRed.src="indicatortrue.png"
  }
  oldMute = systemvolume.mute;        // this stops the checkTimer from kicking off
}
//=====================
//End function
//=====================

//=========================================================================
// this function replicates the function of a checkbox because Xwidget checkbox
// logic did not always work.
//=========================================================================
function soundbuttonOnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencessoundprefvalue.text === "enabled")
  {
      preferencessoundprefvalue.text = "disabled";
      soundbutton.src="button.png";
  }
  else
  {
      preferencessoundprefvalue.text = "enabled";
      soundbutton.src="buttonpushed.png";
  }
  PlaySound(buzzer);    //no test required - this won't sound when the mute is set
}
//=====================
//End function
//=====================



//======================================================================================
// END script kon.js
//======================================================================================






//=========================================================================
// this function closes the preferences
//=========================================================================
function button2OnClick()
{
         showWidgetPreferences.visible = false;
         // dean // widget.WindowZPosition=windowPos;
}
//=====================
//End function
//=====================








//=========================================================================
// this function reloads the widget - but it doesn't...
//=========================================================================
function menuitem13OnClick(Sender)
{
         widget.ForceToFround();
         wsc.SendKeys("{f5}");
}

//=========================================================================
// this function opens the about us image
//=========================================================================
function menuitem9OnClick() {
         //print("here!");
         windowPos = widget.WindowZPosition;
         about.visible = true;
         // dean // widget.WindowZPosition=0;
}
//=====================
//End function
//=====================


//=========================================================================
// this function closes the about us image
//=========================================================================
function aboutUsImageOnClick() {
         // dean // widget.WindowZPosition=windowPos;
         about.visible = false;
}
//=====================
//End function
//=====================







function speakerOnEnterFocus(Sender)
{

}


function menuitem14OnClick(Sender)
{
    Licence.Visible = true;
}

function button4OnMouseDown(Sender,Button,Shift,X,Y)
{
        preferencesLicenceHideValue.text = "0";
        SavePrefs();
        widget.close
}

function createLicence() {
	if (preferencesLicenceHideValue.text === "0") {
		Licence.visible = true;
	} else {
		Licence.visible   = false;
	}
}


function button5OnMouseDown(Sender,Button,Shift,X,Y)
{
        if (preferencesMouseWheelPrefValue.text === "right" ) {
               preferencesMouseWheelPrefValue.text = "left" ;
        } else {
               preferencesMouseWheelPrefValue.text = "right"  ;
        }
}


function rokeyOnMouseDown(Sender,Button,Shift,X,Y)
{
    PlaySound(buzzer);
}


//===========================================
// this function captures the mouse wheel down event and resizes the clock
//===========================================
function backgroundOnMouseWheelUp(Sender,Key,KeyChar,Shift)
{
 if (ctrlPressed === 1) {
         Scale = Number(preferencessizePrefvalue.percent);
         size = Scale;
         step = Math.round((maxLength - minLength) / (ticks - 1));
	        if ( preferencesMouseWheelPrefValue.text == "up" ) {
                   size += step;
	           if (size > maxLength) {
	              size = maxLength;
	           }
                } else {
                   size -= step;
                   if (size < minLength) {
	               size = minLength;
                   }
                 }

     Scale = size;
     preferencessizePrefvalue.percent = Scale ;
     resize();
  }
}
//=====================
//End function
//=====================

//===========================================
// this function captures the mouse wheel down event and resizes the clock
//===========================================
function backgroundOnMouseWheelDown(Sender,Key,KeyChar,Shift)
{
 if (ctrlPressed === 1) {
         Scale = Number(preferencessizePrefvalue.percent);
         size = Scale;
         step = Math.round((maxLength - minLength) / (ticks - 1));
	        if ( preferencesMouseWheelPrefValue.text == "up" ) {
                   size -= step;
                   if (size < minLength) {
	               size = minLength;
                   }
                } else {
                   size += step;
	           if (size > maxLength) {
	              size = maxLength;
	           }
                }

     //if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(thhhh);};
     Scale = size;
     preferencessizePrefvalue.percent = Scale ;
     resize();
 }

}
//=====================
//End function
//=====================


function helpLugOnMouseDown(Sender,Button,Shift,X,Y)
{
  	 windowPos = widget.WindowZPosition;
         helpImage.visible = true;
         // dean // widget.WindowZPosition=1;
         if (preferencessoundprefvalue.text === "enabled") {
		PlaySound(lock);
	 }
}



function helpImageOnClick(Sender)
{
         // dean // widget.WindowZPosition=windowPos;
         helpImage.visible = false;
         if (preferencessoundprefvalue.text === "enabled") {
                PlaySound(tingingSound);
         }
                  // dean // widget.WindowZPosition=0;
}


//===================================
// this function opens the download URL
//===========================================
function menuitem15OnClick(Sender)
{
          if (confirm2("Visiting the Facebook chat page - this button opens a browser window and connects to our Facebook page. Proceed?"))
          {
              openURL("https://www.facebook.com/profile.php?id=100012278951649");
          }
}
//=====================
//End function
//=====================

//===========================================
// this function sets the widget position to normal
//===========================================
function togglePositionButtonOnMouseDown(Sender,Button,Shift,X,Y)
{

  if (preferencesForceNormalPosition.text === "enabled")
  {
      preferencesForceNormalPosition.text = "disabled";
      forcePositionButton.src="button.png";
      widget.WindowZPosition=0; //Normal
  }
  else
  {
      preferencesForceNormalPosition.text = "enabled";
      forcePositionButton.src="buttonpushed.png";
      widget.WindowZPosition=2; //Top
  }
  PlaySound(buzzer);    //no test required - this won't sound when the mute is set
}
//=====================
//End function
//=====================




function sliderSetOnMouseEnter(Sender)
{
  //important - leave this empty function here as it deals with a bug in the Xwidget engine where mousenetr events occur
}


function lockAreaFreeOnMouseEnter(Sender)
{
     lockAreaFree.src="lockAreaHover.png";
}


function lockAreaFreeOnMouseLeave(Sender)
{
  lockAreaFree.src="lockAreaFree.png";
}

function helpLugOnMouseEnter(Sender)
{
  helpLug.src="helpLugHover.png";
}

function helpLugOnMouseLeave(Sender)
{
  helpLug.src="helpLug.png";
}



// getkeypress
//===========================================
// Function that...
//===========================================
function keytimerOnUpdate(Sender)
{
                if (isKeyDown(17)) {
                    // CTRL key
                    //dprint("%KON-I-INFO, pressing CTRL key ");
                    ctrlPressed = 1;
                } else {
                    ctrlPressed = 0;
                }

                if (isKeyDown(40)) {
                    // right volume up
                    if (debugFlg === 1) {print("%KON-I-INFO, pressing down key ");};
                    ctrlPressed = 0;
                    sliderSet.left = sliderSet.left - (10 );
                    limitSliderSet();
                }
                if (isKeyDown(38)) {
                    //left volume up
                    ctrlPressed = 0;
                    if (debugFlg === 1) {print("%KON-I-INFO, pressing up key ");};
                    sliderSet.left = sliderSet.left + (10 );
                    limitSliderSet();
                }

                if (isKeyDown(39)) {
                      //FWD track
                      if (debugFlg === 1) {print("%KON-I-INFO, pressing right key ");};
                      ctrlPressed = 0;
                      sliderSet.left = sliderSet.left  + 10 ;
                      limitSliderSet();
                }
                if (isKeyDown(37)) {
                      //RWD track
                      if (debugFlg === 1) {print("%KON-I-INFO, pressing left key ");};
                      ctrlPressed = 0;
                      sliderSet.left = sliderSet.left - 10 ;
                      limitSliderSet();
                }






}
//=====================
//End function
//=====================


//===========================================
// Function that...
//===========================================
function hideTimerOnUpdate(Sender)
{
         if (debugFlg === 1) {print("%KON-I-INFO, Running the hideTimer ");};
         volumeDevice.visible = true;
         hideTimer.enabled = false;
}
//=====================
//End function
//=====================



//===========================================
// Function that...
//===========================================
function widgetOnEnter()
{
      sliderSetClicked = false;
      keytimer.enabled=true;
}
//=====================
//End function
//=====================


//===========================================
// Function that...
//===========================================
function widgetOnLeave()
{
  keytimer.enabled=false;

}
//=====================
//End function
//=====================



    //widget.WindowZPosition = 0;   //normal
    //widget.WindowZPosition = 1;   //topmost
    //widget.WindowZPosition = 2;   //keep topmost
    //widget.WindowZPosition = -1;   //keep topmost



function speakerOnClick2()
{
        var objShell = new ActiveXObject("shell.application");
        var ssfWINDOWS = 36;
        var objFolder;

        objFolder = objShell.BrowseForFolder(0, "Example", 0, ssfWINDOWS);
        if (objFolder != null)
        {
            // Add code here.
        }


}


function tooltipButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
    if ( preferencesHintsPrefValue.text === "enabled" ) {
       preferencesHintsPrefValue.text = "disabled";
    } else {
       preferencesHintsPrefValue.text = "enabled";
    }
}




function keyFTimerOnUpdate(Sender)
{
                  if (isKeyDown(121)) {
                      //F10 key pressed
                      if (volumeDevice.visible == false) {
                        volumeDevice.visible = true;
                        if (debugFlg === 1) {print("%KON-I-INFO, pressing F10 key ");};
                      } else {
                        volumeDevice.visible = false;
                        if (debugFlg === 1) {print("%KON-I-INFO, pressing F10 key ");};
                      }
                      hideTimer.enabled = true;
                      ctrlPressed = 0;
                }
}


function mnuEditOnClick(Sender)
{
if (debugFlg === 1) {print("%KON-I-INFO, running the editor ");};
  //runEx("C:\Program Files\RJ TextEd\TextEd.exe");
  //run("C:\Program Files\RJ TextEd\TextEd.exe");
  //Open("C:\Program Files\RJ TextEd\TextEd.exe");
  Open2("C:\Program Files\RJ TextEd\TextEd.exe");
  
  //E:\dean\steampunk theme\Steampunk Media Player.rjproj
}


function findWidget(Sender)
{
         open(WidgetPath);
}

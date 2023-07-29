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

    if ( preferenceshoffsetprefvalue.text !="" ) {
              widget.left= preferenceshoffsetprefvalue.text;
    }
    if (preferencesvoffsetprefvalue.text > 0) {
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
    var Scale = Number(preferencessizePrefvalue.text) / 100;
    log("Resizing: preferences.maxWidthPref.value: " + preferencessizePrefvalue.text);
    log("Scale: " + Scale); 
    volumeDevice.scaleto(0.6,0.6,0.0000000001,"topleft");

}
//=====================
//End function
//=====================

//=========================================================================
// this function assigns translations to preference descriptions and titles
//=========================================================================
function setmenu() {

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
              OpenURL("http://lightquick.co.uk/instructions-for-the-steampunk-volume-widget.html?Itemid=264");
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
          if (confirm2("Help support the creation of more widgets like this, send us a beer! This button opens a browser window and connects to the Paypal donate page for this widget). Will you be kind and proceed?"))
          {
                openURL("http://lightquick.co.uk/donate-a-beer.html?Itemid=269");
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
// this function
//=========================================================================
function menuitem4OnClick(Sender)
{
          if (confirm2("Log in and vote for the widget on Rocketdock. This button opens a browser window and connects to the Rocketdock page where you can give the widget a 5 star rating... Will you be kind and proceed?"))
          {
                openURL("http://rocketdock.com/addon/misc/45672");
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
                 openURL("http://lightquick.co.uk/steampunk-widgets.html?Itemid=264");
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
              openURL("http://lightquick.co.uk/downloads/steampunk-volume-widget.html?Itemid=264");
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
              openURL("http://lightquick.co.uk/contact.html?Itemid=3");
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
        //cableWheelSet.hint = preferenceswidgetTooltipvalue.text;
        //cable.hint = preferenceswidgetTooltipvalue.text;
        pipes.hint = preferenceswidgetTooltipvalue.text;
        //bell.hint = preferenceswidgetTooltipvalue.text;
        //indicatorRed.hint = preferenceswidgetTooltipvalue.text;
        speaker.hint = preferenceswidgetTooltipvalue.text;
        //bar.hint = preferenceswidgetTooltipvalue.text;
    } else {
        //not all of these hints are enabled on the Xwidget version
        if ( preferencesimageCmdPrefvalue.text == "" ) {
            cableWheelSet.hint = "Double click on me to assign a double-click function to this widget";
            cable.hint = "Double click on me to assign a double-click function to this widget";
            pipes.hint = "Double click on me to assign a double-click function to this widget";
            bell.hint = "Double click on me to assign a double-click function to this widget";
            indicatorRed.hint = "Double click on me to assign a double-click function to this widget";
            speaker.hint = "Double click on me to assign a double-click function to this widget";
            bar.hint = "Double click on me to assign a double-click function to this widget";
        } else {
            cableWheelSet.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            cable.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            pipes.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            bell.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            indicatorRed.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            speaker.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
            bar.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
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
    print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
    if ( preferencesimageCmdPrefvalue.text == "" )
    {
        if (confirm2("This widget has not been assigned a double-click function yet - You need to open the preferences and set a function for this widget. Do you wish to proceed?"))
        {
             showWidgetPreferences.visible = true;
        }
    } else {
        if (preferencessoundprefvalue.text === "enable") {
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


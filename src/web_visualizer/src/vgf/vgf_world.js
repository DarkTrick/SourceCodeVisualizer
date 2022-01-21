require ("./vgf_widget.js");
require ("../utils/std.js");
require ("../vpw/vpw_button_movable_dockable.js");
require ("../utils/zindex_manager.js");
require ("./vgf_popup_window.js");



/**
 *
 *  VgfWorld is the anchor for all the other objects.
 * It does (currently) do not have size
 *
 *  This is also the end of many recursive calls from VgfWidget.
 **/

const VgfWorld = (function()
{
  let self = new VgfWidget ("div");



  self.constructor = function()
  {
    self.classList.add ("VgfWorld");

    self._vp_zIndexManager = new zIndexManager(self);
    // scale factor of this world
    self.vp_scale = 1.0;

    node_preventContextMenu (self);

    return self;
  }



  self._vp_screenCoordsToWorldCoords = function (screenX, screenY)
  {
    posX = screenX/self.vp_scale - self.getBoundingClientRect().left / self.vp_scale;
    posY = screenY/self.vp_scale - self.getBoundingClientRect().top / self.vp_scale;

    return {x: posX, y: posY};
  }



  // dedicated to popup management
  {
    self._vp_currentPopup = null;

    self.vp_stopPopup = function ()
    {
      if (null == self._vp_currentPopup)
        return;
      self._vp_currentPopup.style.display = "none";
      self._vp_currentPopup.vp_delete ();
      self._vp_currentPopup = null;
    }



    /**
     *  Parameters:
     *    screenPosX/Y screen coordinates (eg. as they arrive from
     *    mouse events). NOT relative coordinates to the world.
     **/
    self.vp_runPopup = function(vgfWidget, screenPosX, screenPosY)
    {
      self.vp_stopPopup ();

      if (!vgfWidget)
        return;

      // calculate position within self (remember self works as location anchor)
      let pos = self._vp_screenCoordsToWorldCoords (screenPosX, screenPosY);

      let popupwindow = new VgfPopupWindow(vgfWidget, pos.x, pos.y, self.vp_stopPopup);
      self.vp_addWindow (popupwindow);
      self._vp_currentPopup = popupwindow;
    }
  }



  self.vp_liftElementToTop = function (childElement)
  {
    // This is the easiest solution,
    //world.appendChild (self);
    //   but it will reset `click` events in Chromium-based
    //    browsers; So we handle it manually

    self._vp_zIndexManager.raiseElement (childElement);
  }



  self.vp_addWindow = function (vpwWindow)
  {
    // don't insert as top child. Otherwise focus does get messed up.
    //  because vp_focus exchanges focus from lastChild.
    self.insertBefore (vpwWindow, self.lastChild);
    // now make it the topmost window
    vpwWindow.vp_focus();
  }


  // override
  self.vp_getWorld = function(){
    return self;
  }


  // override
  self.vp_isWorld = function(){
    return true;
  }



  /**
   * Find first window at location x,y, except `exceptThisWindow`.
   * Return `self`, if no window or only `exceptThisWindow` was found.
   **/
  self.vp_getWindowAt = function(x, y, exceptThisWindow)
  {
    // find topmost window, that's below the mouse

    for (let i = self.children.length-1; i>=0; --i)
    {
      let child = self.children[i];
      if (child == exceptThisWindow) continue;

      let geom = child.getBoundingClientRect ();
      let right  = geom.left + geom.width;
      let bottom = geom.top  + geom.height;

      if (x > geom.left && x < right &&
          y > geom.top  && y < bottom)
      {
        return child;
      }
    }

    return self;
  }



  // @override
  self.vp_childSizeChanged = function(){
    // don't do anything here
  }



  self.constructor();
  return self;
});


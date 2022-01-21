
/**
 * Turns `vgf_widget` into a dockable widget, that will stay on the
 *   left side of it's parent
 **/
function vgf_make_dockable_leftSide (vgf_widget)
{
  let self = vgf_widget;
  let constructor = function()
  {
    self.vp_move_activator_object.addEventListener ("mouseup", self.vp_dock_fromEvent);
    self.addEventListener ("vp_windowBeforeStartMoving", self.vp_undock);

    // Remember y position, that was set after docking
    //  Background: Expanding/shrinking of parent, will change self's y position.
    //              With this variable, we can restore the original position.
    self._vp_yPositionAtDockingTime = 0;

    return self;
  }



  let onParentSizeChanged = function(event){
    let y = vgf_button_movable_dockable_getYWithinElement (self, event.target, self._vp_yPositionAtDockingTime);
    if ((self.offsetTop-y) <= 10 )
      moveAnimated (self, self.offsetLeftonParentSizeChanged, y, 400, vgf_window_setXY);
    else
      vgf_window_setXY (self, self.offsetLeft, y);
  }

  let adjustPosition_instant = function(event){
    let y = vgf_button_movable_dockable_getYWithinElement (self, event.target, self._vp_yPositionAtDockingTime);
    vgf_window_setXY (self, self.offsetLeft, y);
  }


  let onParentWindowMoved = function(event){
    let e = new Event ("vp_windowMoved");
    self.dispatchEvent (e);
  }



  let onParentWindowBeforeDelete = function(event){
    self.vp_delete();
  }



  // Event listeners on parent (iff `self` is `docked`)
  let parentWindowEventListeners = [
      ["vp_windowMoved", onParentWindowMoved],
      ["vp_windowResizedByUser", adjustPosition_instant],
      ["vp_sizeChanged", onParentSizeChanged],
      ["vp_beforeDelete", onParentWindowBeforeDelete],
    ];


  self.vp_undock = function()
  {
    // remove event listening
    self.vp_clearEventListenerForForeignObject()
  }



  self.vp_dock_fromEvent = function(event)
  {
    let world = self.vp_getWorld()
    let newParent = world.vp_getWindowAt (event.x,event.y,self);
    return self.vp_dock (newParent);
  }


  self.vp_dock = function(target)
  {
    let parent = target;
    vgf_widget_dock (self, parent);

    if (!parent.vp_isWorld())
    {
      parentWindowEventListeners.forEach (evListener => {
        self.vp_addEventListenerForForeignObject (new VpEventListener (parent, evListener[0], evListener[1]));
      });
      vgf_window_unfocus_visually (self);

      // adjust to left side outside of window
      let x = -self.offsetWidth;
      let y = vgf_button_movable_dockable_getYWithinElement (self, target);
      moveAnimated (self, x, y, 500, vgf_window_setXY);

      self._vp_yPositionAtDockingTime = y;
    }
  }



  constructor();
  return self;
}




/**
 *  Return a y value, that would place `self` vertically within `element`
 *
 *  If `preferablePosition_undefiendable` is set, try to get as close to it as possible
 **/
function vgf_button_movable_dockable_getYWithinElement (self, element, preferablePosition_undefiendable)
{
  if (preferablePosition_undefiendable)
    return Math.clamp (preferablePosition_undefiendable, 0, element.offsetHeight - self.offsetHeight);

  return Math.clamp (self.offsetTop, 0, element.offsetHeight - self.offsetHeight);
}
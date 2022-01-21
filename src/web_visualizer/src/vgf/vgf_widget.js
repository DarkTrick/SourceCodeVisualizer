
/**
 * Refactoring notice:
 *  DON'T TRY TO CHANGE THE STRUCTURE TO USING `class`.
 *  It WILL NOT WORK! You already tried 2 - 3 times!
 **/


/**
 * Object to store information that
 *  on object `object` on event `strEvent` function `func`
 *  should be called.
 *
 * param `object`: object with add/removeEventListener
 **/
class VpEventListener {
  constructor(object, strEvent, functionPointer){
    this.object = object;
    this.strEvent = strEvent;
    this.func = functionPointer;
  }
}



/**
 * param `type`: "div" or "button" ...
 **/
const VgfWidget = (function(type)
{
  if (!type)
    console.error("VgfWidget did not receive a type!");


  let self = null;
  if (type == "button")
    self = new Button();
  else
    self = document.createElement (type);

  return VgfWidget_createFrom(self);
});



/**
 * Turn `self` into a VgfWidget.
 * Through this function any DOM object can be
 *  transformed to a regular VgfWidget
 **/
function VgfWidget_createFrom(self)
{
  // Why is this method not static iside VgfWidget?
  //  Because I don't know how static works in const functions

  self.constructor = function()
  {
    // Indicator, that this object is not a simple
    //  javascript DOM object
    self.vp_isVpObject = true;

    self._vp_eventListenersForForeignObjects = [];
    self.addEventListener ("vp_beforeDelete", self.vp_clearEventListenerForForeignObject);

    return self;
  }

  self.vp_widget_add = function(widget){
    self.appendChild (widget);
  }

  self.vp_widget_remove = function(widget){
    self.removeChild (widget);
  }

  self.vp_children = function(){
    return self.children;
  }

  self.vp_children_removeAll = function(){
    while (self.lastChild) {
      self.removeChild(self.lastChild);
    }
  }

  /**
   *  Return: Next VgfWidget-parent (not pure dom objects)
   *          Or `null`, if there is none
   **/
  self.vp_getParent = function(){
    let parent = self.parentNode;
    while (!!parent && true != parent.vp_isVpObject) {
      parent = parent.parentNode;
    }

    return parent;
  }

  self.vp_getWorld = function(){
    return self.vp_getParent().vp_getWorld();
  }

  self.vp_isWorld = function(){
    return false;
  }

  /**
   * Get widget one before world
   **/
  self.vp_getToplevelWidget = function(){
    return self.vp_getParent().vp_getToplevelWidget();
  }



  self.vp_delete = function(){
    self._vp_delete_triggerEvents();
    self._vp_onDeletionRequested_overridable();
  }



  self._vp_delete_triggerEvents = function()
  {
    // inform oneself
    self.dispatchEvent(new Event("vp_beforeDelete"));

    // inform every child node
    Array.from(self.children).forEach(child => {
      if (child.vp_isVpObject)
      {
        child._vp_delete_triggerEvents();
      }
    });
  }


  /**
   * Override this function, if animation-like stuff
   *   should happen prior to deletion
   **/
  self._vp_onDeletionRequested_overridable = function()
  {
    // run remove after event handling:
    setTimeout(function(){ self.remove(); },0);
  }

  /**
   * Register events on other objects, that get de-registered
   *  automatically upon `vp_beforeRemove` of this object.
   **/
  self.vp_addEventListenerForForeignObject = function(vpEventListener)
  {
    let listener = vpEventListener;
    self._vp_eventListenersForForeignObjects.push (listener);
    listener.object.addEventListener (listener.strEvent, listener.func);
  }


  self.vp_removeEventListenerForForeignObject = function(object, strEvent)
  {
    let listeners = self._vp_eventListenersForForeignObjects
    for (let i = 0; i < listeners; ++i)
    {
      if (listeners[i].object   == object &&
          listeners[i].strEvent == strEvent)
      {
        self._vp_eventListenersForForeignObjects = splice (i,1);
      }
    }
  }



  self.vp_clearEventListenerForForeignObject = function()
  {
    self._vp_eventListenersForForeignObjects.forEach( el => {
      el.object.removeEventListener (el.strEvent, el.func);
    });
  }




  self.vp_childSizeChanged = function()
  {
    let p = self.vp_getParent ()
    if (p) p.vp_childSizeChanged ();
  }



  return self.constructor();
}


/**
 *  Function will make `vpwWidget` an `aboslute`ly
 *   `position`ed child of target
 *
 *  Return: object vpwWidget was docket at.
 **/

function vgf_widget_dock(vpwWidget, target)
{
  // add it to this window
  {
    target.appendChild (vpwWidget);

    // position window accordingly
    if (!target.vp_isWorld())
    {
      // TODO: Improve, so we don't need
      //        this if-construct

      let x_start = vpwWidget.offsetLeft - target.offsetLeft;
      let y_start = vpwWidget.offsetTop - target.offsetTop;
      vpwWidget.vp_setXY (x_start, y_start);
      return target;
    }
  }
  return target;
}

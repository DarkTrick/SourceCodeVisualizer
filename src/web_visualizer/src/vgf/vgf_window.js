require ("./vgf_widget.js");
require ("./vgf_toplevelwidget.js");

/**
 * So far: the smallest entity, that would represent the
 *          abstraction of a "Window".
 **/
const VgfWindow = (function()
{
  let self = new VgfWidget ("div");
  self = VgfToplevelWidget_createFrom (self);


  self.constructor = function()
  {
    self.c = 0;
    self.addEventListener ("mousedown", self.vp_focus);
    self.classList.add("VgfWindow");
    self._vp_initResizeEvent();

    return self;
  }



  self._vp_initResizeEvent = function(){
    self.resizeObserver = new ResizeObserver (e => {
      self.dispatchEvent (new Event ("vp_windowResizedByUser"));
    });
    self.resizeObserver.observe (self);
  }



  self.vp_focus = function()
  {
    let world = self.vp_getWorld ()

    let cssFocussed = "VgfWindow_focussed";

    // unfocus previous
    //vgf_window_unfocus_visually (world.lastChild); // not working anymore, because we use zIndex for focussing
    let focussedElements = Array.from (document.getElementsByClassName (cssFocussed));
    focussedElements.forEach ( elem => {elem.classList.remove (cssFocussed);});

    //focus new window visually
    self.classList.add (cssFocussed)
    world.vp_liftElementToTop (self);
  }


  /**
   * Can be used to move object back to world after
   *  being part of a compound object
   **/
  self.vp_reappendOnWorld = function()
  {
    let newParent = self.vp_getWorld();

    if (self.parentNode != newParent)
    {
      // adjust position
      let geom = getOffset (self);
      let geomParent = getOffset (newParent);

      self.vp_setXY_noDisclosure(geom.left - geomParent.left,
                                 geom.top - geomParent.top);
    }

    newParent.appendChild (self);
  }



  self.vp_liftToWorldTop = function()
  {
    let world = self.vp_getWorld();

    world.vp_liftElementToTop(self);
  }



  self.vp_setXY_noDisclosure = function(x,y)
  {
    // set position
    self.style.left   = x + "px";
    self.style.top    = y + "px";
  }



  self.vp_setXY = function(x,y)
  {
    self.vp_setXY_noDisclosure(x,y);
    self.dispatchEvent (new Event ("vp_windowMoved"));
  }



  self.vp_startMoving_fromEvent = function(event)
  {
    event.stopPropagation();
    self.vp_startMoving (event.x, event.y);
  }



  self.vp_startMoving = function(startX, startY)
  {
    self.dispatchEvent (new Event ("vp_windowBeforeStartMoving"));
    // timeout is to first process event triggers from above
    setTimeout (function(){
        self.vp_moved_by_mouse = false;
        self.vp_focus ();
        _Mover.moving_start (startX,startY,self, self.vp_getWorld().vp_scale);
      },0);
  }

  // @override
  self.vp_childSizeChanged = function()
  {
    self.dispatchEvent (new Event ("vp_sizeChanged"));
    self.dispatchEvent (new Event ("vp_windowMoved"));

    // For now don't bubble the call further up
    //  and see if the system works.
  }


  self.constructor();
  return self;
});



class _Mover {

  // for moving/resizing
  // TODO:nice2have: maybe array-ize it to allow multitouch
  static currentlyManipulatedWindow = null;
  static manipulateStartX = -1;
  static manipulateStartY = -1;
  static scale = 1.0

  // --------------------------------------------------------------------------

  static moving_followMouse(event){
    var x = event.x/_Mover.scale - _Mover.manipulateStartX;
    var y = event.y/_Mover.scale - _Mover.manipulateStartY;
    let win = _Mover.currentlyManipulatedWindow;
    win.vp_setXY (x, y);

    // set indicator, that this window was moved
    win.vp_moved_by_mouse = true;

    //win.dispatchEvent (new Event ("vp_windowMoved"));
  }


  // --------------------------------------------------------------------------

  static moving_start(startX, startY, draggingObject, scale=1.0)
  {
    _Mover.manipulateStartX = startX/scale - draggingObject.offsetLeft;
    _Mover.manipulateStartY = startY/scale - draggingObject.offsetTop;
    _Mover.currentlyManipulatedWindow = draggingObject;
    _Mover.scale = scale;

    // add dragging shadow (looks awefull)
    /*if (_Mover.currentlyManipulatedWindow){
      _Mover.currentlyManipulatedWindow.classList.add ("VgfWidget_dragging");
      _Mover.currentlyManipulatedWindow.classList.remove ("VgfWindow_focussed");
    }*/

    document.addEventListener("mousemove", _Mover.moving_followMouse);
    document.addEventListener("mouseup", _Mover.moving_stop);
  }

  //-----------------------------------------------------------------------------

  static moving_stop(){
    // remove dragging shadow (looks awefull)
    /*if (_Mover.currentlyManipulatedWindow){
      _Mover.currentlyManipulatedWindow.classList.remove ("VgfWidget_dragging");
      _Mover.currentlyManipulatedWindow.classList.add ("VgfWindow_focussed");
    }*/

    document.removeEventListener("mousemove", _Mover.moving_followMouse);
    _Mover.currentlyManipulatedWindow = null;
  }

  // ----------------------------------------------------------------------------

}

/**
 * Visually unfocusses a VgfWindow.
 **/
function vgf_window_unfocus_visually(vpwWindow)
{
  if (vpwWindow == null) return;
  vpwWindow.classList.remove ("VgfWindow_focussed");
}



function vgf_window_setXY(self, x, y)
{
  return self.vp_setXY (x,y);
}
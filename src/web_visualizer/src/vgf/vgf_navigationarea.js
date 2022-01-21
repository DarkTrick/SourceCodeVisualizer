require ("./vgf_widget.js");

/**
 *  A `NavigationArea` is like an extended
 *    `ScrollArea` in QT or GTK:
 *      - It enables moving around `world`
 *
 *
 *    VgfNavigationArea
 *         |
 *         ├- interactionArea
 *         |
 *         |     knows and moves
 *         |       ↓         ↓
 *         |       ↓         ↓
 *         └- scalingArea    ↓
 *                     └- world
 *
 **/
const VgfNavigationArea = (function(world)
{
  let self = new VgfWidget ("div");

  self.constructor = function()
  {
    self.classList.add ("VgfNavigationArea");

    // interaction area implements triggers to control `world`
    self._vp_interactionArea = self._vp_createInteractionArea();

    self.appendChild (self._vp_interactionArea);
    self.appendChild (world);

    setup_mouse_dragElement (self._vp_interactionArea, world);
    _setup_mouseWheelScrolling (self, world);
    _setup_scaleViewpoint (self, world);
  }


  self._vp_createScalingArea = function()
  {
    let scalingArea = new VgfWidget ("div");
    let s = scalingArea.style;
    s.position = "absolute";
    s.top = "50%";
    s.left = "50%";
    s.border = "4px limegreen solid";
    return scalingArea;
  }


  self._vp_createInteractionArea = function()
  {
    let interactionArea = new VgfWidget ("div");
    interactionArea.classList.add ("VgfInteractionArea");
    return interactionArea;
  }


  self.constructor();
  return self;
});


function _setup_mouseWheelScrolling(interactionArea,
                                    scrolledObject)
{
  interactionArea.addEventListener ("wheel", e =>
  {
    // vertical scrolling
    if (!e.altKey  && !e.ctrlKey &&
        !e.metaKey && !e.shiftKey)
    {
      scrolledObject.style.top  = scrolledObject.offsetTop - (e.deltaY) + "px";
    }

    // horizontal scrolling
    if (!e.altKey  && !e.ctrlKey &&
        !e.metaKey &&  e.shiftKey)
    {
      scrolledObject.style.left = scrolledObject.offsetLeft - (e.deltaY) + "px";
    }
  });
}


/**
 * Setup scaling / zooming functionality
 *
 * Be aware, that you need to keep track of scale value, if you move
 *  something on screen according to mouse
 *
 * Param world: scale value will be stored here
 * Param scalingObject: scaling will be performed here
 **/
function _setup_scaleViewpoint(interactionArea, scalingObject)
{
  // store scale level on the object
  if (!scalingObject.vp_scale)
    console.debug ("PROGRAMMER WARNING: You tried to make an object scalable, that does not officially own a `vp_scale` property. However, you will need that property for correct translations of getBoundingClientRect()-coordinates. You should consider 'officially' adding the property (= adding it in object definition)");

  interactionArea.addEventListener ("wheel", e => {zoom (e, scalingObject);});

}


function zoom (mouseevent, scalingObject)
{
  var _scaleObject = function(obj, amount)
  {
    obj.vp_scale += amount;
    node_scale (obj, obj.vp_scale);
  }

  let e = mouseevent;

  if ((!e.altKey  &&  e.ctrlKey && !e.metaKey && !e.shiftKey)
   || ( e.altKey  && !e.ctrlKey && !e.metaKey && !e.shiftKey))
  {
    // NOTE: This zooming doesn't work perfectly, but it's acceptable.

    let mouseX = e.x;
    let mouseY = e.y;

    // get old values
    let rect_old = scalingObject.getBoundingClientRect ();
    let obj_centerX_old = (rect_old.left + (rect_old.width/2));
    let obj_centerY_old = (rect_old.top  + (rect_old.height/2));

    let diffX_old = (mouseX) - obj_centerX_old;
    let diffY_old = (mouseY) - obj_centerY_old;


    // do scaling
    let scaleAmount = -(e.deltaY/1000);
    _scaleObject (scalingObject, scaleAmount);


    // get new values
    let rect_new = scalingObject.getBoundingClientRect ();
    let diffX_new = diffX_old * (1+scaleAmount);
    let diffY_new = diffY_old * (1+scaleAmount);


    // move scalingObject so that mouse location
    //  seemingly didn't change
    let diffX = diffX_new - diffX_old;
    let diffY = diffY_new - diffY_old;

    scalingObject.style.left = (rect_new.left - diffX) + "px";
    scalingObject.style.top  = (rect_new.top  - diffY) + "px";

  }
}
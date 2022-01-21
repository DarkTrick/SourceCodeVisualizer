require ("../vgf/vgf_widget.js");
require ("../vgf/vgf_line.js");
require ("./vpw_button_movable_dockable.js");


/**
 * Object, that will create a visual connection
 *  between a source and a target
 *
 *                               Child of
 * Source                Button ----------->  Target
 *       ________________
 *       line from source
 *          to button
 *
 * Constraints:
 *    `domSource` and `domTarget` must already be inside
 *     the active DOM.
 **/
const VpwEntityConnection = (function (domSource, domTarget)
{
  let self = new VpwButtonMovableDockable ();
  self.constructor = function()
  {
    self._vp_domSource = domSource;

    self._vp_line = new _VpwEntityConnectionSpecialLine (domSource, self);
    self.vp_widget_add (self._vp_line);


    // dock to target
    {
      self._vp_initPosition ();
      self.vp_dock (domTarget);
    }

    self._initEventListeners ();

    // Source is `Connectable`? =>  add connection
    //  or don't connect, if it's just a simple DOM object
    if (isObject (Connectable.getInterface (domSource))){
      Connectable.getInterface (domSource).addConnection (self);
    }


    return self;
  }



  self._initEventListeners = function()
  {
    let listener_source = self._vp_domSource.vp_getToplevelWidget();

    let reg = self.vp_addEventListenerForForeignObject;
    reg (new VpEventListener(listener_source, "vp_beforeDelete", self.vp_delete));

    self.addEventListener ("mousedown", self.vp_update);
    self.addEventListener ("vp_beforeDelete", self._vp_removeSelfFromSource);
  }



  self._vp_initPosition = function()
  {
    // setup
      let source = self._vp_domSource;
      let world = source.vp_getWorld();

      let geom_source = getOffset (source);
      let geom_world  = getOffset (world);

    // run

      // add to world
      world.vp_widget_add (self);

      self.vp_setXY (-geom_world.left + geom_source.left,
                     -geom_world.top + geom_source.top);
  }



  self._vp_removeSelfFromSource = function(){
    Connectable.getInterface (self._vp_domSource). remove (self);
  }



  self.constructor();
  return self;
});




/**
 *  A VgfLine, that is tailored the the needs
 *   of a VpwEntityConnection
 **/
const _VpwEntityConnectionSpecialLine = (function (domSource, domTarget)
{
  let self = new VgfLine ();

  self.constructor = function()
  {
    // setup vars
    self.source_relX = -7;
    self.source_relY = -11;
    self.self_relX = 0;
    //self.self_relY = 0;//unused

    self._vp_source = domSource;
    self._vp_target = domTarget;

    self.vp_setColor ("rgb(221, 176, 27)");

    self._initEventListeners (domTarget, domSource);

    return self;
  }



  self._initEventListeners = function(domTarget, domSource)
  {
    let listener_target = domTarget;
    let listener_source = domSource.vp_getToplevelWidget();

    let reg = self.vp_addEventListenerForForeignObject;
    reg (new VpEventListener (listener_target, "vp_windowMoved",   self.vp_update));
    reg (new VpEventListener (listener_source, "vp_windowMoved",   self.vp_update));
    reg (new VpEventListener (listener_source, "vp_windowResizedByUser", self.vp_update));
  }



  self._vp_getLineStartPos = function()
  {
    /**
     * TODO: actually we
     *  - have to take into account, that the window might
     *    be so small, that it hides the sourc
     *  - have to take into account, that the small window
     *    is scrolled in a way, so that it's actually shown again.
     *
     * Info:
     * self._vp_target = movable button
     **/

    // we need the scale factor here, because getBoundingClientRect
    //  wouldn't take scaling into account
    let scale = self.vp_getWorld ().vp_scale;

    let src = self._vp_getVisibleSource();

    //let source_offset = getOffset (src);
    //let target_offset = getOffset (self._vp_target);
    let source_offset = src.getBoundingClientRect ();
    let target_offset = self._vp_target.getBoundingClientRect ();

    let x = (source_offset.left - target_offset.left) / scale  + src.offsetWidth;
    let y = (source_offset.top - target_offset.top) / scale;

    y -= self._vp_target.offsetHeight;

    // move the line to about the middle of the circle
    if (src == self._vp_source){
      x -= 1;
      y += src.offsetHeight/5*1;
    }



    // do not let the line's source coordinates "escape" the toplevel window
    if (src == self._vp_source)
    {
      let toplevel = self._vp_source.vp_getToplevelWidget ();
      let toplevel_offset = toplevel.getBoundingClientRect ();

      let toplevel_right    = (toplevel_offset.left - target_offset.left)/scale + toplevel.offsetWidth;
      let toplevel_top      = (toplevel_offset.top  - target_offset.top) /scale - self._vp_target.offsetHeight;
      let toplevel_bottom   = toplevel_top + toplevel.offsetHeight - 4;

      if (x > toplevel_right)
        x = toplevel_right;

      if (y > toplevel_bottom)
        y = toplevel_bottom;

    }

    return [x,y];
  }



  self._vp_getVisibleSource = function()
  {
    // source could be hidden; in that case,
    //  use it's parent... and so on
    let src = self._vp_source;
    while( !isVisible(src))
      src = src.parentNode;
    return src;
  }



  self.vp_update = function()
  {
    // we need the scale factor here, because getBoundingClientRect
    //  wouldn't take scaling into account
    let scale = self.vp_getWorld ().vp_scale;

    // from source
    let p1 = self._vp_getLineStartPos();

    // to itself
    let x2 = -self.self_relX;
    let y2 = -self._vp_target.getBoundingClientRect().height/scale;

    self.vp_setStart (p1[0],p1[1]);
    self.vp_setEnd (x2, y2);
  }



  self.constructor();
  return self;
});


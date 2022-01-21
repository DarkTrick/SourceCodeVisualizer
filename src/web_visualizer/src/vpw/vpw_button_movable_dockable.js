require ("../vgf/vgf_widget.js");
require ("../vgf/vgf_dockable.js");require ("../vgf/vgf_dockable.js");
require ("./vpw_button_movable.js");


/**
 * Button, that can be freely moved, but
 * also docked to other windows
 *
 * It will also throw vp_windowMoved events,
 *   if the parent window was moved.
 *
 **/

const VpwButtonMovableDockable = (function ()
{
  let self = new VpwButtonMovable();
  vgf_make_dockable_leftSide (self);
  return self;
});
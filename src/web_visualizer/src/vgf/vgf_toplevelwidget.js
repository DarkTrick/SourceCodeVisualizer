require ("./vgf_widget.js");

const VgfToplevelWidget = (function()
{
  let self = new VgfWidget ("div");

  self = VgfToplevelWidget_createFrom (self);

  return self;
});



/**
 * Turn any widget into a toplevel widget
 */
function VgfToplevelWidget_createFrom(widget)
{
  let self = widget

  // @override
  self.vp_getToplevelWidget = function(){
    return self;
  }

  return self;
}
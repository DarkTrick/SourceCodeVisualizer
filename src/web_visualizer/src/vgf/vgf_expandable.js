require ("./vgf_widget.js");

/**
 *  Base class for expandable widgets
 *
 *  Known implementations:
 *   - VgfExpandableWithTitle
 **/
const VgfExpandable = (function()
{
  let self = new VgfWidget("div");
  self.classList.add ("VgfExpandable");

  self.constructor = function(){
    self.vp_content = document.createElement ("div");
    self.vp_content.classList.add ("VgfExpandableContent");
  }



  self.vp_appendContent = function(element)
  {
    self.vp_content.appendChild (element);
  }


  // overridable
  self.vp_expand = function(){}



  self.constructor();
  return self;
});
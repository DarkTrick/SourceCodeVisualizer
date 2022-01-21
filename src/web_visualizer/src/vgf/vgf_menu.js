require ("../utils/std.js");
require ("./vgf_window.js");


/**
 * An area that provides a list of items, that
 * can be activated by clicking. The list will
 * disappear if an item has been activated.
 *
 **/

const VgfMenu = (function ()
{
  let self = new VgfWidget ("div");


  self._ctor = function()
  {
    self.classList.add ("VgfMenu");
  };



  self.vp_addEntry = function(name, callback)
  {
    let entry = createElement (self, "div");
    entry.innerText = name;
    entry.classList.add ("VgfMenuEntry");
    entry.addEventListener ("click", e =>
    {
      // first hide menu, to prevent it being visible
      //  due to asyncronous deletion
      self.style.display = "none";
      self.vp_delete ();
      setTimeout (callback, 0);
    });
  }

  self.vp_addSeparator = function()
  {
    let entry = createElement (self, "div");
    entry.innerText = " ";
    entry.classList.add ("VgfMenuSeparator");
  }



  self._ctor ();
  return self;
});
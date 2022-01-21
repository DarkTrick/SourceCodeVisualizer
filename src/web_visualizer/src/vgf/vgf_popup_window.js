require ("./vgf_window.js");

const VgfPopupWindow = (function (vgfWidget_content, posX, posY, stopPopupCallback)
{


  let self = new VgfWindow ();
  let _constructor = function()
  {
    self.classList.add ("VgfPopupWindow");

    self.appendChild (vgfWidget_content);
    self.vp_setXY_noDisclosure (posX, posY);


    let mouseHandlerOptions = {capture: true, passive: true};
    let mousedownHandler = function (event) {

      let rect = self.getBoundingClientRect ();
      if (isPointInsideRect (event, rect)) {
        return;
      }

      // TODO: THIS MUST NOT BE `body`! we need a structural
      //       change, where the world expands 100%x100%
      //       and it only CONTAINS the scaling and moving
      //       anchor, that is now implemented in the world
      document.body.removeEventListener ("mousedown", mousedownHandler, mouseHandlerOptions);
      stopPopupCallback ();
    }

    // remove popup, if user clicked anywhere else
    // TODO: THIS MUST NOT BE `body`! we need a structural
    //       change, where the world expands 100%x100%
    //       and it only CONTAINS the scaling and moving
    //       anchor, that is now implemented in the world
    document.body.addEventListener ("mousedown", mousedownHandler,
      mouseHandlerOptions);


    // remove popup window, if it's content vanished
    vgfWidget_content.addEventListener ("vp_beforeDelete", e =>
    {
      stopPopupCallback ();
    },{passive: true, once: true});
  }


  _constructor ();
  return self;
});
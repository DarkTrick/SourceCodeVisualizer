require ("../vgf/vgf_window.js");
require ("../vgf/button.js");


const VpwButtonMovable = (function()
{
  let self = new VgfWindow ();


  self.constructor = function()
  {
    self.classList.add ("VpwButtonMovable");

    let btn = new Button();
    btn.classList.add ("VpwButtonMovableBtn");

    // for start moving, the button click is key - not click on `self`
    self.vp_move_activator_object = btn;


    let span = document.createElement ("span");
    span.innerText = "=";
    btn.appendChild (span);
    self.appendChild (btn);


    btn.addEventListener ("mousedown", self.vp_reappendOnWorld);
    btn.addEventListener ("mousedown", self.vp_startMoving_fromEvent);
    btn.addEventListener ("mouseup", e =>
                                  {
                                    if (!self.vp_moved_by_mouse)
                                      self.vp_delete ();
                                  });


    return self;
  }



  return self.constructor();
});


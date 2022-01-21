
/**
 * What is self?
 *   A VpwOutlineWindow can be understood as a Window
 *    with a ViewEntity
 *
 * Runs Window.New() and enhances the resulting object:
 *  - adds member `viewEntity`
 *   - fill title      (of window)
 *  - fill clientarea (of window)
 *  - function vp_setXY()
 *
 *   - Set style and position according to viewEntity
 *
 **/
const VpwViewEntityWindow = (function(viewEntity)
{
  let self = new VgfWindowTitled ();

  /**
   *  @brief: Creates a new viewEntityRepresentation with
   *             .vp_title
   *             .vp_window_clientarea
   **/
  let _constructor = function() {
    self.classList.add ("VpwViewEntityWindow");
    self.viewEntity = viewEntity;

    // set position
    self.vp_setXY(viewEntity.x, viewEntity.y);

    // set roll-up status
    if (viewEntity.rolledUp == true)
      Window.btnRollup_onClick(self);

    return self;
  }

  _constructor ();
  return self;
});

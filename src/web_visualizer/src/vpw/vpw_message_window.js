require ("vpw_view_entity_window.js");


const VpwMessageWindow = (function(viewEntity_message)
{
  let self = new VpwViewEntityWindow (viewEntity_message);

  let _constructor = function()
  {
    let msgData = viewEntity_message.vp_model;

    self.vp_title.innerText = msgData.title;
    self.vp_window_clientarea.innerHTML = msgData.message;

    // --- styling ---
    self.classList.add ("VpwMessageWindow");
    self.classList.add (msgData.type.replace(" ", "_"));

    return self;
  }

  _constructor ();
  return self;
});
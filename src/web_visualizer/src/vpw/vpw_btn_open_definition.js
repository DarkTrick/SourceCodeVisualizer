require ("./connectable.js");
require ("../vgf/vgf_widget.js");
require ("./vpw_entity_connection.js");

/**
 * @param parentWindow: should be a VpwOutlineWindow
 * @param parent: could be any surrounding grouping element (like the head of a dropdown list).
 *                 could also be equal to parentWindow.
 **/
const BtnOpenDefinition = ( function(outlineEntity,
                                     parentWindow, parentGroup=parentWindow)
{
  let self = new VgfWidget ("button");
  self._CAPTION_TOOGLE_OFF = "🠖";
  //self._CAPTION_TOOGLE_OFF = "⮞";
  //self._CAPTION_TOOGLE_ON = "・";
  self._CAPTION_TOOGLE_ON = "";

  // --------------------------------------------------------------

  self.constructor = function()
  {
    self.classList.add ("btnOpenDefinition");
    self.vp_getParentGroup = parentGroup;
    self.vp_getParentWindow = parentWindow;
    self.title = "Open defintion";

    // Needed because vscode webview places the arrow
    //  strangely in the bottom. Therefore browser preview
    //  looks ugly now.
    // If you remove this, change _vp_caption_refresh() as well
    {
      let c = document.createElement("span")
      c.style.fontFamily = "emoji  ";
      c.style.position = "relative";
      c.style.top = "-3.5px";
      self.appendChild (c);
    }

    Connectable.makeConnectable (self);

    self._vp_caption_refresh();

    return self;
  };

  // --------------------------------------------------------------

  // onClick
  self.addEventListener ("click", function(e) {
    self._vp_toggle (outlineEntity);
    e.stopPropagation ();
  });

  // onParentWindowClose
  parentWindow.addEventListener ("vp_beforeDelete", function(e){
    self._vp_onDestroy ();
  });

  self.addEventListener ("connection_created", function(e){
    self._vp_caption_refresh();
  });

  self.addEventListener ("connection_removed", function(e){
    self._vp_caption_refresh();
  });

  // --------------------------------------------------------------

  self._vp_onDestroy = function(){
    self._vp_removeConnections ();
  };

  // --------------------------------------------------------------

  self._vp_caption_refresh = function(){
    // We need to put a styled span inside the button, to
    //  be able to move it's content up a little.
    // Reason: vscode renders arrow strangely in the bottom

    /*
    if (Connectable.getInterface (self).hasConnections ()){
      self.innerText = self._CAPTION_TOOGLE_ON;
    } else {
      self.innerText = self._CAPTION_TOOGLE_OFF;
    }
    //*/
    ///*
    if (Connectable.getInterface (self).hasConnections ()){
      self.firstChild.innerText = self._CAPTION_TOOGLE_ON;

      self.classList.add ("VpwBtnOpenDefinition_ON");
    } else {
      self.firstChild.innerText = self._CAPTION_TOOGLE_OFF;
      self.classList.remove ("VpwBtnOpenDefinition_ON");
    }
    //*/
  }

  // --------------------------------------------------------------

  self._vp_toggle = function(outlineEntity)
  {
    // request an outline?
    if (!Connectable.getInterface (self).hasConnections ())
    {
      let uri = self.vp_getParentWindow.viewEntity.vp_model.uri
      self.vp_getWorld ().vp_outline_openEntity (uri, outlineEntity, self);
      return true;
    }
    else
    {
      // OR: remove all lines
      self._vp_removeConnections ();
    }

    return false;
  };

  // --------------------------------------------------------------

  self._vp_removeConnections = function()
  {
    for (let connLine of Connectable.getInterface (self).getConnections ())
    {
      connLine.vp_delete();
      Connectable.getInterface (self).remove (connLine);
    }
  }

  // --------------------------------------------------------------

  self.constructor ();

  // testing:
  //self.classList.add ("VpwBtnOpenDefinition_ON");

  return self;
});

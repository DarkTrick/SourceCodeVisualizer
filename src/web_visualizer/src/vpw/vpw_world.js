require ("./vpw_outline_window.js");
require ("./vpw_message_window.js");
require ("../vgf/vgf_widget.js");
require ("../vgf/vgf_world.js");
require ("./vpw_button_movable_dockable.js");
require ("./vpw_entity_connection.js");


/**
 *  Extension for `VgfWorld`.
 *  Mainly to provide visualizing options for
 *   outline entities
 **/

const VpwWorld = (function()
{
  let self = new VgfWorld ();

  // ---------------------------------------------------

  self.constructor = function()
  {

    return self;
  }


  // ---------------------------------------------------

  /**
   *  @brief: Create an interactive message box window on screen
   **/
  self.visualizeMessageBox = function(viewEntity_message){
    let outlineWindow = new VpwMessageWindow (viewEntity_message);
    self.vp_widget_add (outlineWindow);
    return outlineWindow;
  }

  // ---------------------------------------------------

  /**
   *  @brief: Create an interactive window containing code outline on screen
   **/
  self.visualizeOutline = function(viewEntity){
    let outlineWindow = VpwOutlineWindow (viewEntity);

    self.vp_addWindow (outlineWindow);

    return outlineWindow;
  }


  // ---------------------------------------------------

  /**
   * @return: succcess: ConnectionLine object
   *          no success: null
   **/
  self.connection_createIfNotExisting = function(dom_source_nullable, dom_target_nullable)
  {
    let conn = null;
    // connection already there?
    // (self would be obsolete, if we had a consistent model)
    {
      // TODO:refactor:reimplement
      //conn = self.domConnectionMgr.getConnectionBetween (dom_source_nullable, dom_target_nullable)
      if (null != conn)
        return conn;
    }

    // create connection line
    conn = self._connection_create (dom_source_nullable, dom_target_nullable);

    return conn;
  }

  // ---------------------------------------------------

  /**
   * @return: succcess: ConnectionLine object
   *          no success: null
   **/
  self._connection_create = function(source_nullable, target_nullable)
  {
    let connLine = null;
    if (!target_nullable || !source_nullable)
      return null;

    let source = source_nullable;
    let target = target_nullable;

    connLine = new VpwEntityConnection (source, target);

    return connLine;
  }



  /**
   *   @return: viewEntityRepresentation object corresponding to
   *             `viewEntity`
   *            OR `null`, if there is none
   *
   **/
  self.window_getFromOutlineEntity = function(outlineEntity){
    // setup
    let collection = self.vp_children();

    // run
    for (let i = 0; i < collection.length; ++i){
      let vpwWidget = collection[i];
      if (vpwWidget.vp_isCodeOutline)
      if (OutlineEntityFunctions.equals (vpwWidget.viewEntity.vp_model, outlineEntity))
        return vpwWidget;
    }

    return null;
  }


  self.vp_outline_openLocationDefiner = function(outlineEntity, requestee_nullable)
  {
    gController.outline_requestLocationDefiner (outlineEntity, requestee_nullable);
  }



  self.vp_host_openRawSource = function(outlineEntity, requestee_nullable)
  {
    gController.host_openRawSource (outlineEntity, requestee_nullable);
  }



  self.vp_outline_openSymbolAt = function (uri, selectionStart, selectionEnd, requestee_nullable)
  {
    gController.outline_requestByFilePosition (uri, selectionStart, selectionEnd, requestee_nullable);
  }



  self.vp_outline_openEntity = function(uri, outlineEntity, requestee)
  {
    return gController.outline_request (uri, outlineEntity, requestee);
  }



  self.constructor();
  return self;
});



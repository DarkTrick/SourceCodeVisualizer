require ("../vpw/vpw_world.js");
require ("../vgf/vgf_navigationarea.js");
require ("window_positioner.js");
require ("view_entity.js");
require ("request_message.js");
require ("outline_object_functions.js");


class RequestInformation
{
  static CALLEE = "callee";
  static CALLER = "caller";

  requestee = null;
  // CALLEE => visualize a call; I.e. put the new
  //           outline to the right of the requestee
  // CALLER => visualize a caller; I.e. put the new
  //           outline to the left of the requestee
  //requestDirection = RequestInformation.CALLEE;
  requestDirection = RequestInformation.CALLEE;
}


class Controller
{
  // -------------------------------------------------------

  /**
   *  Param systemDomRoot: DOM node that is used as root node for
   *                       the whole system
   **/
  constructor(systemDomRoot)
  {

    this._vp_world = new VpwWorld();
    let navigationArea = new VgfNavigationArea (this._vp_world);
    systemDomRoot.appendChild (navigationArea);


    // List of requested outlines. This way we know
    //  where to place an incomming outline
    // Index is the ID
    // Containing object is a VpwOutlineWindow
    this._request_awaitingRequests = {};
    // used for creating unique IDs for requesting outlines
    // ONLY USE VIA ACCESS FUNCTION!
    this._nextRequestId = 0;

    let self = this;
    window.addEventListener('message', function(e){
      self._message_receive(e,self);
    });
  }

  // -------------------------------------------------------

  /**
   *  @brief: Callback for when the `openDeclaration-button` was pressed
   *  @return: true  => `openDeclaration` was processed
   *           false => Did not run `openDeclaration`
   **/
  onKeyDown_openDeclaration(){
    console.log ("open declaration via F12");
    let focusedElem = document.activeElement;
    if (isObject (focusedElem.vp_request_outline_for_selection))
    {
      focusedElem.vp_request_outline_for_selection ();
    }
    return false;
  }

  // -------------------------------------------------------


  /**
   * Gets the object, the request information, connected
   *  to that request and deletes the index.
   * @return: object, that started a request.
   *          null, if no such object exists.
   **/
  _request_getRequestInformation(strRequestId_nullable_undefiendable)
  {
    let requestInformation = null;
    const strRequestId = strRequestId_nullable_undefiendable;
    if (isObject (strRequestId) && strRequestId != "")
    {
      requestInformation = this._request_awaitingRequests[strRequestId];
      delete this._request_awaitingRequests[strRequestId];
    }

    return requestInformation;
  }

  // ----------------------------------------------------------------

  show_debug_message(message)
  {
    let log = document.createElement("div");
    log.style.border = "1px solid black";
    log.innerText = "Debug message: " + message;
    document.body.insertBefore (log, document.body.firstChild);
  }

  // ----------------------------------------------------------------

  /**
   * Convert CALLER/CALLEE information to LEFT/RIGHT information
   **/
  _requestDirection2visualizationLocation(requestDirection)
  {
    switch (requestDirection)
    {
      case RequestInformation.CALLEE:
        return Direction.RIGHT;
      case RequestInformation.CALLER:
        return Direction.LEFT;
    }
    return Direction.RIGHT;
  }


  // ----------------------------------------------------------------

  /**
   * Visualize outlineEntities within `requestMessage` on screen.
   **/
  _visualizeOutline(requestMessage)
  {
    let self = this;

    let requestInfo = this._request_getRequestInformation (requestMessage.getRequestId ());
    if (!requestInfo)
      requestInfo = new RequestInformation ();


    // translate direction
    let visualizingLocation = this._requestDirection2visualizationLocation (requestInfo.requestDirection);

    let positioner = new WindowPositioner (this._vp_world, requestInfo.requestee, visualizingLocation);

    // visualize all outlineEntities
    const outlineEntities = requestMessage.getOutlineEntities ();

    for (let i=0; i<outlineEntities.length; ++i)
    {
      let outlineEntity = outlineEntities[i];
      let managedWindow = self._window_focusFromOutlineEntity (outlineEntity);

      if (!managedWindow)
      {
        managedWindow = self._managedWindow_create (
                                requestMessage, outlineEntity,
                                positioner.getX(),
                                positioner.getY());
      }

      positioner.moveY();

      // create connection, if necessary
      if (RequestInformation.CALLEE == requestInfo.requestDirection)
        self._connection_createIfNotExisting (requestInfo.requestee, managedWindow);

    }
  }

  // ----------------------------------------------------------------

  /**
   * @return true, entity was focuessed
   *          false, entity could not be focussed (= it does not exist, yet)
   **/
  _outlineEntity_tryFocusAndConnect (newOutlineEntity, source)
  {
    let target = this._window_focusFromOutlineEntity (newOutlineEntity);
    if (target)
    {
      this._connection_createIfNotExisting (source, target);
      return true;
    }
    return false;
  }

  // -------------------------------------------------------

  /**
   *   @param: type: VpwOutlineWindow
   **/
  _window_focusAndConnect (dom_sourceWindow, dom_targetWindow){
    this._connection_createIfNotExisting (dom_sourceWindow, dom_targetWindow)
    dom_targetWindow.vp_focus();
  }

  // -------------------------------------------------------

  /**
   *  @param: type: VpwOutlineWindow
   *  @return: success: connection between entities
   *           fail: null (if no connection could be created)
   **/
  _connection_createIfNotExisting(dom_source_nullable, dom_target_nullable)
  {
    if (isObject(dom_source_nullable) && isObject (dom_target_nullable))
    {
      return this._vp_world.connection_createIfNotExisting (dom_source_nullable, dom_target_nullable);
    }
    return null;
  }

  // -------------------------------------------------------

  /**
   *   @return: entity corresponding to `outlineEntity`
   *           null, if there is none
   **/
  _managedWindow_create(msg, outlineEntity, windowX, windowY)
  {
    let viewEntity = new SViewEntity (outlineEntity, windowX, windowY);

    // Add to GUI
    if (msg.isOutline()){
      return this._vp_world.visualizeOutline (viewEntity);
    }else if (msg.isMessage())
      return this._vp_world.visualizeMessageBox (viewEntity);

    return null;
  }

  // -------------------------------------------------------

  /**
   *  brief: receives a message from IDE (vscode) and processes it.
   **/
  _message_receive(event){
    const message = event.data;
    // debug
    //this.show_debug_message ( JSON.stringify (message));

    let msg = new RequestMessage (message);
    if (msg.isMessage ()){
      this._visualizeOutline (msg);
    } else
    if (msg.isOutline ()){
      this._visualizeOutline (msg);
    } else {
      document.body.innerHTML += "<br>ERROR: did not understand message (no known `type` given): " + JSON.stringify (message);
      return false;
    }

    return true;
  }

  // -------------------------------------------------------

  /**
   * @brief
   * @return: focused entity,  if entity was focused
   *          null          ,  if entity was not focused
   **/
  _window_focusFromOutlineEntity(outlineEntity)
  {
    let window = this._vp_world.window_getFromOutlineEntity (outlineEntity);
    if (isObject (window)){
      window.vp_focus();
      return window;
    }
    return null;
  }

  // -------------------------------------------------------

  /**
   *  @brief Send a message to outliner (vscode) and when the
   *          answer comes (as `message`), render it on screen.
   *  @param: outlineEntity with all necessary content filled
   *  @return: true, if request was send
   *           false, if request was not send because
   *                   requested entity already exists
   **/
  outline_request(uri, outlineEntity, requestee){
    // TODO: performance: <obsolete, but keep for reasoning reasons>
    // Currently we only check if the entity is already shown; if so, focus it.
    //  Otherwise we request it from "the server" (vscode)
    // However, maybe the outline is already here on the client side (webview) and it's just
    //  not shown (like when a function definition is already within the
    //  class definition outline data.
    // REJECTED:
    //  1. func defintion should not be inside class outline (this might only be the case
    //                                                        in the prototype)
    //  2. If the class gets closed and the object destroyed, but not the function definition,
    //     things get nasty


    // If requested entity is already on screen: focus and draw line
    if (this._outlineEntity_tryFocusAndConnect (outlineEntity, requestee))
      return false; // entity exists; no request was sent


    // Otherwise: send out a request
    this.outline_requestByFilePosition (uri,
                                        OutlineEntityFunctions.getPosStart (outlineEntity),
                                        OutlineEntityFunctions.getPosEnd (outlineEntity),
                                        requestee);

    return true;
  }

  // -------------------------------------------------------

  /**
   * returns a requestId, that can be used with `_request_awaitingRequests`
   **/
  _requestId_get(){
    return "a" + this._nextRequestId++;
  };

  // -------------------------------------------------------

  /**
   *   requests the outline on the given position
   **/
  outline_requestByFilePosition(uri,
                                cursorStart, cursorEnd,
                                requestee)
  {
    let data = {
      uri: uri,
      cursorStart: cursorStart,
      cursorEnd: cursorEnd,
    }

    let requestInformation = new RequestInformation();
    requestInformation.requestee = requestee;

    this._outlineEntity_request ("outline_requestByFilePosition",
                                  data,
                                  requestInformation);
  }

  // -------------------------------------------------------


  outline_requestLocationDefiner(outlineEntity, requestee_nullable)
  {
    let requestInformation = new RequestInformation();
    requestInformation.requestee = requestee_nullable;
    requestInformation.requestDirection = RequestInformation.CALLER;

    this._outlineEntity_request ("outline_requestLocationDefiner",
                                 outlineEntity,
                                 requestInformation);
  }


  // -------------------------------------------------------


  host_openRawSource(outlineEntity, requestee_nullable)
  {
    let requestInformation = new RequestInformation();
    requestInformation.requestee = requestee_nullable;

    this._outlineEntity_request ("vp_host_openRawSource",
                                 outlineEntity,
                                 requestInformation);
  }


  // -------------------------------------------------------

  /**
   * File a "request ticket":
   * Create a request ID and assoziate it with the object.
   * When the request comes back, the request ID can
   * be used to track the object, that requested it
   *
   * @return: request ID that was created.
   **/
  _request_memorize (requestInformation){
    let requestId = this._requestId_get();

    this._request_awaitingRequests[requestId] = requestInformation;

    return requestId;
  }

  // -------------------------------------------------------

  /**
   * @brief Sends a request to IDE containting an ID, that
   *        will be used, when the answer for the request
   *        is comming back
   **/
  _outlineEntity_request(type, data, requestInformation){

    // remember request
    let requestId = this._request_memorize (requestInformation);

    let message = {
                    type: type,
                    requestId: requestId,
                    data: data
                  };
    //this.show_debug_message ( JSON.stringify (message));

    gBackend.postMessage(message);
  }

  // -------------------------------------------------------

  // -------------------------------------------------------

}
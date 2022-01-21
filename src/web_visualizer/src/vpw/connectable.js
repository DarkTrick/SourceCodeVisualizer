/**
 * Implements the functionality to connect n ConnectionLines
 * to an element (like an interface).
 *
 * Usage:
 *   Create:
 *     Call Connectable.makeConnectable([your DOM object]) to add
 *    a standardized variable to a DOM object.
 *  Access:
 *    Connectable.getInterface ([your dom])
 *
 * Don't:
 *  call `new Connectable` directly, because the standard way
 *  of addressing this functionality inside an object
 **/
class Connectable
{
  /**
   * Function to make an arbitrary object a Connectable.
   *  afterwards use `Connectable.getInterface()` to access functionality
   * @return: true,  if it was made a Connectable
   *          false, if it was already a Connectable
   **/
  static makeConnectable (domObject){
    if (! isObject(domObject._vp_connection)){
      domObject._vp_connection = new Connectable(domObject);
      domObject.addEventListener ("visibilitychange", e => {
        console.log ("connector closed");
      });
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------

  /**
   *  returns an object with Connectable functionality
   **/
  static getInterface(domObject){
    return domObject._vp_connection;
  }

  // ------------------------------------------------------------



  // ------------------------------------------------------------

  /**
   * @param domObject: dom object, that this interface is attached to.
   **/
  constructor(domObject){
    this._connections = new Set();
    this._parentDOM = domObject;
  }

  // ------------------------------------------------------------

  /**
   * @return: true:  connection was added
   *           false: connection line already existed
   **/
  addConnection(connectionLine){
    if (this._connections.has (connectionLine))
      return false;

    this._connections.add (connectionLine);
    this._event_connection_created (connectionLine);
    return true;
  }

  // ------------------------------------------------------------

  /**
   * Removes the connection line on both ends of the `connectionLine`.
   *   No problem, if either one is not a `Connectable`
   *
   * @return: true,  connection was removed
   *          false, connection was not there
   **/
  remove(connectionLine){
    /*
    if (this._connections.has (connectionLine)){
      // Problem: Here we don't know if we are the source
      //         or target. Therefore we remove the
      //         connections objectively

      let endpoint = null;

      // remove source
      {
        endpoint = Connectable.connection (this.domSource)
        if (isObject (endpoint))
          endpoint._delete (connectionLine);
      }

      // remove target
      {
        endpoint = Connectable.connection (this.domTarget)
        if (isObject (endpoint))
          endpoint._delete (connectionLine);
      }

      return true;
    }
    return false;
    */
    let deleteResult = this._delete (connectionLine);
    if ( true == deleteResult ){
      this._event_connection_removed (connectionLine );
    }
    return deleteResult;
  }

  /**
   * Deletes connectionLine
   *  (does not inform the other end)
   **/
  _delete(connectionLine){
    return this._connections.delete (connectionLine);
  }

  // ------------------------------------------------------------

  /*removeAll(){
    for (connectionLine of this._connections){
      console.log ("TODO: remove all");
    }
  }*/

  // ------------------------------------------------------------

  getConnections(){
    return this._connections;
  }

  // ------------------------------------------------------------

  /**
   * @return: true, if there is at least one connection
   *          false, if there is no connection
   **/
  hasConnections(){
    return (this._connections.size > 0);
  }

  // ------------------------------------------------------------

  _event_connection_created(connectionLine){
    let event = new Event("connection_created",
      { connection: connectionLine });
    this._parentDOM.dispatchEvent (event);
  }

  _event_connection_removed(connectionLine){
    let event = new CustomEvent("connection_removed",
      { connection: connectionLine });
    this._parentDOM.dispatchEvent (event);
  }

  // ------------------------------------------------------------
}
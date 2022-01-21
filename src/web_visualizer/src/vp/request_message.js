/**
 * class for encapsulating a message received from vscode
 **/
class RequestMessage
{
  constructor (message){
    this._message = message;
  }

  getRequestId(){
    return this._message.requestedId;
  }

  getOutlineEntities(){
    return this._message.data
  }

  allowDuplicates(){
    return this.isMessage();
  }

  isOutline(){
    return (this._message.type == "visualizeOutline");
  }

  isMessage(){
    return (this._message.type == "messageBox");
  }
}
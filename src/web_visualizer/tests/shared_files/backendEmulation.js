// =============================================================

/**
 * This script emulates a vscode environment. It's only used for
 *  prototypes in the browser
 *
 *
 * INCLUDE BEFORE: `scripts.js` ( main code for system)
 * INCLUDE AFTER : none
 *
 **/

// =============================================================

class MockOutlines
{
  static g_asString(){
    return {

      uri: "utils.py",
      language: "python",
      CLASS_TYPE: "Symbol",
      parts:[
        {
          language: "python",
          uri: "utils.py",
          CLASS_TYPE: "Text",
          displayTextRange: [{line: 9, character: 6}, {line: 2, character: 30}],
          displayText: '  return number + ""'
        }
      ],
      kind: "Function",
      totalRange: [{line: 9, character: 0}, {line: 17, character: 0}],
      attributes: [],
      displayTextRange: [{line: 9, character: 6}, {line: 2, character: 30}],
      displayText: "g_asString(number: int)",

    };
  }
}

/**
 *  brief: mock object for vs code
 **/
class BackendMock
{
  constructor(){
    this.savedState = null;
    this._outlineData = {}
  }

  setState (state){ this.savedState = state;  }
  getState (){ return this.savedState; }


  /**
   * Apply outline data
   **/
  addOutlineData (dictOutlineData)
  {
    this._outlineData = Object.assign({}, dictOutlineData);
  }


  /**
   *  @brief Usually this function is implemented by VS code and would send a
   *         message to typescript. This one here is a mock function.
   *         It checks the message content and returns predefined content for
   *         it (therefore it looks a little big and complicated).
   **/
  postMessage(message)
  {
    // object to return back to the webview
    let type = "visualizeOutline";

    let filename = message.data.uri;
    let file = this._outlineData[filename];
    if (file == null){
      console.error("Testenv error: `file` is null");
      return;
    }
    let identifier = null;
    let returnObj = null;

    // Find "identifier"
    {
      switch (message.type){
        case "outline_requestByFilePosition":
        {
          let fileContent = file.contentLineBuffer;
          let line = fileContent[message.data.cursorStart.line];
          let idStart = line.substr(message.data.cursorStart.character);
          let idEndPos = idStart.search("[^a-zA-Z0-9_]")
          identifier = idStart.substr(0,idEndPos).trim();
        }
        break;
        case "outline_requestLocationDefiner":
        {
          // just deliver an arbitrary entity as parent
          identifier = "foo1b";
        }
        case "vp_host_openRawSource":
        {
          identifier = "error";
          type = "messageBox";
          returnObj = {
            type:  "Error",
            title: "Open Source failed",
            message: "Could not open Source, because there is " +
                  "no real host connected."
          }
        }
        break;
        default:
            identifier = "???"; // trigger an error
      }
    }

    console.debug ("vscodeEmulation: identifier: `" + identifier + "`");

    if (identifier == ""){
      console.debug ("vscodeEmulation: changed identifier");
      identifier = "foo1b";
    }

    // Using identifier, get the returning object
    {
      // check, if there is data in our example files (this._outlineData)
      if (file != null){
        let outline = file.outline[identifier];
        if (undefined != outline){
          returnObj = outline;
        }
      }

      // Check if we should try using any of our pure mock functions
      if (null == returnObj)
      {
        switch (identifier)
        {
          case "g_asString":
            returnObj = MockOutlines.g_asString();
            break;
        }
      }

      // still no return object found; => return an error
      if (null == returnObj)
      {
        type = "messageBox";
        returnObj = {
          type:  "Error",
          title: "No implementation found",
          message: "Implementation for `" + identifier.replace(" ", "&nbsp;") + "` could not be found"
        }
      }
    }

    // wrap everything up to a message and send it to the webview
    {
      // create mock return value
      window_postRequest (type, message.requestId, [ returnObj ]);
    }
  }
}

function window_postRequest(type, rqId, data)
{
  let message = {
                  type: type,
                  requestedId: rqId,
                  data: data
                };
  let event = new Event ("message");
  event.data = message;
  window.dispatchEvent (event);
}

/**
 * @caution: Don't include from VSCode
 * @brief:   Resolves vscode dependencies
 *           with stub/mock objects
 **/
let gBackend = null;


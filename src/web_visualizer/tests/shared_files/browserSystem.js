// =============================================================

/**
 * This script is only used for prototyping WITHOUT vscode.
 * It provides buttons to fire actions, that vscode would usually fire
 *  (after a user triggers them)
 *
 * INCLUDE BEFORE: none
 * INCLUDE AFTER : `scripts.js` ( main code for system)
 **/

// =============================================================


/**
 * Creates an outline entity to be able
 * to have a solid base for testing
 **/
function createOutlineEntity(type, displayText){
  let ret = new Object();

  ret.CLASS_TYPE = "Symbol";
  ret.uri = "file:///usr/myfile.py";
  ret.parts = [];

  ret.kind = type;
  ret.totalRange = null;
  ret.attributes = [];
  ret.displayTextRange = null;
  ret.displayText = displayText;

  return ret;
}

function range_new(line1,char1,line2,char2){
  return [{line: line1, character: char1},{line: line2, character: char2}];
}

function createOutline_TextNode(value)
{
  let ret = new Object();

  ret.CLASS_TYPE = "Text";
  ret.displayText = value;
  ret.displayTextRange = range_new (0,0,5,0);

  return ret;
}

/**
 * Create an example outline of a class
 **/
function createExampleOutlineClass(){
  let outline = createOutlineEntity ("class", "MyClass");
  outline.contentLoaded = true;

  // create func declarations
  outline.parts.push (gExampleFiles["file:///usr/myfile.py"].outline["foo1b"]);
  outline.parts.push(createOutlineEntity ("Function", "foo2(self, num: int)"));
  outline.parts.push (gExampleFiles["file:///usr/myfile.py"].outline["foo3b"]);

  return outline;
}

/**
 * Create an example outline of a function
 **/
function createExampleOutlineFunction()
{
  let outline = createOutlineEntity ("Function", "five (param1: int, param2: str)");
  // add code
  let code = createOutline_TextNode ('"""return 5""""\nreturn 5;');
  outline.parts.push(code);

  return outline;
}

/**
 * Creates a panel that shows debugging buttons
 * on hover
 **/
function initDebuggingHelpers()
{
  let debugPanel = document.createElement ("div");
  debugPanel.classList.add ("DebugPanelLeft");
  document.body.appendChild(debugPanel);

  // shown without hover
  let indicator = document.createElement ("span");
  indicator.innerHTML = "<b>三</b>";
  indicator.classList.add ("DebugPanelIndicator");
  debugPanel.append (indicator);

  // shown on hover
  let debugPanelContent = document.createElement ("div");
  debugPanelContent.classList.add ("DebugPanelContent");
  debugPanel.append (debugPanelContent);

  let title = document.createElement ("div");
  title.innerHTML = "<u>Debug helpers</u>";
  debugPanelContent.append (title);


  let createButton = function (caption, onClickCallback){
    let btn = document.createElement ("button");
    btn.classList.add ("DebugButton")
    btn.innerText = caption;
    btn.addEventListener ("click", onClickCallback);
    return btn;
  };

  debugPanelContent.appendChild(
    createButton ("window stats (console)",
      event=>{
        let windows = document.getElementsByClassName("Window");
        console.log("----------------");
        for (let i = 0; i < windows.length; ++i){
          let window = windows[i];
          if (undefined != window.viewEntity)
            console.log (window.viewEntity);
          else
            console.log ("[object without viewEntity]");
        }
      }));

}

// -----------------------------------

function checkDepsAndInit()
{
   if (!(typeof initSystem === 'function')) {
      let msg = "<b>FATAL ERROR:<b> Please check, if the file '../release/web_visualizer.js' exists. <br>" +
      "<i>Background:</i> I can't find the `initSystem` function, that's supposed to be in that file";
      let container = document.createElement ("div");
      container.innerHTML = msg;
      document.body.appendChild (container);
      return;
   }

   initSystem();
}



// init this system
window.addEventListener ("load", e => {
  // make sure any other fixed load function runs before the browser system
  {
    originalOnLoad = document.body.onload;
    document.body.onload = null;

    originalOnLoad (e);
  }

  initDebuggingHelpers();

},true);


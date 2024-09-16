require ("./vp/controller.js");
require ("./utils/std.js");

let gController = null;

function initSystem()
{
  let diagramDomRoot = _diagramWindow();
  node_preventContextMenu (diagramDomRoot);

  gController = new Controller (diagramDomRoot);
  window.vp_controller = gController;

  _setupGlobalShortcuts(gController);
}


function _setupGlobalShortcuts(controller)
{
  document.addEventListener('keydown', (e) => {
    let keymap = Array();
    keymap["openDeclaration"] = "F12";

    switch (e.code){
      case keymap["openDeclaration"]:
        e.preventDefault();
        controller.onKeyDown_openDeclaration();
        break;
      default:
        return false;
    }

    e.stopPropagation();
    return true;
  });
}


function _diagramWindow()
{
  let diagramWindow = document.createElement ("div");
    {
      diagramWindow.id = "diagramWindow";
      diagramWindow.classList.add("diagramWindow");

      document.body.appendChild (diagramWindow);
    }
  return diagramWindow;
}

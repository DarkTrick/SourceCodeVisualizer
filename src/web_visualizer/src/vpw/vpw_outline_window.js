const { title } = require("process");

require ("../vgf/vgf_window_tiled.js");
require ("../vgf/vgf_expandable_with_title.js");
require ("../vgf/vgf_button_toggle.js");

require ("./vpw_btn_open_definition.js");
require ("./vpw_code_editor.js");
require ("../utils/misc_utils.js");
require ("../vgf/vgf_menu.js");

require ("vpw_view_entity_window.js");




const VpwOutlineWindow = (function(viewEntity_outline)
{
  let self = new VpwViewEntityWindow (viewEntity_outline);

  let _constructor = function ()
  {
    // object type indicator
    self.vp_isCodeOutline = true;

    let tsOutlineRange = viewEntity_outline.vp_model;


    let metatype = "";
    let quickhelp = metatype + "\n";

    // object specific handling
    switch (tsOutlineRange.CLASS_TYPE)
    {
      case "File":
        {
          let tsOutlineFile = tsOutlineRange;

          metatype = tsOutlineFile.CLASS_TYPE;
          quickhelp += tsOutlineRange.uri;
        }
        break;
      case "Symbol":
        {
          let tsOutlineSymbol = tsOutlineRange;

          {
            // put all attributes in metatype information
            for (let i = 0; i<tsOutlineSymbol.attributes.length;++i)
              metatype += tsOutlineSymbol.attributes[i].kind + " ";

            if (metatype.trim() == "")
              metatype += tsOutlineSymbol.kind;

            quickhelp += tsOutlineSymbol.displayText;
          }
        }
        break;
      case "Text":
        break;
      case "Attribute":
        break;
    }

    let titletext = SyntaxHighlighter.run (tsOutlineRange.displayText,
                                            tsOutlineRange.language);

    self._vp_createClientTitle (self.vp_title, metatype, titletext, quickhelp);
    self._vp_fillClientarea (self, self.vp_window_clientarea, tsOutlineRange);

    self.vp_getUri = function(){
      return viewEntity_outline.vp_model.uri;
    };


    // shrink size to an initial of 52 chars
    {
      let sizeRect = getSizeRectOfUnownedElement (self);
      let MAX_SIZE = 356; // 52 chars
      if (sizeRect.width > MAX_SIZE)
      {
        self.vp_window_clientarea.style.width = MAX_SIZE + "px";
      }
    }


    let _setupContextMenu = function()
    {
      self.vp_title.addEventListener ("contextmenu", e =>
      {
        let menu = new VgfMenu ();
        menu.vp_addEntry ("Open parent", function(){
          self.vp_getWorld ().vp_outline_openLocationDefiner (
              self.viewEntity.vp_model, self);
        });
        //menu.vp_addEntry ("Open callers", function(){ alarm ("not yet implemented"); });
        menu.vp_addSeparator ();
        menu.vp_addEntry ("Show in code", function(){
          self.vp_getWorld ().vp_host_openRawSource (
            self.viewEntity.vp_model, self);
        });

        self.vp_getWorld ().vp_runPopup (menu, e.x, e.y);
      });
    }
    _setupContextMenu ();


    return self;
  };



  self._vp_createClientTitle = function(root, metatype, titleString, quickhelp)
  {

    let node = null;
    {
      node = document.createElement ("div");
      node.classList.add ("Window_Titlebar_MetatypeDiv");
      node.innerText = metatype;
      root.appendChild (node);
    }
    {
      node = document.createElement ("div");
      node.classList.add ("Window_Titlebar_Title");
      node.title = quickhelp;
      node.innerHTML = titleString;
      root.appendChild (node);
    }
  }



  self._vp_fillClientarea = function(window, root, tsOutlineSymbol){
    for (let i=0; i<tsOutlineSymbol.parts.length; ++i)
    {
      let part = tsOutlineSymbol.parts[i];
      // special treatment for "code"
      switch (part.CLASS_TYPE){
        case "File":
        case "Symbol":
          let tsOutlineSymbol = part;
          self._vp_addDeclaration (window, root, tsOutlineSymbol);
          break;
        case "Text":
          self._vp_addCodeblock (root, part, part.displayText, true, window);
          break;
      }
    }
  }



  self._vp_addDeclaration = function(theWindow, root, tsOutlineSymbol)
  {

    let domDecl = document.createElement ("div");
    domDecl.classList.add ("Window_Clientarea_OpenDeclarationBlock");
    domDecl.title = tsOutlineSymbol.kind;
    /*
    // add kind information
    // Why commented out?
    //  looks aweful; I'm not sure, if we need it, because
    //  functions start small, classes start large.
    let kind;
    {
      kind = document.createElement ("div");
      kind.classList.add ("viewEntityRepr_OutlineKindIndicator");
      kind.title = tsOutlineSymbol.kind;
      kind.innerText = tsOutlineSymbol.kind.substr(0,1);
    }
    domDecl.appendChild (kind);*/

    // test:

    let table = document.createElement ("table");
    table.style.borderSpacing = "0px";
    table.style.width = "100%";
    domDecl.append (table);

    let line = document.createElement ("tr");
    table.append (line);

    let td1 = document.createElement("td");
    td1.innerText = tsOutlineSymbol.displayText;
    line.append (td1);

    let td2 = document.createElement("td");
    td2.style.textAlign = "right";
    line.append (td2);

    let btn = new BtnOpenDefinition (tsOutlineSymbol,
                                     theWindow)

    domDecl.addEventListener ("click", e => {
      btn.click();
    });

    td2.append (btn);

    root.appendChild (domDecl);
  }




  /**
   *  @brief: Adds a textarea for code editing.
   *          Adding following attributes to textarea:
   *           - model:            reference to outlineEntity
   *          - getOriginalCursorStart(): calculates the cursor start pos in file
   *          - getOriginalCursorEnd  (): calculates the cursor end pos in file
   **/
   self._vp_addCodeblock = function(root, tsOutlineSymbolText, content, editable, groupParent)
   {
     console.log("content:");
     console.log(content + "\n\n");
     let node = new VpwCodeEditor(tsOutlineSymbolText, content, groupParent);

     root.appendChild(node);
   }




  _constructor ();
  return self;
});

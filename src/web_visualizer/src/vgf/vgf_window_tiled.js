require ("./vgf_window.js");

// ========================================================================

/**
 * Offers a collection of functions to create a VgfWindowTitled.
 * This class should remain technical and have no domain knowledge
 **/
const VgfWindowTitled = (function()
{
  let self = new VgfWindow ();
  /**
   *  Create basic empty window with following specific properties:
   *    .vp_title:  DOM-element: contains the title
   *    .vp_window_clientarea:  div containing window content
   *
   *    event emit "rolledUpChanged" on rollup-button clicked
   *    event emit "vp_beforeDelete" when close-button clicked
   *    .rolledUp: bool, informs if windows is rolled up or not
   *
   *     class: Window
   **/
  self.constructor = function()
  {
    self.classList.add ("Window_OuterFrame");
    self.classList.add ("Window");

    self.vp_title = null; // DOM-element

    {
      let container = document.createElement ("div");
      self.appendChild (container);
      container.classList.add ("Window_InnerFrame");
      {
        let expandible = new VgfExpandableWithTitle();
        expandible.vp_setTitleFullWidth();
        expandible.vp_expand();
        {
          // ---- title ----
          _createTitle(expandible);


          // ---- content ----
          self.vp_window_clientarea = _create_content_area();
          expandible.vp_appendContent (self.vp_window_clientarea);
        }
        container.appendChild (expandible);
      }

    }

    return self;
  }




  _create_title_area = function ()
  {
    let node = document.createElement ("div");
    node.classList.add ("Window_Titlearea");

    node.addEventListener ("mousedown",function (event ) {
      if (event.button != 0)
        return;
      self.vp_startMoving_fromEvent (event);
    });

    return node;
  }



  _createTitle = function(expandible)
  {
    self.vp_title = document.createElement ("span");

    let topRow = _create_title_area();

    topRow.append (self.vp_title)
    topRow.append (_create_btn_close (self));

    expandible.vp_appendTitle (topRow);
  }



  _create_content_area = function()
  {
    let node = document.createElement ("div");
    node.classList.add ("Window_Clientarea");
    node.classList.add ("resizable");

    // reset size on dblclick
    node.addEventListener ("dblclick", e=>{
      node.style.width = "auto";
      node.style.height = "auto";
    });

    return node;
  }



  _create_btn_close = function (self)
  {
    let node = document.createElement("div");
    node.classList.add("Window_Titlebarelement");
    node.classList.add("Window_btn");
    node.classList.add("Window_btnClose");
    node.innerHTML = "×";


    // prevent window moving to activate
    node.addEventListener ("mousedown",e => {
      e.stopPropagation ();
    });

    node.addEventListener ("click",e => {
      self.vp_delete();
    });
    return node;
  }

  // --------------------------------------------------------------------------

  /**
   *  @return: Owning top level Window of `domElem`, if available;
   *           `domElem`, if it's a TopLevel window
   *           null, if there is none
   **/
  self.getTopLevelWindow = function(domElem){
    let parent = domElem;
    for (let i = 0; i<50; ++i){ // infinity loop with emergency-stop
      if (null == parent) {
        console.error ("getTopLevelWindow: This should never happen. Maybe windows are being created without a `Window` class");
        break;
      } else if (parent.classList.contains ("Window")){
        return parent;
      }
      parent = parent.parentNode;
    }
    return parent;
  }


  // --------------------------------------------------------------------------

  self.constructor();
  return self;
});


// ============================================================================


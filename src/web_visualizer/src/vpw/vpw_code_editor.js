require ("connectable.js");
require ("../vgf/vgf_widget.js");
require ("../utils/text_utils.js");
require ("../utils/misc_utils.js");
require ("../utils/selection_utils.js");

const VpwCodeEditor = (function(tsOutlineSymbolText, content, groupParent)
{
   let self = new VgfWidget ("div");
   // -------------------------------------------------------

   self._ctor = function()
   {
      self.contentEditable = "true"
      self.classList.add ("VpwCodeEditor");

      self.vp_setContent (content, tsOutlineSymbolText.language);
      self.vp_model = tsOutlineSymbolText;
      self._vp_groupParent = groupParent;

      self._setupEvents();
   };



   // -------------------------------------------------------
   // TODO: move to widget? or create a `container` class?
   //          more thinking is needed regarding structure!
   self.vp_getUri = function()
   {
      return self.vp_getToplevelWidget().vp_getUri();
   }

   // -------------------------------------------------------

   self._setupEvents = function(){

      // Create onLineChange event (DOM does not support it)
    {
      const observer = new MutationObserver(function(a,b) {
            let event = new CustomEvent("change");
            self.dispatchEvent (event);
            // TODO: Dont call on this redraw directly!
            //          Maybe it should be forwarded like: code editor -> window -> viewMgr.
            //          For now we leave it like this.
            // also, use the params `a`, `b` to figure out what kind of change we had
            //gController._vp_world.canvas_redraw();
      });
      observer.observe (self, {childList: true,
                              subtree: true,
                              attributes: true,
                              characterData: true});
    }
   }

   // -------------------------------------------------------

   /**
    * Use this function to the content of this object.
    *  it formats the input so to work with it properly
    *  afterwards
    **/
   self.vp_setContent = function(content, syntaxHighlightingLanguage=""){
      let intermediate = SyntaxHighlighter.run (content, syntaxHighlightingLanguage);

      // needed also to make connection lines work
      intermediate = "<div>" + intermediate.replaceAll("\n","<br/></div><div>") + "</div>"

      self.innerHTML = intermediate;//.replaceAll("<div></div>", "<div></div>") ;
   }

   // -------------------------------------------------------

   self.ondblclick = function(){
      console.log ("open declaration via double click");
      self.vp_request_outline_for_selection ();
   }

   // -------------------------------------------------------

   /**
    * @return: [<filename>,<abs_filepos_start>,<abs_filepos_end>]
    *
    **/
   self.vp_request_outline_for_selection = function()
   {
      // setup
      let uri = self.vp_getUri();
      let cursorStart = self.vp_getOriginalCursorStart();
      let cursorEnd = self.vp_getOriginalCursorEnd();
      //console.log ("curStart:curEnd> " + cursorStart + " : " + cursorEnd);
      //console.log ("curStart_rel:curEnd_rel> " + (cursorStart-self.vp_model.filePos) +
      //                              " : " + (cursorEnd-self.vp_model.filePos));

      // setup 2
      // determine requestee (= div surrounding selected line)
      let requestee = SelectionUtils.getNodeAroundCursorPos();
      if (!requestee.vp_isVpObject)
         VgfWidget_createFrom (requestee);
      Connectable.makeConnectable (requestee);

      // run
      self.vp_getWorld().vp_outline_openSymbolAt
         (uri, cursorStart, cursorEnd, requestee);
   }

   // -------------------------------------------------------

   self.vp_getOriginalCursorStart = function()
   {
      let base = self.vp_model.displayTextRange[0];
      let offsetPos = SelectionUtils.div_getSelectionStartPosition (self);

      return VsCode.position_sum (base, offsetPos);
   };

   // -------------------------------------------------------

   self.vp_getOriginalCursorEnd = function()
   {
      let base = self.vp_model.displayTextRange[1];
      let offsetPos = SelectionUtils.div_getSelectionEndPosition (self);

      return VsCode.position_sum (base, offsetPos);
   };

   // -------------------------------------------------------

   self._ctor();
   return self;
});

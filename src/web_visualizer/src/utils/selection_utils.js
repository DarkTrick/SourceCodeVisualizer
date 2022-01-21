require ("./text_utils.js");


/**
 * Constraint:
 *  - These function don't work for `textarea` or `input`
 *    (browser's fault)
 **/
class SelectionUtils
{
  /**
   * @return: Coordinates of upper left corner of selection:
   *          [x,y]
   **/
  static getCoordinates()
  {
    let marker = document.createElement ("span");
    this.placeNodeBeforeSelection (marker)

    let offset = getOffset (marker);
    marker.remove ();

    return [offset.left, offset.top];
  }

  // --------------------------------------------------------

  /**
   *  <span> This <span>is a </span> text </span>
   *                      ^
   *                    cursor
   *
   * <span> This <span><b>is a</b></span> text </span>
   *                    ^       ^
   *                 In case `domObject` was `b`
   **/
  static placeNodeAroundContentInCurrentNode(domObject)
  {
    let containingNode = this.getNodeAroundCursorPos ();
    domObject.innerHTML = containingNode.innerHTML;
    containingNode.innerHTML = "";
    containingNode.appendChild (domObject);
  }

  // --------------------------------------------------------

  /**
   * E.g:
   *       <span> This <span> is a </span> text.</span>
   *                          ^
   *                        cursor
   *                     ^
   *                   This node will come back
   *
   * @param start: in case of selection: use start
   *                position or end position
   **/
  static getNodeAroundCursorPos(start = true)
  {
    let range = this._getSelectionRangeClone ();
    return this._getNodeAroundRangePos (range, start);
  }

  // --------------------------------------------------------

  /**
   * see `getNodeAroundCursorPos` for information
   *
   * @param range: const
   **/
  static _getNodeAroundRangePos(range, start)
  {
    let startContainer = null;
    if (start)
      startContainer = range.startContainer;
    else
      startContainer = range.endContainer;

    // Usually startContainer will be inside a text node;
    //  in that case we nee to return its parent to have
    //  a functional DOM node
    if (startContainer.nodeType == Node.TEXT_NODE)
      return startContainer.parentNode;

    // Sometimes (e.g. if the cursor is on an empty row
    //  (like in `<div>|<br></div>`, startContainer is
    //  already a DOM node (not Text node). Therefore we
    //  return it as is.
    return startContainer;
  }

  // --------------------------------------------------------

  /**
   * Be careful. If the selection spreads over several tags,
   * the result might be not expected.
   **/
  static placeNodeAroundSelection(domObject)
  {
    let range = this._getSelectionRangeClone ()
    range.surroundContents (domObject);
  }

  // --------------------------------------------------------

  static placeNodeAfterSelection(domObject){
    this._placeNodeNextToSelection (domElement, false);
  }

  static placeNodeBeforeSelection(domObject){
    this._placeNodeNextToSelection (domElement, true);
  }

  // --------------------------------------------------------

  static _placeNodeNextToSelection(domObject, start=true){
    let range = this._getSelectionRangeClone ();
    range.collapse (start);

    range.insertNode (domObject);
  }

  // --------------------------------------------------------

  static _getSelectionRangeClone(){
    // `(0)` => get first selection in case there are multiple
    return window.getSelection ().getRangeAt (0).cloneRange();
  }

  // --------------------------------------------------------

  /**
   * E.g
   *   <div>ABC<span>DEF</span></div>
   *     ^            ^
   * `baseElement`    cursor position
   *
   * returns: 4
   **/

  // --------------------------------------------------------

  static div_getSelectionStartPosition(baseElement){
    return this._getSelectionBoundaryPosition_countWithActiveSelection (baseElement, true);
  }
  static div_getSelectionEndPosition(baseElement){
    return this._getSelectionBoundaryPosition_countWithActiveSelection (baseElement, false);
  }

  // --------------------------------------------------------

  /**
   *  Returns cursor position start counting from `baseNode`.
   **/
  static getSelectionStartOffsetInEditableDiv (baseElement)
  {return this._getSelectionBoundaryOffset_countWithActiveSelection (baseElement, true);}

  static getSelectionEndOffestInEditableDiv (baseElement)
  {return this._getSelectionBoundaryOffset_countWithActiveSelection (baseElement, false);}

  // --------------------------------------------------------

  static _getSelectionBoundary(baseNode, start = true){
    return this._getSelectionBoundaryOffset_countWithActiveSelection(baseNode, start);
  }

  // --------------------------------------------------------

  /**
   * param `start`: true =>   get offset of selection start
   *                false => get offset of selection start
   **/
  static _getSelectionBoundaryOffset_countWithActiveSelection(baseNode, start = true)
  {
    return this._getStringUntilCurrent (baseNode, start).length;
  }

  // --------------------------------------------------------

  static _getSelectionBoundaryPosition_countWithActiveSelection(baseNode, start = true)
  {
    let content = this._getStringUntilCurrent (baseNode, start);

    let lineNr = TextUtils.count (content, "\n", false);
    let lastLineStart = content.lastIndexOf ("\n") + 1;
    let characterNr = content.length - lastLineStart;

    return {"line": lineNr, "character": characterNr};
  }

  // --------------------------------------------------------

  /**
   * Bad points: if used in an onkeydown/-up event, it might scramble up
   *             the selection if there are empty rows inside the selection.
   * Good points: Works well for the general case
   **/
  static _getStringUntilCurrent(baseNode, start = true)
  {
    // setup
    let returnString = "";

    // save original state
    let originalRange = this._getSelectionRangeClone (); // one for backup
    let visibleSelection = window.getSelection ();

    // run
    {
      // @Algo: using anything else, but `selection.toString` will not properly
      //        take into account linebreaks

      let selectionRange = originalRange.cloneRange ();
      selectionRange.collapse (start);
      selectionRange.setStart (baseNode, 0);
      visibleSelection.removeAllRanges ();
      // create temporary range
      visibleSelection.addRange (selectionRange);

      // find result values
      returnString = visibleSelection.toString();
    }

    // restore range
    visibleSelection.removeAllRanges();
    visibleSelection.addRange (originalRange);

    // result
    return returnString;
  }

  // --------------------------------------------------------

  /**
   * @param start: important if there is a selection.
   *        true => get offset from start position
   *        false => get offset from end position
   **/
  static _range_getOffset(range, start=true)
  {
    if (start)
      return range.startOffset;

    return range.endOffset;
  }

  // --------------------------------------------------------

  /*
   *  Good points:
   *       Works even in conjunction with keyup/keydown events.
   *  Bad points:
   *       Has very strong constraints.
   *
   *  @Caution:
   *     Nontrivial task. This function relies on the way
   *      editable divs work: Each line is given by a div like so:
   *      <div contentEditable="true">
   *        <div>line1</div>
   *        <div>line2</div>
   *      </div>
   *
   *     It does not work correctly for a case like this:
   *      <div contentEditable="true">
   *        <div>
   *          <div>line1</div>
   *          <div>line2</div>
   *        <div>
   *      </div>
   **/
  static _getSelectionBoundary_countByNumOfDivs(baseNode, start = true)
  {
    // 1) Create a range from <baseNode> to <cursor start>
    let range = this._getSelectionRangeClone ();
    range.collapse (start);
    range.setStart (baseNode, 0);

    if (false == start)
      console.log(range.toString());

    // 2) Count the number of chars there.
    let lengthWithoutLinebreaks = range.toString ().length;
    // Problem: `range.toString()` does not consider line
    //          breaks. Therefore we need to count them
    //          manually

    // 3) Count line breaks:
    //    Count all divs until the current node.
    //    This cannot find composite divs such as
    //      <div><div>1</div><div>2</div>3</div>
    let length = lengthWithoutLinebreaks +
                   this._countNumberOfLinebreaksInEditableDivUntilCursorPosition (baseNode);

    return length;
  }

  // --------------------------------------------------------

  /**
   *
   *  Return:
   *     success: Index of immediate child node
   *     fail: -1 (cursor does not reside within `editableDiv`'s Node tree
   **/
  static _countNumberOfLinebreaksInEditableDivUntilCursorPosition(editableDiv){
    let nodelist = editableDiv.childNodes;
    let currentDiv = this.getNodeAroundCursorPos ();
    let numNodes = this._countNumNodesUntilCursorInEditableDiv (nodelist, currentDiv);

    return numNodes;
  }

  // --------------------------------------------------------

  /**
   *  Tells in which node of `nodelist` `targetNode` resides
   *
   *  Return:
   *     success: Index of immediate child node
   *     fail: -1 (cursor does not reside within `editableDiv`'s Node tree
   *
   *  E.g.
   *    nodelist:
   *        <div></div>
   *        <div>targetNode</div>
   *        <div></div>
   *
   *    =>   return 1
   *
   *
   *    nodelist:
   *        <div></div>
   *        <div>some text <span>targetNode</span></div>
   *        <div></div>
   *    =>   return 1
   *
   *  Constraints:
   *    Elements, that are nested more than 1000 floors deep are
   *     not considered
   **/
  static _countNumNodesUntilCursorInEditableDiv (nodelist, targetNode)
  {
    const EMERGENCY_STOP = 1000;
    let numNodes = -1;
    for (let i = 0; i < EMERGENCY_STOP; ++i){
      numNodes = Array.from(nodelist).indexOf (targetNode);
      if (numNodes >= 0) {
        return numNodes;
      }
      targetNode = targetNode.parentNode;
    }
    console.warn ("Nesting level too deep.");
    return -1
  }

  // --------------------------------------------------------

}
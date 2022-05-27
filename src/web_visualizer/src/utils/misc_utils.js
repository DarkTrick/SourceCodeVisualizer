require ("./std.js");
require ("../highlightjs/highlight.min.js");

/**
 *  All utils functions, that did not receive a dedicated file for them
 **/

// ============================================================================

class VsCode
{
  static position_sum(vscode_pos1, vscode_pos2)
  {
    let newPos = {
                  "line": vscode_pos1.line + vscode_pos2.line,
                  "character": vscode_pos2.character
                };

    // only add column pos, if necessary
    if (vscode_pos2.line == 0)
      newPos.character += vscode_pos1.character;

    return newPos;
  }
}


// ============================================================================



class Canvas
{
  /**
   * Does not beginPath()/stroke().
   * created by Titus Cieslewski, dota2pro @ stackoverflow
   **/
  static construct_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  }

  static draw_arrow(context, fromx, fromy, tox, toy){
    context.beginPath ();
    this.construct_arrow(context, fromx, fromy, tox, toy);
    context.stroke ();
  }
}


// ============================================================================


/**
 * Setup the `element` to allow a mouse click-and-drag
 *  to move the `moving Anchor` around
 *
 * `element` is the element for initiating the drag
 *           ( where mouse clicks / touches happen)
 * `anchor` is the element that's moved by
 *           mouse movement.
 **/

function setup_mouse_dragElement(element, movingAnchor)
{

  movingAnchor.style.position = "absolute";
  let start_x = 0;
  let start_y = 0;
  let f_mousemove = function(event)
    {
      delta_x = event.x - start_x;
      delta_y = event.y - start_y;

      movingAnchor.style.left = movingAnchor.offsetLeft + delta_x + "px";
      movingAnchor.style.top  = movingAnchor.offsetTop + delta_y  + "px";

      start_x = event.x;
      start_y = event.y;
    }


    element.addEventListener ("mousedown", e => {
      start_x = e.x;
      start_y = e.y;

      document.addEventListener ("mousemove", f_mousemove);
    });

    document.addEventListener ("mouseup", e => {
      document.removeEventListener ("mousemove", f_mousemove);
    });

}


class SyntaxHighlighter
{
  /**
   * Creates a syntax-highlighted(/annotated) version
   *  of `strSource`.
   * If `strLanguage` is empty, the used programming
   *  language for highlighting will be infered auto-
   *  matically
   *
   * Returns:
   *   String with Highlighted syntax
   **/
  static run (strSource, strLanguage = "")
  {
    let hightlighted = "";
    try {
      if ("" == strLanguage)
        hightlighted = hljs.highlightAuto (strSource).value
      else
        hightlighted = hljs.highlight (strSource, {language: strLanguage}).value
    }
    catch(error)
    {
      hightlighted = hljs.highlightAuto (strSource).value;
    }

    return hightlighted;
  }
}



/**
 * Get the size rect (BoundingClientRect) of an
 *  element, that is not already inside the DOM.
 *
 * Use ONLY on elements without a parent!
 * Because at the end of the function the
 * element will have no parent anymore.
 **/
function getSizeRectOfUnownedElement(domElement)
{
  // constraint
  if (null != domElement.parentNode ||
      undefined != domElement.parentNode)
  {
    console.error ("getSizeRectOfUnownedElement was called on an object already owned");
    return domElement.getBoundingClientRect ();
  }

  // setup
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.display = "block";

  div.appendChild (domElement);
  document.body.appendChild (div);

  // run
  let rect = domElement.getBoundingClientRect ();

  // cleanup
  document.body.removeChild (div);
  div.removeChild (domElement);

  return rect;
}


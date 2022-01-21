/**
 * This module defines all function, that should actually be inside
 * the std library of Javascript.
 **/


/**
 * shortcut for creating a DOM element and
 * instantly adding it to parent
 **/
function createElement(parent, type)
{
  let e = document.createElement (type);
  parent.append (e);
  return e;
}


function isObject (obj){
  return (obj != undefined) && (obj != null);
}


/**
 * Convert `value` to TextNode, if it's a string
 **/
function ensureDOMObj (value){
  let node = value;
  if (node.constructor === "".constructor)
      node = document.createTextNode (node);
  return node;
}



class Integer{
  static isInt(value){
    return value === parseInt(value, 10);
  }
}



/**
 *  @brief : Enable a "remove" method on Arrays
 *  @return: true,  if element was found and removed
 *           false, if element was not found and (therefore) not removed
 **/
Array.prototype.remove = function(element){
  let index = this.indexOf(element);
  if (index > -1) {
    this.splice(index, 1);
    return true;
  }
  return false;
};



/**
 * In VSCode, string does not implement replaceAll
 *  implement it here
 **/
if (!isObject (String.prototype.replaceAll))
{
  String.prototype.replaceAll = function (searchValue, replaceValue){
    return this.split(searchValue).join(replaceValue);
  };
}

/**
 * Animate movement of a DOM object
 *
 * Param `xySetterFunction_nullable`: callback function.
 *         Structure: func(element,x,y)
 *         Can be used to use a custom x/y-setter function for `elem`.
 *         (Example situation: setting should throw an event)
 **/
function moveAnimated(elem, targetX, targetY, moveTimeMs, xySetterFunction_nullable)
{
  const time_start = Date.now();
  const time_end   = time_start + moveTimeMs;

  let startX = elem.offsetLeft;
  let startY = elem.offsetTop;

  let distX = targetX - startX;
  let distY = targetY - startY;

  let setXY = function(elem,x,y){
    elem.style.left = x + "px";
    elem.style.top  = y + "px";
  };
  if (xySetterFunction_nullable)
    setXY = xySetterFunction_nullable;

  // set final position after time is over
  setTimeout (function()
  {
    clearInterval(id);
    setXY (elem, targetX, targetY);
  }, moveTimeMs);

  let id = setInterval(move, 20); // 20 => 50fps

  function move()
  {
    let time_cur = Date.now();
    let percent_time = (time_cur - time_start) / moveTimeMs;

    /**
     *  The following are examples of different interpolations
     **/

    // linear interpolation
    //let percent_space = percent_time

    // cos interpolation
    //let percent_space = 1-( (1+Math.cos(percent_time*Math.PI))/2 );

    // fade-in to target
    let percent_space = 1-((percent_time-1)*(percent_time-1));

    // fade-out from source
    //let percent_space = ((percent_time)*(percent_time));

    let posX = startX + (distX*percent_space);
    let posY = startY + (distY*percent_space);
    setXY (elem, posX, posY);
  }

}

/**
 * Return val, but
 *         never smaller than `lowerBound`
 *         never higher than `upperBound`
 **/
Math.clamp = function(val, lowerBound, upperBound) {
  return val > upperBound ? upperBound : val < lowerBound ? lowerBound : val;
}


/**
 * Tells, if the element is visible on screen.
 *   The currently used method
 *
 *
 **/
function isVisible(element)
{
  let e = element;

  // Don't use, unless we really need it
  //if (e.style.position == "fixed"){
  //  return (e.style.display == "none");
  //}

  // Don't use this, because the element is technically still there.
  //  ( still takes up space, still allows visible referencing, etc. )
  //  essentially it's a transparency = 100% option;
  //  this is not what we intend to find here
  //if (window.getComputedStyle(e).visibility == "hidden")
  //  return false;

  // This method alone has it's flaws:
  //    - if Browser == Chrome && `e.style.position == fixed`,
  //        it will return something
  //    - if e.visibility = hidden, it will return something
  // details: https://stackoverflow.com/q/19669786/6702598
  return !!(e.offsetParent);
}

/**
 * Return: if set,    first value
 *         otherwise, defaultValue
 **/
function initIfNecessary (nullableValue, defaultValue)
{
  if(!!nullableValue)
    return nullableValue;

  return defaultValue;
}


/**
 * Similar to `getBoundingClientRect`, but also works for
 *  transformed elements; does not take scrolling into account
 * Calculate the offset position of an element on page.
 *
 * Param `parent_nullable`:
 *   If given, the offset will be relative to it.
 *  Parent must be in the hierarchy tree, otherwise
 *   function stops when parent gets null
 *
 **/
function getOffset(element, parent_nullable = null)
{
  let offsetTop  = 0;
  let offsetLeft  = 0;

  while( element && element != parent_nullable)
  {
      offsetTop  += element.offsetTop;
      offsetLeft += element.offsetLeft;
      element = element.offsetParent;
  }

  return {left: offsetLeft, top: offsetTop}
}


function isPointInsideRect (point, rect)
{
  return (point.x >= rect.left
    && point.x <= rect.right
    && point.y >= rect.top
    && point.y <= rect.bottom);
}


function event_preventDefault (event){
  event.preventDefault ();
}


function node_preventContextMenu (domElement)
{
  domElement.addEventListener ("contextmenu", event_preventDefault);
}


function node_scale (domElement, scaleValue)
{
  let style = domElement.style;

  style.mozTransform = "scale(" + scaleValue + ")";
  style.oTransform   = "scale(" + scaleValue + ")";
  style.transform    = "scale(" + scaleValue + ")";
}
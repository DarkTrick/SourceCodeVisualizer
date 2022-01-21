/**
 * Window positioner calculates positions
 *  relative to a given DOM element.
 *
 * --
 *
 *   Newly created windows must be placed somewhere:
 *   - at a default location.
 *    OR
 *  - relative to the window that asked for it.
 *      ( they can have different parents )
 *
 *   This class contains the logic for placing the window
 **/
 class Direction
 {
   static LEFT = "W";
   static RIGHT = "O";
 }

class WindowPositioner
{
  /**
  *  Params:
  *       `parentOfTarget`: is (in general) the `world`.
  *       `domAnchor_nullable`: DOM element, to which the calculated
  *                             position should be relative
  **/
  constructor (parentOfTarget, domAnchor_nullable, anchorOffsetLocation = Direction.RIGHT)
  {
    this._positioningX = 1;

    if (anchorOffsetLocation == Direction.LEFT)
      this._positioningX = -1;

    // default positioning values
    {
      this.defaultWindowDistanceX =  50;
      this.defaultWindowDistanceY = 100;

      this.x = -parentOfTarget.offsetLeft;
      this.y = -parentOfTarget.offsetTop;

      this.moveX ();
    }

    // if there is an anchor, align it relative to it
    if (isObject (domAnchor_nullable))
    {
      let anchor = domAnchor_nullable;
      let rect = getOffset (anchor);

      this.x += rect.left;
      this.y += rect.top;

      if (anchorOffsetLocation == Direction.RIGHT)
        this.x += anchor.offsetWidth;
    }
    // otherwise, move it to default Y-position
    else
    {
      this.moveY ();
    }
  }

  getX(){ return this.x; }
  getY(){ return this.y; }
  moveX(){ this.x += this.defaultWindowDistanceX * this._positioningX; }
  moveY(){ this.y += this.defaultWindowDistanceY }
}
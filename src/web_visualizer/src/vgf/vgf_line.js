require ("./vgf_widget.js");


/**
 * DOM-Objects's width and height cannot be negative (i.e. bottom
 *    right right corner must always be in bottom right).
 * This obj. receives arbitrary coordinates and calculates
 *   left/top/width/height from it.
 *
 **/
class _StartEndGeometrizer
{
  constructor(){
    this.pos = {start: [0,0], end: [0,0]};
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
  };

  /**
   * Positioning functions
   **/
  setStart(x,y){
    this.pos.start[0] = x;
    this.pos.start[1] = y;
    this._adjustGeometry();
  }

  setEnd(x,y){
    this.pos.end[0] = x;
    this.pos.end[1] = y;
    this._adjustGeometry();
  }

  _adjustGeometry(){
    this.left   = Math.min (this.pos.start[0],this.pos.end[0]);
    this.top    = Math.min (this.pos.start[1],this.pos.end[1]);
    this.width  = Math.max (this.pos.start[0],this.pos.end[0]) - this.left;
    this.height = Math.max (this.pos.start[1],this.pos.end[1]) - this.top ;
  }
}

// =============================================================================

const VgfLine = ( function()
{
  let self = new VgfWidget("div");
  self.classList.add ("VgfLine");

  // without padding the line becomes invisible for almost-90-
  //  degree-edge cases
  let PADDING = 1;

  self.constructor = function()
  {
    self._vp_geometrizer = new _StartEndGeometrizer();
    self._vp_color = "#000000";

    // create connection line
    self._vp_canvas = _initCanvas();
    self.appendChild (self._vp_canvas);

    self._vp_geometrizer.setStart (0,0);
    self._vp_geometrizer.setEnd (0,0);
    self._update_canvas();

    return self;
  };

  self.vp_setColor = function(color){
    self._vp_color = color;
  }

  _initCanvas = function(){
    let canvas = document.createElement ("canvas");

    canvas.width = 0;
    canvas.height = 0;

    let cs = canvas.style;
    //cs.backgroundColor = "#00FF00AA";
    cs.position = "absolute";
    cs.top = "0px";
    cs.left = "0px";

    return canvas;
  }


  self.vp_setStart = function(x,y){
    self._vp_geometrizer.setStart (x,y);
    self._update_canvas();
  }

  self.vp_setEnd = function(x,y){
    self._vp_geometrizer.setEnd (x,y);
    self._update_canvas();
  }

  self._update_canvas = function()
  {
    let g = self._vp_geometrizer;
    // update size
    {
      // if w/h == 0 then line would be invisible, so prevent!
      self._vp_canvas.width  =  g.width  + PADDING*2;
      self._vp_canvas.height =  g.height + PADDING*2;

      self._vp_canvas.style.top  = (g.top  - PADDING) + "px";
      self._vp_canvas.style.left = (g.left - PADDING) + "px";
    }

    // draw line
    {
      let x1 = g.pos.start[0] <= g.pos.end[0] ?   0 + PADDING   :    self._vp_canvas.width  - PADDING/2 ;
      let y1 = g.pos.start[1] <= g.pos.end[1] ?   0 + PADDING   :    self._vp_canvas.height - PADDING/2 ;
      let x2 = g.pos.start[0]  > g.pos.end[0] ?   0 + PADDING   :    self._vp_canvas.width  - PADDING/2 ;
      let y2 = g.pos.start[1]  > g.pos.end[1] ?   0 + PADDING   :    self._vp_canvas.height - PADDING/2 ;

      let context = self._vp_canvas.getContext ("2d");
      context.strokeStyle = self._vp_color;
      context.beginPath ();
      context.moveTo(x1,y1);
      context.lineTo(x2,y2);
      context.stroke ();
    }
  }





  return self.constructor();
});

// ======================================================================
// =============================================================================

// ======================================================================
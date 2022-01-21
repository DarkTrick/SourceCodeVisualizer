/**
 *  Adjust z-index of children
 **/
class zIndexManager
{


  constructor(parent) {
    this._parent = parent;
    this._lastZIndex = 0;

    this.initZValues ();
  }


  initZValues()
  {
    let nodes = this._parent.childNodes;

    for (let i=0; i < nodes.length; ++i)
    {
      nodes[i].style.zIndex = i;
    }
  }



  resetChildrensZValues()
  {
    let nodes = this._parent.childNodes;
    this._lastZIndex = nodes.length;

    // sort all children by zIndex in a second Array
    let nodesSort = Array.from (nodes);
    nodesSort.sort (function(a,b)
      {
        let z1 = Number (a.style.zIndex);
        let z2 = Number (b.style.zIndex);
        if (z1 == z2) return 0;

        return z1 > z2 ? 1 : -1;
      });

    // set new z-indices according to that order
    for (let i=0; i < nodesSort.length; ++i)
    {
      nodesSort[i].style.zIndex = i;
    }
  }



  raiseElement(element)
  {
    // reset value, if we went too far
    if (this._lastZIndex >= Number.MAX_SAFE_INTEGER)
      this.resetChildrensZValues(this._parent);

    element.style.zIndex = (++this._lastZIndex);
  }
}
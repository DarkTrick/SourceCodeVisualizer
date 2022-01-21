require ("./vgf_widget.js");

const VgfButtonToggle = (function(stateArray)
{
  let self = new FlatButton();
  self = VgfWidget_createFrom (self);



  self.constructor = function()
  {
    self._vp_toggleStates = [];
    self._vp_toggleState = -1;

    stateArray.forEach ( state => {
      self.vp_addState(state);
    });

    self.vp_onClick();
  }



  self.addEventListener ("click", e=>{self.vp_onClick();});
  self.vp_onClick = function()
  {
    let numStates = self._vp_toggleStates.length;

    self._vp_toggleState = (self._vp_toggleState + 1) %
                            numStates;

    self._vp_changeChaption ();

    // announce toggle
    self.dispatchEvent (new Event("vp_toggled"));
  }



  self._vp_changeChaption = function()
  {
    // remove current child from UI
    if (self.firstChild)
      self.firstChild.remove();

    // add new (stored) child to UI
    let newContent = self._vp_toggleStates[self._vp_toggleState];
    self.appendChild (newContent);
  }




  self.vp_addState = function(element)
  {
    self._vp_toggleStates.push (ensureDOMObj (element));
  }



  self.vp_getState = function(){
    return self._vp_toggleState;
  }



  self.constructor();
  return self;
});



const Button = (function()
{
  let self = document.createElement("button");
  // TODO: remove, when you found a solution
  //      to the problem in chrome, that `click` will not trigger
  //      after re-inserting the window to world.
  /*
  self.addEventListener ("mouseup", e => {
    //e.type = "click";
    //e.stopPropagation();
    //e.preventDefault();
    //console.log("dug: trigger `click`");
    self.dispatchEvent(new Event("click"));
  });//*/

  return self;
});
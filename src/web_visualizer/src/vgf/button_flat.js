require ("button.js");

const FlatButton = (function()
{
  let button = new Button();
  button.classList.add("button_flat");
  return button;
});
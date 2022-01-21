require ("./vgf_expandable.js");
require ("./button_flat.js");
require ("./vgf_button_toggle.js");


/**
 *  Expandable, that always shows content of "title":
 *
 *    [>] [title]
 *
 *    [v] [title]
 *    [         ]
 *    [ content ]
 *    [_________]
 **/
const VgfExpandableWithTitle = (function()
{
  let self = new VgfExpandable();



  self.constructor = function()
  {
    let table = document.createElement ("table");
    self.appendChild (table);

    {
      let titleRow = document.createElement ("tr");
      {
        table.appendChild (titleRow);

        let td_expanderButton = document.createElement ("td");
        titleRow.appendChild (td_expanderButton);
        td_expanderButton.classList.add ("td_expanderButton");
        let expanderButton = _createToggleButton(self);
        self._vp_button_expand = expanderButton;
        td_expanderButton.appendChild (expanderButton);


        let td_title = document.createElement ("td");
        titleRow.appendChild (td_title);
        self.vp_title = td_title;
      }

      let contentRow = document.createElement ("tr");
      {
        table.appendChild (contentRow);

        let td_content = document.createElement ("td");
        td_content.colSpan=2;
        contentRow.appendChild (td_content);
        td_content.appendChild (self.vp_content);
      }
    }

    return self;
  }



  let _createToggleButton = function(self)
  {
    let button = new VgfButtonToggle(["▸", "▾"]);
    button.style.float = "left";

    button.addEventListener ("vp_toggled", e =>
    {
      if (button.vp_getState() == 0)
      {
        self.vp_title.classList.add ("expandable_title_collapsed");
        self.vp_title.classList.remove ("expandable_title_extended");

        self.vp_content.style.display = "none";
      } else
      {
        self.vp_title.classList.add ("expandable_title_extended");
        self.vp_title.classList.remove ("expandable_title_collapsed");

        self.vp_content.style.display = "initial";
      }

      self.vp_childSizeChanged();
      //self.dispatchEvent(new Event("vp_expansionChanged"));
    });

    return button;
  }



  /**
   * Append element to title area
   *
   * Param `value`: string or DOM object
   **/
  self.vp_appendTitle = function(value)
  {
    self.vp_title.append (value);
  }


  self.vp_setTitleFullWidth = function()
  {
    //self.vp_title.style.width = "100%";
  }



  // @override
  self.vp_expand = function()
  {
    if (self._vp_button_expand.vp_getState() == 0)
      self._vp_button_expand.vp_onClick();
  }



  self.constructor();
  return self;
});



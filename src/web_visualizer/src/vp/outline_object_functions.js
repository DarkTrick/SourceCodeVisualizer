/**
 *  Class that contains functions for outline objects, (that come from
 *   the IDE).
 *  It's only functions, because the data itself is defined on IDE-
 *   side.
 **/
class OutlineEntityFunctions {
  constructor() { alert("OutlineEntityFunctions cannot be initialized"); }
  // ------------------------------------------------------
  /**
   *   compares, if the outline objects essentially are the same
   **/
  static equals (obj1, obj2)
  {
    if (   (obj1.CLASS_TYPE == obj2.CLASS_TYPE)
        && (obj1.uri   == obj2.uri)
        && (obj1.totalRange[0].line == obj2.totalRange[0].line)
        && (obj1.totalRange[0].character == obj2.totalRange[0].character)
       )
    {
      return true;
    }

    return false;
  }

  // ------------------------------------------------------

  static debugString(self){
    return ("\n" +
    "  displayText:   " + self.displayText + "\n" +
    "  class type: " + self.CLASS_TYPE + "\n" +
    "  uri     :   " + self.uri + "\n" +
    "  range:      " + JSON.stringify(self.totalRange) + "\n" +
    "\n");

  }

  // ------------------------------------------------------
  static getFilename(self){
    return self.uri;
  }
  // ------------------------------------------------------
  static getPosStart(self){
    return self.displayTextRange[0];
  }
  // ------------------------------------------------------
  static getPosEnd(self){
    return self.displayTextRange[1];
  }
  // ------------------------------------------------------

  // ------------------------------------------------------
}

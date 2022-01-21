require ("outline_object_functions.js");

/**
 *  Basically a window (View model for a window)
 *
 *  This is a pure data structure! No Functions!
 *   (so it can be stored/restored as/from JSON)
 *
 *   Data content of a visualizable entity.
 *   <=> outline object + information where and how to display it
 **/
class SViewEntity{
  constructor(outlineEntity, x, y){
    this.vp_model = outlineEntity;

    this.x = x;
    this.y = y;
  }
}

class SViewEntityFunctions{
  static equalsOutlineEntity (sViewEntity, outlineEntity){
    return OutlineEntityFunctions.equals (sViewEntity.vp_model, outlineEntity);
  }
}
import * as vscode from 'vscode'
import {Range} from 'vscode'
import { range_new } from "../utils";
import { range_fromArray } from "../utils";



// ==================================================================

export abstract class OutlineRange
{
  public CLASS_TYPE: string    = "<NOT SET>";
  public language:   string    = "";
  public uri:        string    = "";
  public parts: OutlineRange[] = [];

  // Range of text that is going to be displayed for this OutlineRange
  public displayTextRange:  null | Range  = null;
  // added by 3rd party extension if needed
  //public displayText: string             = "";

  // enable dynamic extension of properties
  [key: string]: any;

  /**
   * This method is used for object comming back
   * from webview; aparently on the webview `Range`s
   * unfold to arrays
   **/
  public static fromRawObject(rawObject: any){
    let self = rawObject;
    self.displayTextRange = range_fromArray (self.displayTextRange);
    return self;
  }
}

// ==================================================================


/**
 * Subtype of OutlineRange
 **/
export class File extends OutlineRange
{
  public CLASS_TYPE: string  = "File";
}

// ==================================================================

/**
 * Subtype of OutlineRange
 **/
export class Symbol extends OutlineRange
{
  public CLASS_TYPE: string        = "Symbol";
  public kind:       string        = ""; // namespace / class / function

  public totalRange: null | Range  = null;
  public attributes: Attribute[]   = [];
}

// ==================================================================

// ==================================================================

export class Text extends OutlineRange
{
  public CLASS_TYPE = "Text";
}

// ==================================================================

export class Attribute extends Text
{
  public CLASS_TYPE = "Attribute";

  // Arbitrary string. How a `kind` is presented, depends
  //  on the presenter (webview). Unknown types are handled
  //  the same as `generic`
  // Examples: "comment" / "visibility" / "annotation" / "generic"
  public kind: string = "";
}

// ==================================================================
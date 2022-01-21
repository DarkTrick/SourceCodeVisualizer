import * as vscode from 'vscode';
import * as path from 'path';

import * as Outline from "./SymbolDefinition";

export interface VpOutlineProvider
{
  // TODO:future: maybe it's better to use a uri instead of a TextDocument?
  provideRangeOutline(document: vscode.TextDocument,
                      range:    vscode.Range       | null)
    : Promise<Array<Outline.OutlineRange | Outline.Text>>;



  // TODO:future: maybe it's better to use a uri instead of a TextDocument?
  /**
   * The easiest way of implementing this function is to
   * call "vscode.executeDefinitionProvider" and
   * create Outline.Symbol objects from there.
   *
   *  Problems with vscode's definition provider, that must
   *   be addressed in this method:
   *
   *  - Function `range` does not differntiate between entity head
   *    and body.
   *    These ranges have to be figured out here manually.
   *
   *  - vscode LSPs provide the wrong range. It cuts off the comment and
   *        annotation before the function head.
   **/
  provideDefinitionOutline(document: vscode.TextDocument,
                           position: vscode.Position)
    : Promise<Outline.Symbol[]>;


  /**
   *
   **/
  provideDocumentOutline(document: vscode.TextDocument)
    : Promise<Outline.File>;


  /**
   * Provides the symbol that defines the area
   *  at `position`
   **/
  provideLocationDefiner(document: vscode.TextDocument,
                           position: vscode.Position)
    : Promise<Outline.OutlineRange[]>;

}
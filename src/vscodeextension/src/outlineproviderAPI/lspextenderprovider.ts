import * as vscode from 'vscode';
import * as path from 'path';

import * as Outline from './SymbolDefinition';
import {DocumentSymbolX} from './utils/documentsymbolx'


/**
 * Interface for implementing an Outliner with
 *  minimal effort.
 **/
export interface VpLspExtenderProvider
{
  /**
   * Returns a lowercase string stating the
   *  programming language used
   **/
  getLanguageStr(): string;

  /**
   * Check, if the given `position` in `doc` is
   *  already a location with a definition
   *
   * Background:
   *   If cursor is already on a definition, dont use
   *   executeDefinitionProvider because it might bring
   *   you to its parent's definition
   **/
   isDefinition(doc:      vscode.TextDocument,
              position: vscode.Position): boolean;

  /**
   * VSCode's LSP does not differentiate between entity head
   * and entity body (entity ∈ {namespace, class, method, ....}).
   *
   * This function will find the range for head and body
   *
   * Returns:
   *  [rangeHead, rangeBody, Outline.Attributes]
   **/
  getLanguageSpecificSymbolInformation(document:  vscode.TextDocument,
                                       docSymbol: vscode.DocumentSymbol)
        : any[];



  /**
   * Provide full-depths outline of range
   *
   * @param code: TODO: should be an object where lines can be fetched; something like a vscode.document
   *              Should not be vscode.TextDocument, because it then becomes
   *              untestable.
   * @return
   *
   **/
   provideOutlineForRange(document: vscode.TextDocument,
                          range: vscode.Range)
    : Promise<Array<Outline.Symbol | Outline.Text>>;
}
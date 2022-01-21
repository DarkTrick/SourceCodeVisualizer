/**
 * Provides outlining information based on Language Service Providers
 *                                ( = no language specific code here )
 * The ultimate goal is to keep language specific code as small as possible for parsing
 **/

import * as Outline from '../SymbolDefinition';
import * as vscode from 'vscode'
import * as utils from '../../utils';
import { VpOutlineProvider } from '../outlineprovider';
import { VpLspExtenderProvider } from '../lspextenderprovider';
import { DocumentSymbolX } from './documentsymbolx';

export class OutlineUtils {


  /**
   * Calls "vscode.executeDefinitionProvider" and smoothens out the
   * return type (because "vscode.executeDefinitionProvider" itself has
   * 5 different return types
   **/
  public static async vscode_executeDefinitionProvider (uri: vscode.Uri, position: vscode.Position)
  : Promise <vscode.Location[]>
  {
    let result = await vscode.commands.executeCommand (
      "vscode.executeDefinitionProvider", uri, position);

    if (undefined == result || null == result)
      return [];

    if (result instanceof vscode.Location)
      return [result];

    if (Array.isArray(result))
    {
      if (0 == result.length)
        return result;

      let elem = result[0];
      if (elem instanceof vscode.Location)
      {
        return result;
      }
      // vscode does not understand the type vscode.LocationLink
      // even though, that's the one returned to us, so we try
      //  to catch it by this else case here
      else
      {
        let locArray = this.convert_LocationLinkArray_to_LocationArray (result);
        return locArray;
      }
    }

    return [];
  }


  private static convert_LocationLinkArray_to_LocationArray (locationLinkArray: any[])
    : vscode.Location[]
  {
    let ret: vscode.Location[] = [];
    for (let i = 0; i < locationLinkArray.length; ++i)
    {
      let e = locationLinkArray[i];
      let range = e.targetSelectionRange;
      // in some situations (e.g. outline of constructor in typescript)
      //  `targetSelectionRange` is undefined. We're trying to solve
      //  it this way.
      if (!range)
        range = e.originSelectionRange;

      let loc = new vscode.Location (e.targetUri, range);
      ret.push (loc);
    }
    return ret;
  }



  public static getDocumentSymbols(uri: vscode.Uri)
  {
    let documentSymbols = vscode.commands.executeCommand<vscode.DocumentSymbol[]> (
                            "vscode.executeDocumentSymbolProvider", uri);
    return documentSymbols;
  }



  public static async getDocumentSymbolsInRange (uri:   vscode.Uri,
                                          range: vscode.Range)
  {
    // setup
    const symbols = await OutlineUtils.getDocumentSymbols (uri);
    let symbolsInRange: vscode.DocumentSymbol[] = [];

    // run
    if(Array.isArray (symbols))
    {
      symbols.forEach (symbol =>
      {
        if (utils.check_rangeIntersect (range, symbol.range))
          symbolsInRange.push (symbol);
      });
    }

    // finish
    return symbolsInRange;
  }



  private static async _getFlatDocumentSymbols(uri: vscode.Uri)
  {
    let symbols = null;
    symbols = await OutlineUtils.getDocumentSymbols (uri);

    let flatSymbolList:vscode.DocumentSymbol[] = [];
    {
      if(Array.isArray (symbols))
      while (true){
        // stop if finished
        if (symbols.length == 0) break;

        // "item = worklist.pop()"
        let symbol = symbols[0];
        symbols.splice(0,1);
        flatSymbolList.push (symbol);

        // find new children
        for (let i = symbol.children.length-1; i >=0; --i)
        {
          let child = symbol.children[i];
          symbols.unshift (child);
        }
      }
    }
    return flatSymbolList;
  }



  public static async getDocumentSymbolAtPosition(uri: vscode.Uri, startPos: vscode.Position)
               : Promise<vscode.DocumentSymbol | null>
  {
    // Algorithm: simple linear search algorithm
    //             TODO:speed: create binary search

    let flatSymbolList = await OutlineUtils._getFlatDocumentSymbols (uri);
    {
      // loop reverse, because most detailed range comes last
      for (let i = flatSymbolList.length - 1; i>=0; --i)
      {
        let symbol = flatSymbolList[i];
        let symbolRange: vscode.Range = symbol.range;
        if (symbolRange.start.line      <= startPos.line &&
            symbolRange.start.character <= startPos.character &&
                                           startPos.line      <= symbolRange.end.line
                                           )
        {
          return symbol;
        }
      }
    }
    return null;
  }



  public static async provideRangeOutline(provider: VpLspExtenderProvider,
                                          document: vscode.TextDocument,
                                          range:    vscode.Range | null)
               : Promise<Array<Outline.Symbol | Outline.Text>>
  {
    if(range == null){
      let idxLastLine = document.lineCount-1;
      range = utils.range_new (0, 0, idxLastLine, document.lineAt (idxLastLine).text.length-1);
    }
    let tmp = await provider.provideOutlineForRange (document, range);
    return tmp;
  }



  /**
   * Retrieve the ranges of the definition, that belogs to the
   *  function at location `uri::position`
   *
   * Returns:
   *  - null <=> Nothing found
   *  - Location with range around the whole block:
   *
   *  ▸function asdf(){
   *
   *  }◂
   *
   **/
  private static async _getDefinitionRanges(
                      provider: VpLspExtenderProvider,
                      uri:      vscode.Uri,
                      position: vscode.Position)
                      : Promise<null | DocumentSymbolX[]>
  {
    // NOTE: keep `provider` in interface, in case we find out,
    //       that we need it for this processing here!

    let locations = await this.vscode_executeDefinitionProvider (uri, position);

    let documentSymbolLocations: DocumentSymbolX[] = []
    for (let i = 0; i<locations.length; ++i)
    {
      let location = locations[i];
      let uri = location.uri;
      let docSym = await this.getDocumentSymbolAtPosition (uri, location.range.start);
      if (null == docSym)
        continue;

      let docSymX = new DocumentSymbolX (docSym, uri);
      documentSymbolLocations.push (docSymX);
    }
    return documentSymbolLocations;
  }



  /**
   * @param definitionLocation: always surrounds only one single symbol and
   *         nothing else
   **/
  private static async _provideSymbolDefinitionOutline (
                document: vscode.TextDocument,
                documentSymbolX: DocumentSymbolX,
                provider: VpLspExtenderProvider)
                : Promise<Outline.Symbol | null>
  {
    // Outline that range (Result: one outlined symbol)

    let filepath = documentSymbolX.uri.toString ()
    let symbol: Outline.Symbol
        = this.documentSymbol2outlineSymbol (document, documentSymbolX, provider);

    symbol.uri = filepath ;

    return symbol;
  }



  /**
   *
   *
   **/
  private static _provideOutlineForRange (document: vscode.TextDocument,
                                          range:    vscode.Range,
                                          documentSymbolsInRange: vscode.DocumentSymbol[],
                                          provider: VpLspExtenderProvider)
    : Outline.OutlineRange[]
  {
    // documentSymbolsInRange are sorted alphabetically.
    //  we need to sort them by position
    utils.documentSymbolArray_sortByRange (documentSymbolsInRange);

    let parts: any = [];

    let code = (function(line: number){
      return document.lineAt (line).text;
    });


    // loop running data
    let lastRange = utils.range_new (0,0,range.start.line,range.start.character);
    let childIdx = 0;

    while (true)
    {
      let text = new Outline.Text();
      text.language = provider.getLanguageStr ();
      let text_start_line = lastRange.end.line;
      let text_start_char = lastRange.end.character;

      // cut away empty area after last child (/range)
      if (code(text_start_line).substr(text_start_char).trim() == ""){
        text_start_line++;
        text_start_char = 0;
      }

      // next child exists
      if (childIdx <= documentSymbolsInRange.length-1)
      {
        let childSymbol = documentSymbolsInRange[childIdx];

        // do not process the following symbols
        if (childSymbol.kind == vscode.SymbolKind.Property
            || childSymbol.kind == vscode.SymbolKind.Field
            || childSymbol.kind == vscode.SymbolKind.Variable
            || childSymbol.kind == vscode.SymbolKind.Constant
            || childSymbol.kind == vscode.SymbolKind.String
            || childSymbol.kind == vscode.SymbolKind.Number
            || childSymbol.kind == vscode.SymbolKind.Boolean
            || childSymbol.kind == vscode.SymbolKind.Array
            || childSymbol.kind == vscode.SymbolKind.Object
            || childSymbol.kind == vscode.SymbolKind.Key
            || childSymbol.kind == vscode.SymbolKind.Null
            || childSymbol.kind == vscode.SymbolKind.EnumMember
            || childSymbol.kind == vscode.SymbolKind.Event
            || childSymbol.kind == vscode.SymbolKind.Operator
            || childSymbol.kind == vscode.SymbolKind.TypeParameter
            || (childSymbol.kind == vscode.SymbolKind.Function
                && childSymbol.name.indexOf (") callback") > -1)
            )
        {
          ++childIdx;
          continue;
        }


        // add raw code area
        if (childSymbol.range.start.line != 0)
        {
          let text_end_line = childSymbol.range.start.line;
          let text_end_char = childSymbol.range.start.character;

          // cut away indentation of next childSymbol
          if (code (text_end_line).substring (0, text_end_char).trim() == ""){
            text_end_line--;
            text_end_char = code (text_end_line).length;
          }

          text.displayTextRange = utils.range_new (text_start_line, text_start_char,
                                                  text_end_line, text_end_char);
          if (this._shouldAddTextOutline (document, text))
            parts.push (text);
        }

        // add childSymbol
        {
          lastRange = childSymbol.range;

          // TODO:optimize: just extract entity head ( not the full definition )
          let docSymX = new DocumentSymbolX (childSymbol, document.uri);
          let childOutline = this.documentSymbol2outlineSymbol (document, docSymX, provider);
          parts.push (childOutline);

          ++childIdx;
        }
      }
      // no next childSymbol
      else
      {
        text.displayTextRange = utils.range_new (text_start_line, text_start_char,
                                                  range.end.line,
                                                  range.end.character) ;
        if (OutlineUtils._shouldAddTextOutline (document, text))
        parts.push (text);
        break;
      }
    }

    return parts;
  }



  public static async provideDocumentOutline(
                  provider: VpLspExtenderProvider,
                  document: vscode.TextDocument)
                : Promise <Outline.File>
  {
    // prepare return value
    let filesymbol: Outline.File = new Outline.File ();
    filesymbol.uri = document.uri.toString ();
    filesymbol.language = provider.getLanguageStr();

    let documentSymbols = await this.getDocumentSymbols (document.uri);
    if (!documentSymbols) documentSymbols = [];

    filesymbol.parts = this._provideOutlineForRange (
                      document,
                      utils.document_getRange (document),
                      documentSymbols,
                      provider);

    return filesymbol;
  }



  public static async provideDefinitionOutline(
                  provider: VpLspExtenderProvider,
                  document: vscode.TextDocument,
                  position: vscode.Position)
                : Promise<Outline.Symbol[]>
  {
    let symbols: Outline.Symbol[] = [];

    // let LSP provide range of possible functions
    let docSymbolXArr: null | DocumentSymbolX[];
    docSymbolXArr  = await OutlineUtils._getDefinitionRanges (provider, document.uri, position);


    // TODO: vscode LSPs provide the wrong range. They cut off the comment and
    //       annotation before the function head. Todo: take it into account and
    //       enlarge the range.


    // 2) Outline all found definitions
    if (docSymbolXArr)
    {
      // array.forEach-function does not work here! It would cause symbols to be empty
      for (let i=0; i<docSymbolXArr.length; ++i){
        let docSymX: DocumentSymbolX = docSymbolXArr[i];
        let document = await vscode.workspace.openTextDocument (docSymX.uri);
        if (!document)
          throw new Error ("The following document could not be opened:\n" + docSymX.uri);

        let symbol = await this._provideSymbolDefinitionOutline(document, docSymX, provider);
        if (symbol)
          symbols.push (symbol);
      }
    }

    return symbols;
  }



  public static _getParentSymbolRecursive (parents: vscode.DocumentSymbol[],
                                           children: vscode.DocumentSymbol[],
                                           position: vscode.Position): any
  {
    for (let i=0; i<children.length; ++i)
    {
      let child = children[i];
      if (utils.range_contains (child.range, position))
      {
        parents.push (child);
        return this._getParentSymbolRecursive (parents, child.children, position);
      }
    }

    const levelsReturn = 2;
    if (parents.length < levelsReturn)
      return null;
    return parents[parents.length-levelsReturn];
  }



  public static async provideLocationDefiner(
    provider: VpLspExtenderProvider,
    document: vscode.TextDocument,
    position: vscode.Position)
  : Promise <Outline.OutlineRange[]>
  {
    let symbols = await this.getDocumentSymbols (document.uri);

    // no symbols? return whole file, because then it must be
    //             raw text
    if (!symbols)
      return [await this.provideDocumentOutline (provider, document)];

    let parent = this._getParentSymbolRecursive ([], symbols, position);

    // if no parent was set, the file itself is the parent
    if (!parent)
      return [await this.provideDocumentOutline (provider, document)];

    let parentX = new DocumentSymbolX (parent, document.uri);
    return [this.documentSymbol2outlineSymbol (document, parentX, provider)];
  }



  /**
   * Create a Outline.Symbol from a vscode.DocumentSymbol
   **/
  public static documentSymbol2outlineSymbol(document: vscode.TextDocument,
                                            docSymX: DocumentSymbolX,
                                            provider: VpLspExtenderProvider)
                                              : Outline.Symbol
  {
    let docSymbol = docSymX.documentSymbol;
    let uri = docSymX.uri;

    if (uri.toString () != document.uri.toString ())
      throw new Error ("Programming error: documentSymbol2outlineSymbol(): \n" +
                       "document uri and document symbol uri do not match");

    let symbol: Outline.Symbol = new Outline.Symbol ();

    symbol.language = provider.getLanguageStr ();
    symbol.kind = utils.vscodeSymbolKind2String (docSymbol.kind);
    symbol.totalRange = docSymbol.range;
    symbol.uri = uri.toString ();

    let ranges = provider.getLanguageSpecificSymbolInformation (document, docSymbol);
    let range_head = ranges[0];
    let range_body = ranges[1];
    let attributes = ranges[2];

    symbol.displayTextRange = range_head;
    symbol.attributes = attributes;

    symbol.parts = this._provideOutlineForRange (
                              document,
                              range_body,
                              docSymbol.children,
                              provider);

    return symbol;
  }



  /**
   * Decide whether or not a Text Outline is worth adding to the model.
   *  (e.g. completely empty passages might not be worth adding)
   **/
  private static _shouldAddTextOutline (document: vscode.TextDocument,
                                      textoutline: Outline.Text): boolean
  {
    if (!textoutline.displayTextRange) {
      return false;
    }

    let codeBlock = document.getText (textoutline.displayTextRange).replace ("\n", "");
    return (codeBlock.trim() != "");
  }

}
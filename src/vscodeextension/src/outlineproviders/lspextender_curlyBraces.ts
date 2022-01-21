import * as vscode from 'vscode';
import {VpLspExtenderProvider} from '../outlineproviderAPI/lspextenderprovider';
import * as Outline from '../outlineproviderAPI/SymbolDefinition';
import * as utils from "../utils";
import {OutlineUtils} from '../outlineproviderAPI/utils/outlineutils';
import {DocumentSymbolX} from './../outlineproviderAPI/utils/documentsymbolx'

/**
 * LspExtenderProvider for languages, that use curly braces
 * as block divider (e.g. typescript, cpp, c, php, java, ...)
 *
 **/
export class VpLspExtenderCurlyBraces
implements VpLspExtenderProvider
{
  _languageStr = "";

  public getLanguageStr(): string{
    return this._languageStr;
  }

  public constructor (languageString: string)
  {
    this._languageStr = languageString;
  }


  public isDefinition(doc:      vscode.TextDocument,
                      position: vscode.Position): boolean
  {
    // TODO: differentiate between reference (func call)
    //       and definition (func definition)
    // AND: this should actually go into VpOutlineProviderWrapper,
    //      but there's more work to do to get it there.
    let line = doc.lineAt (position.line).text.trim();
    return (
      line.indexOf ("function") == 0
      || line.indexOf ("public") == 0
      || line.indexOf ("private") == 0
      || line.indexOf ("protected") == 0
      || line.indexOf ("export") == 0
      || line.indexOf ("class") == 0
      );
  }


  /**
   * Simple implementation to record attributes
   *  only as string (without ranges)
   **/
  private _checkForAttribute(decorations: string,
                             keyword: string,
                             attributes: Outline.Attribute[])
  {
    if (decorations.indexOf (keyword) > -1) {
      let attr = new Outline.Attribute ();
      attr.kind = keyword;
      attributes.push (attr);
    }
  }


  /**
   * < See interface for description >
   **/
  public getLanguageSpecificSymbolInformation(
    document: vscode.TextDocument,
    docSymbol: vscode.DocumentSymbol)
                               : any[]
  {
    const RANGE_START_INDICATOR = "{";
    const RANGE_END_INDICATOR   = "}";
    const STATEMENT_END_INDICATOR   = ";";

    let rangeHead = null;
    let rangeBody = null;
		let attributes: Outline.Attribute[] = [];

    // find entity head end
    //    (entity = function, method, class, namespace, ...)
    {
      let name_start = [docSymbol.selectionRange.start.line,
                        docSymbol.selectionRange.start.character];
      let name_end   = [docSymbol.selectionRange.end.line,
                        docSymbol.selectionRange.end.character];

      // bugfix: constructor does not get visualized
      //         (reason: parser messes up `selectionRange`)
      if (docSymbol.selectionRange.end.line == docSymbol.range.end.line
          && docSymbol.selectionRange.end.character == docSymbol.range.end.character)
      {
        name_end = name_start;
      }

      let head_start = name_start
      let head_end = utils.findInDocument (RANGE_START_INDICATOR, document, name_end);
      let statement_end = utils.findInDocument (STATEMENT_END_INDICATOR, document, name_end);

      // if ";" appears before "{" function head should end here.
      if (statement_end && head_end)
      {
        if ((statement_end[0] < head_end[0])
            || (statement_end[0] == head_end[0]
                && statement_end[1] < head_end[1]))
            head_end = statement_end;
      }

      // if no function head end was found, ...
      if (!head_end)
      {
        // ... try to use statement_end ...
        head_end = statement_end;

        // ... if that doesn't help, throw ...
        if (!head_end)
          throw new Error ("Error: Function not parsable (Could not find head range)(1).");
      }

      rangeHead =  utils.range_new (head_start[0],head_start[1],
                                    head_end[0], head_end[1]);
    }

    // find entity body range
    //    (entity = function, method, class, namespace, ...)
    {
      let body_start_line = rangeHead.end.line;
      let body_start_char = rangeHead.end.character + RANGE_START_INDICATOR.length;
      let body_end_line = docSymbol.range.end.line;
      let body_end_char = docSymbol.range.end.character - RANGE_END_INDICATOR.length;

      // cut away unimportant body start
      {
        let line = document.lineAt (rangeHead.end.line).text.substr (body_start_char)
        if (line.trim () == "") {
          body_start_line++;
          body_start_char = 0;
        }
      }

      // cut away unimportant body end
      {
        let line = document.lineAt (body_end_line).text;
        let check = line.substring (0, body_end_char);
        if (check.trim () == "") {
          body_end_line--;
          line = document.lineAt (body_end_line).text;
          body_end_char = line.length;
        }
      }

      rangeBody =  utils.range_new (body_start_line,
                                    body_start_char,
                                    body_end_line,
                                    body_end_char);
    }

		if (null == rangeBody)
      throw new Error ("Error: Function not parsable (Could not find body range)");


    // find attributes
    {
      let decorationRange = utils.range_new (docSymbol.range.start.line,
                                             docSymbol.range.start.character,
                                             docSymbol.selectionRange.start.line,
                                             docSymbol.selectionRange.start.character);
      let strDecorations = document.getText (decorationRange).replace ("\n", " ");
      let arrDecorations = strDecorations.split (" ");
      for (let i=0; i<arrDecorations.length; ++i)
      {
        let attr = new Outline.Attribute ();
        attr.kind = arrDecorations[i];
        attributes.push (attr);
      }
    }

    return [rangeHead, rangeBody, attributes];
  }




  /**
   * < See interface for description >
   **/
  public async provideOutlineForRange(
                document: vscode.TextDocument,
                symbolRange: vscode.Range)
              : Promise<Array<Outline.Symbol | Outline.Text>>
  {
    let ret:any = [];
    let symbolsInRange = OutlineUtils.getDocumentSymbolsInRange (document.uri, symbolRange);

    throw new Error ("outlines for ranges are not yet implemented");
    return ret;
  }

}

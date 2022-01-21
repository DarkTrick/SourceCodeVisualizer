import * as vscode from 'vscode';
import {VpLspExtenderProvider} from '../outlineproviderAPI/lspextenderprovider';
import * as Outline from '../outlineproviderAPI/SymbolDefinition';
import * as utils from "../utils";
import {OutlineUtils} from '../outlineproviderAPI/utils/outlineutils';
import {DocumentSymbolX} from './../outlineproviderAPI/utils/documentsymbolx'


export class VpLspExtenderPython
implements VpLspExtenderProvider
{
  public getLanguageStr(): string{
    return "python";
  }

  public isDefinition(doc:      vscode.TextDocument,
                      position: vscode.Position): boolean
  {
    return false;
  }


  public getLanguageSpecificSymbolInformation(document:  vscode.TextDocument,
                                              docSymbol: vscode.DocumentSymbol)
                                              : any[]
  {
    const BRACE_O = "(";
    const BRACE_C = ")";
    const COLON   = ":";

    let rangeHead = null;
    let rangeBody = null;
    let attributes: Outline.Attribute[] = [];


    // find head range
    {
      let name_start = [docSymbol.selectionRange.start.line,
                        docSymbol.selectionRange.start.character];
      let name_end   = [docSymbol.selectionRange.end.line,
                        docSymbol.selectionRange.end.character];

      let head_start_line = name_start[0];
      let head_start_char = name_start[1];

      let headEnd = null;
      let braceLoc = utils.findInDocument (BRACE_O, document, name_end);
      let colonLoc = utils.findInDocument (COLON,   document, name_end);

      if (null == colonLoc)
          throw new Error ("Error: Function not parsable (Could not find head range)(3).");

      if (null != braceLoc)
      {
        if (colonLoc[0] > braceLoc[0] ||
             (colonLoc[0] == braceLoc[0] && colonLoc[1] > braceLoc[1]))
        {
          let braceEnd = utils.findInDocument (BRACE_C, document, name_start);
          colonLoc = utils.findInDocument (COLON, document, braceEnd);
        }
      }

      headEnd = colonLoc;


      if (null == headEnd)
          throw new Error ("Error: Function not parsable (Could not find head range)(4).");


      rangeHead =  utils.range_new (head_start_line, head_start_char,
                                    headEnd[0], headEnd[1]);
    }

    // find body range
    {
      let body_start_line = rangeHead.end.line;
      let body_start_char = rangeHead.end.character + COLON.length;
      let body_end_line = docSymbol.range.end.line;
      let body_end_char = docSymbol.range.end.character;

      // cut away unimportant body start
      {
        let line = document.lineAt (body_start_line).text.substr (body_start_char);
        if (line.trim () == "") {
          body_start_line++;
          body_start_char = 0;
        }
      }

      rangeBody =  utils.range_new (body_start_line,
                                    body_start_char,
                                    body_end_line,
                                    body_end_char);
    }

    return [rangeHead, rangeBody, attributes];
  }


  public async provideOutlineForRange(document: vscode.TextDocument,
                                      symbolRange: vscode.Range)
   : Promise<Array<Outline.Symbol | Outline.Text>>
  {
    let ret:any = [];
    let symbolsInRange = OutlineUtils.getDocumentSymbolsInRange (document.uri, symbolRange);

    throw new Error ("outlines for ranges are not yet implemented");
    return ret;
  }


}
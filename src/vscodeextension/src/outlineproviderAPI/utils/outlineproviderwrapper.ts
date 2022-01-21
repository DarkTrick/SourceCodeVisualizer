import * as vscode from 'vscode';
import * as Outline from '../SymbolDefinition';
import * as utils from "../../utils";
import {OutlineUtils} from './outlineutils';
import {VpOutlineProvider} from "../outlineprovider";
import {VpLspExtenderProvider} from "../lspextenderprovider";


/**
 *  Class, that is internally used to wrap an VpLspExtenderProvider
 *  into an VpOutlineProvider
 **/
export class VpOutlineProviderWrapper implements VpOutlineProvider
{
  private lspExtender: VpLspExtenderProvider;

  constructor (lspExtender: VpLspExtenderProvider)
  {
    this.lspExtender = lspExtender;
  }



  /**
   * < See Interface VpOutlineProvider >
   **/
  public provideRangeOutline(document: vscode.TextDocument,
                             range:    vscode.Range       | null)
    : Promise<Array<Outline.OutlineRange | Outline.Text>>
  {
    return OutlineUtils.provideRangeOutline (this.lspExtender, document, range);
  }



  /**
   * < See Interface VpOutlineProvider >
   **/
  public provideDefinitionOutline(document: vscode.TextDocument,
                          position: vscode.Position)
    : Promise<Outline.Symbol[]>
  {
    return OutlineUtils.provideDefinitionOutline (this.lspExtender, document, position);
  }



  /**
   * < See Interface VpOutlineProvider >
   **/
  public provideDocumentOutline(document: vscode.TextDocument)
    : Promise<Outline.File>
  {
    return OutlineUtils.provideDocumentOutline (this.lspExtender, document);
  }


  /**
   * < See Interface VpOutlineProvider >
   **/
  public provideLocationDefiner(document: vscode.TextDocument,
                                position: vscode.Position)
    : Promise<Outline.OutlineRange[]>
  {
    return OutlineUtils.provideLocationDefiner (this.lspExtender, document, position);
  }
}
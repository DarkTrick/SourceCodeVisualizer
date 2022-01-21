import * as vscode from 'vscode'

/**
 *  A `vscode.DocumentSymbol` extended with a uri
 **/
export class DocumentSymbolX
{
  public documentSymbol: vscode.DocumentSymbol;
  public uri: vscode.Uri;

  constructor (docSymbol: vscode.DocumentSymbol,
               uri: vscode.Uri)
  {
    this.documentSymbol = docSymbol;
    this.uri = uri;
  }
}
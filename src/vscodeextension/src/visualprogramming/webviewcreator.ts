import * as vscode from 'vscode';
import { getNonce } from './extensionutils';
import * as path from 'path';

export class WebviewCreator
{
  private constructor(private _context: vscode.ExtensionContext)
  {

  }

  // ------------------------------------------------------------------------

  public static createWebview(context: vscode.ExtensionContext)
  {
    const self = new WebviewCreator (context);

    let tab = self._createNewTabInVsCode ();
    if (tab != null) {
      self._createWebviewContent(tab.webview);
    }

    return tab;
  }
  // ------------------------------------------------------------------------

  private _webviewUri(filename: string, webview: vscode.Webview) {
    return webview.asWebviewUri(this._htmlPath(filename))
  }

  // ------------------------------------------------------------------------

  private _createWebviewContent(webview: vscode.Webview) {
    // Use a nonce to whitelist which scripts can be run (copied from tutorials)
    const nonce = getNonce();

    // get file URI in some formatted way
    const uri_jsFileVsCodeDependencies = this._webviewUri('scriptsVscDependant.js', webview);
    const uri_jsFile = this._webviewUri('web_visualizer.js', webview);
    const uri_cssFile = this._webviewUri('web_visualizer.css', webview);

    // TODO: this content should be read out from FS.
    //       At the moment the code is redundant with the content of  ./media/main.html
    var htmlData = String.raw`
    <!DOCTYPE html>
    <html><head>
      <meta charset="UTF-8"/>
      <title>linesAndDivs</title>
      <script nonce="${nonce}" type="text/javascript" src="${uri_jsFileVsCodeDependencies}"></script>
      <link rel="stylesheet" type="text/css" href="${uri_cssFile}">
      <script nonce="${nonce}" type="text/javascript" src="${uri_jsFile}"></script>
    </head>

    <body  onload="javascript: initSystem();">

    </body>
    </html>`;

    webview.html = htmlData;
  }


  // ------------------------------------------------------------------------

  private _createNewTabInVsCode() {
    let panel = vscode.window.createWebviewPanel(
      'codeVisualizer',  // View Type: used internally in vscode
      'Code Diagram',    // title of tab
      vscode.ViewColumn.One, // "column" = tab
      {
        enableScripts: true // Enable javascript in webview
        // And restrict the webview to only loading content from our extension's `media` directory.
        , localResourceRoots: [this._htmlRoot()]
        , retainContextWhenHidden: true
      }
    );

    return panel;
  }

  // ------------------------------------------------------------------------

  private _htmlRoot() {
    return vscode.Uri.file(path.join(this._context.extensionPath, 'media'))
  }

  // ------------------------------------------------------------------------

  private _htmlPath(filename: string) {
    return vscode.Uri.file(path.join(this._context.extensionPath, 'media', filename))
  }

  // ------------------------------------------------------------------------


}

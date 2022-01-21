import * as vscode from 'vscode';
import {WebviewCreator} from './webviewcreator';
import * as Outline from "../outlineproviderAPI/SymbolDefinition";
import * as utils from '../utils';
import { promises } from 'dns';
import { request } from 'http';

export class VisualizingTab
{
  private readonly _vscodeWindow: any;
  private _context: any;

  // lazy init; use ONLY through getWebviewPanel()
  private __webviewPanel: vscode.WebviewPanel | null = null;

  // -------------------------------------------------------------------------

  public constructor(vscodeWindow:  any,
                     context:       any)
  {
    this._vscodeWindow = vscodeWindow;
    this._context = context;
  }

  // ------------------------------------------------------------------------

  /**
   *  Lazy initialization of webview
   **/
  private getWebviewPanel()
  {
    if (null == this.__webviewPanel) {
      this.__webviewPanel = WebviewCreator.createWebview (this._context);
      this.__webviewPanel.onDidDispose(
          () => { this.__webviewPanel = null; },
          null, this._context.subscriptions
        );
      this.__webviewPanel?.webview.onDidReceiveMessage(message => {
        return this._receiveMessage(message);
      });
    }
    return this.__webviewPanel;
  }

  // -------------------------------------------------------------------------

  /**
   * Visualize definition OF THE BEGINNING of a selection
   **/
  public visualizeCurrentDocument(): void
  {
    // setup
    const activeEditor = this._vscodeWindow.activeTextEditor;
    if (null == activeEditor) {
      this._vscodeWindow.showErrorMessage("Cannot visualize. No document is focussed. Please focus a document.");
    }
    let document   = activeEditor.document;

    // run
    this.visualizeDocument(document);
  }

  // -------------------------------------------------------------------------

  /**
   * Visualize definition OF THE BEGINNING of a selection
   **/
  public visualizeDocumentFromUri(uri: vscode.Uri): void
  {
    // setup
    vscode.workspace.openTextDocument (uri).
    then ( document =>
    {
      if (!document)
      this._vscodeWindow.showErrorMessage("Cannot visualize. No document is focussed. Please focus a document.");

      // run
      this.visualizeDocument(document);
    });
  }

  // -------------------------------------------------------------------------

  public async visualizeDocument(document: vscode.TextDocument)
  {
    // setup
    let requestedId: any = null;
    let outlineFile: Outline.File | undefined = undefined;

    try {
      outlineFile = await vscode.commands.executeCommand <Outline.File>(
                        "vp.executeDocumentDefinitionProvider", document)
    } catch (e) {
      this._vscodeWindow.showErrorMessage(e);
    }

    if (!outlineFile)
    {
      this._vscodeWindow.showErrorMessage("Could not visualize");
      return;
    }

    await this._translate_outlineRanges2outlineEntities ([outlineFile]);

    // run
    this._postOutlineEntities([outlineFile], requestedId);

  }

  // -------------------------------------------------------------------------

  /**
   * Visualize definition OF THE BEGINNING of a selection
   **/
  public visualizeFromCursorPositions(): void
  {
    // setup
    const activeEditor = this._vscodeWindow.activeTextEditor;
    if (null == activeEditor) {
      this._vscodeWindow.showErrorMessage("Cannot visualize. No document is focussed. Please focus a document.");
    }
    let document   = activeEditor.document;
    let selections = activeEditor.selections

    // run
    this._visualizeSelectionInDocument(document, selections);
  }

  // -------------------------------------------------------------------------

  private _visualizeSelectionInDocument(document: vscode.TextDocument,
                                        selections: vscode.Selection[])
  {
    // run
    selections.forEach ( (selection) =>
    {
      let position = selection.start;
      this._getOutlineAndSend (document.uri, position, null);
    });
  }


  // -------------------------------------------------------------------------

  private _receiveMessage(JSONmessage: any)
  {
    // common data
    let requestId = JSONmessage.requestId;
    let type: string = JSONmessage.type
    let data = JSONmessage.data;

    switch (type) {
      case "outline_requestByFilePosition":
        {
          let filename: string = data.uri;
          let position = data.cursorStart;
          this._getOutlineAndSend (vscode.Uri.parse (filename), position, requestId);
        }
        break;
      case "outline_requestLocationDefiner":
        {
          // return the parent entity of a given outlineEntity.
          // IMPORTANT: this will not return a parent class of
          //            a child class. Instead, it will return
          //            the file or namespace the child class
          //            is in.
          let outlineEntity: Outline.OutlineRange = data;
          this._outline_requestLocationDefinerAndSend (outlineEntity, requestId);
        }
        break;
      case "vp_host_openRawSource":
        {
          let outlineEntity: Outline.OutlineRange = Outline.OutlineRange.fromRawObject (data);
          this._showOutlineEntityInRawSource (outlineEntity);
        }
        break;

      default:
    }
    return;
  }

  // ------------------------------------------------------------------------


  private _showOutlineEntityInRawSource (outlineEntity: Outline.OutlineRange)
  {
    vscode.workspace.openTextDocument(vscode.Uri.parse (outlineEntity.uri)).then(doc => {
      vscode.window.showTextDocument(doc).then(editor =>
        {
          if (!outlineEntity.displayTextRange)
            return;

          let rangeStart = outlineEntity.displayTextRange.start;
          let rangeEnd = outlineEntity.displayTextRange.end;

          // Put visible editor range here
          var range = new vscode.Range(rangeStart, rangeEnd);
          editor.revealRange(range);

          // Put a cursor at the beginning of the range
          editor.selections = [new vscode.Selection (rangeStart,rangeStart)];
        });
    });
  }


  // ------------------------------------------------------------------------

  private _getOutlineAndSend(uri: vscode.Uri,
                            position: vscode.Position,
                            requestedId: string | null)
  {
    let self = this;
    let promise = self._getOutlineEntitiesFromPos (uri, position);
    promise.then ( (foundEntities) =>
    {
      self._processFoundOutlineEntities (foundEntities, requestedId);
    });
  }

  // -------------------------------------------------------------------------

  private _processFoundOutlineEntities (foundEntities: any, requestedId: string | null)
  {
    if(!foundEntities)
    {
      foundEntities = [];
    }

    if (foundEntities instanceof Error){
      vscode.window.showErrorMessage(foundEntities.message);
    }
    else
    {
      // send current selection to outliner
      this._postOutlineEntities(foundEntities, requestedId);
    }
  }

  // -------------------------------------------------------------------------

  /**
   *  "LocationDefiner" is in some sense the "parent" of an entity.
   *  File                  <-- "LocationDefiner" of class1, class2
   *    |
   *    |-- class1          <-- "LocationDefiner" of func1, func2
   *    |     |-- func1
   *    |     |-- func2
   *    |
   *    |-- class2
   **/
  private _outline_requestLocationDefinerAndSend(outlineEntity: any,
                                          requestId: string | null)
  {
    let self = this;

    let uri = vscode.Uri.parse (outlineEntity.uri);

    if (!outlineEntity.displayTextRange)
    {
      self._processFoundOutlineEntities ([], requestId);
      return false;
    }

    let position = outlineEntity.displayTextRange[0];


    let promise = self._outline_getLocationDefiner (uri, position);
    promise.then ( (foundEntities) =>
    {
      self._processFoundOutlineEntities (foundEntities, requestId);
    });

    return true;
  }


  // -------------------------------------------------------------------------

  private async _getOutlineEntitiesFromPos(document: vscode.Uri, //vscode.TextDocument,
                                           position: vscode.Position):
    Promise<Outline.OutlineRange[] | Error | undefined>
  {
    let definitionResults = await vscode.commands.executeCommand<Outline.Symbol[]>(
                          "vp.executeDefinitionProvider", document, position);

    // translate
    if (definitionResults){
      return this._translate_outlineRanges2outlineEntities (definitionResults);
    }

    return definitionResults;
  }

  // -------------------------------------------------------------------------

  /**
   *
   **/
  private async _outline_getLocationDefiner(document: vscode.Uri,
                                          position: vscode.Position):
    Promise<Outline.OutlineRange[] | Error | undefined>
  {
    let definitionResults = await vscode.commands.executeCommand<Outline.OutlineRange[]>(
                          "vp.executeLocationDefinerProvider", document, position);

    // translate
    if (definitionResults){
      return this._translate_outlineRanges2outlineEntities (definitionResults);
    }

    return definitionResults;
  }

  // ------------------------------------------------------------------------

  /**
   * OutlineSymbols do not contain strings of their content.
   * OutlineEntities are like OutlineSymbols, but with strings for their content
   **/
  private async _translate_outlineRanges2outlineEntities (outlineRanges: Outline.OutlineRange[])
  {
    for (let i=0; i<outlineRanges.length; ++i){
      let outlineRange: Outline.OutlineRange = outlineRanges[i];
      let doc = await vscode.workspace.openTextDocument ( vscode.Uri.parse (outlineRange.uri));
      _outlineRange2outlineEntity (outlineRange, doc);
    }
    return outlineRanges;

    // ----------

    function _outlineRange2outlineEntity(outlineRange: Outline.OutlineRange,
                                         doc:          vscode.TextDocument)
    {

      if (outlineRange instanceof Outline.Symbol){
        // fill displayText
        if (outlineRange.displayTextRange)
          outlineRange.displayText = doc.getText( outlineRange.displayTextRange );
        else
          outlineRange.displayText = "<UNKNOWN>";
      }
      else
      if (outlineRange instanceof Outline.File){
        outlineRange.displayText = utils.path_getFilename (outlineRange.uri);
      }
      else
      if (outlineRange instanceof Outline.Text){
        let outlineText = outlineRange;

        // fill `displayText`
        outlineText.displayText = "<UNKNOWN>";
        if (outlineText.displayTextRange)
          outlineText.displayText = doc.getText( outlineText.displayTextRange );
      }

      for (let i = 0; i < outlineRange.parts.length; ++i)
      {
        let part = outlineRange.parts[i];
        _outlineRange2outlineEntity (part, doc);
      }
    }
  }

  // ------------------------------------------------------------------------

  private _postOutlineEntities(outlineEntities: Outline.OutlineRange[],
                                requestedId: string | null = null)
  {
    if (0 == outlineEntities.length) {
      this.message_post_error_identifierNotFound(requestedId);
      return false;
    } else {
      this.message_post_visualizeOutline(outlineEntities, requestedId);
      return true;
    }
  }

  // -------------------------------------------------------------------------

  private message_post_visualizeOutline(entities: Outline.OutlineRange[],
    requestedId: string | null = null) {
    this.getWebviewPanel()?.webview.postMessage({
      type: 'visualizeOutline',
      data: entities,
      requestedId: requestedId
    });
  }

  // -------------------------------------------------------------------------

  private message_post_error_identifierNotFound(requestedId: string | null = null) {
    let data = {
      type: "Error",
      title: "Implementation not found",
      message: "Implementation could not be found."
    }

    this.getWebviewPanel()?.webview.postMessage({
      type: 'messageBox',
      requestedId: requestedId,
      data: [data],
    });
  }

  // ------------------------------------------------------------------------

}

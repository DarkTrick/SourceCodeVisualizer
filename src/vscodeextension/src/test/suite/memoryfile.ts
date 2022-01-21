import * as vscode from 'vscode';
import * as path from 'path';

const _SCHEME = "inmemoryfile";

/**
 *  Registration function for In-Memory files.
 *  You need to call this once, if you want to make use of
 *  `MemoryFile`s.
 **/
export function register_memoryFileProvider ({ subscriptions }: vscode.ExtensionContext)
{
  const myProvider = new (class implements vscode.TextDocumentContentProvider
    {
      provideTextDocumentContent(uri: vscode.Uri): string
      {
        let memDoc = MemoryFile.getDocument (uri);
        if (memDoc == null)
          return "";
        return memDoc.read ();
      }
  })();
  subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(
    _SCHEME, myProvider));
}




/**
 *  Management class for in-memory files.
 **/
class MemoryFileManagement
{
  private static _documents: {[key: string]: MemoryFile} = {};
  private static _lastDocId: number = 0;



  public static getDocument(uri: vscode.Uri) : MemoryFile | null
  {
    return MemoryFileManagement._documents[uri.path];
  }



  private static _getNextDocId(): string{
    MemoryFileManagement._lastDocId++;
    return "memfile" + MemoryFileManagement._lastDocId;
  }



  public static createDocument(extension = "")
  {
    let path = MemoryFileManagement._getNextDocId ();

    if (extension != "")
      path += "." + extension;

    let self = new MemoryFile(path);

    MemoryFileManagement._documents[path] = self;

    return self;
  }
}



/**
 * A file in memory
 *
 * Cons:
 *   - LSP commands probably don't work
 **/
export class MemoryFile
{
  /******************
   ** Static Area  **
   ******************/

  public static getDocument(uri: vscode.Uri) : MemoryFile | null {
    return MemoryFileManagement.getDocument (uri);
  }

  public static createDocument(extension = "") {
    return MemoryFileManagement.createDocument (extension);
  }



  /******************
   ** Object Area  **
   ******************/

  public content: string = "";
  public uri: vscode.Uri;

  constructor (path: string)
  {
    this.uri = vscode.Uri.from ({scheme: _SCHEME, path: path})
  }


  public write(strContent: string){
    this.content += strContent;
  }


  public read(): string {
    return this.content;
  }


  public getUri(): vscode.Uri {
    return this.uri;
  }
}



/**
 * A tmp file in memory
 *
 * Careful:
 *   - difficult to close
 *  - on close "save changes?" will be asked
 **/

export class TmpFile
{
  private static _lastDocId: number = 0;
  private static _getNextDocId(): string{
    this._lastDocId++;
    return "tmpfile_" + this._lastDocId;
  }

  public static async createDocument(strContent: string, extension:string = "")
    : Promise<vscode.TextDocument | null>
  {
    let folder = "/tmp"
    let filename = this._getNextDocId ();
    let ext = (extension != "" ? "." + extension : "");


    const newFile = vscode.Uri.parse('untitled:' + path.join(folder, filename + ext));

    {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(newFile, new vscode.Position(0, 0), strContent);

      let success = await vscode.workspace.applyEdit(edit);

      if (!success)
        return null;
    }

    let document = await vscode.workspace.openTextDocument(newFile);
    return document;
  }
}
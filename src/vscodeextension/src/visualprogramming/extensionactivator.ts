import * as vscode from 'vscode';
import * as path from 'path';
import {VisualizingTab} from './visualizer';
//import {OutlinerAdapter} from './outlineradapterinterface';
import * as utils from '../utils';
import * as generic from '../outlineproviderAPI/utils/outlineutils';

// ====================================================================

export function activate(context: vscode.ExtensionContext)
{
  const tab = new VpTabManager (context);
  const register = utils.registerCommand;
  const c = context;

  // Register two commands with same content to allow
  //  different wording depending on where you are
  {
    // visualize symbol at cursor position
    register (c, "code-visualizerzer.visualize",                     () => {tab.visualize ();});
    register (c, "code-visualizerzer.visualize.fromContextMenu",     () => {tab.visualize ();});

    // visualize complete file
    register (c, "code-visualizerzer.visualizeFile",                 () => {tab.visualizeCurrentFile ();});
    register (c, "code-visualizerzer.visualizeFile.fromContextMenu", (uri: vscode.Uri) => {tab.visualizeFile (uri);});
  }

  // return context for auto tests
  return context;
}


// ====================================================================

/**
 * @brief Manages diagram tabs.
 *         E.g. "should open in new diagram?"
 *             "should open in the same diagram?"
 *
 **/
export class VpTabManager
{
  public static readonly viewType = 'codeVisualizer';
  private readonly _context: any;

  // One Visualizer = one tab
  // We store the visualizer to create new visualizations
  //   in the same tab.
  private _visualizingTab: VisualizingTab | null = null;

  //-----------------------------------------------------------------

  public constructor(context: vscode.ExtensionContext)
  {
    this._context = context;
  }

  //-----------------------------------------------------------------

  /**
   * Lazy initialization of the Visalizer
   **/
  public getVisualizer(): VisualizingTab
  {
    if (this._visualizingTab)
      return this._visualizingTab;

    this._visualizingTab = new VisualizingTab(
      vscode.window,
      this._context);

    return this._visualizingTab
  }

  //-----------------------------------------------------------------

  public visualize()
  {
    this.getVisualizer ().visualizeFromCursorPositions ();
  }

  //-----------------------------------------------------------------

  public visualizeCurrentFile()
  {
    this.getVisualizer ().visualizeCurrentDocument ();
  }

  //-----------------------------------------------------------------

  public visualizeFile(uri: vscode.Uri)
  {
    this.getVisualizer ().visualizeDocumentFromUri (uri);
  }

  //-----------------------------------------------------------------

}
// ============================================================================
// ============================================================================
// ============================================================================

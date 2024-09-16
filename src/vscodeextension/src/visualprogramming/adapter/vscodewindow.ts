import * as vscode from 'vscode';
import { ColorThemeKind } from "vscode";

/**
 *
 * Reason for this class:
 * vscode.window is just a namespace ( => cannot be used as type annotation)
 *
 */
export class VsCodeWindow {
  constructor(private _vscodeWindowNamespace: any){
	}

	activeColorTheme(): vscode.ColorTheme  {
		return this._vscodeWindowNamespace.activeColorTheme
	}
}
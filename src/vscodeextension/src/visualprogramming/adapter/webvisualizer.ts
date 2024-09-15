import * as vscode from 'vscode';



/**
 * Provide operations for the interface of the webvisualizer
 */
export namespace WebvisualizerAdapter {

	export enum ThemeKindCssClass {
		Light = "theme-light",
		Dark = "theme-dark",
		HighContrast = "theme-high-contrast"
	}


	/**
	 * Convert vscode-internal color theme kind into a css class
	 *  that's usable by the web visualizer
	 * @param colorThemeKind
	 */
	export function convertColorThemeKindToCssClass(colorThemeKind: vscode.ColorThemeKind): ThemeKindCssClass{

		if (colorThemeKind == vscode.ColorThemeKind.Light)
			return ThemeKindCssClass.Light;

		if (colorThemeKind == vscode.ColorThemeKind.Dark)
			return ThemeKindCssClass.Dark;

		if (colorThemeKind == vscode.ColorThemeKind.HighContrast)
			return ThemeKindCssClass.HighContrast;

		// default
		return ThemeKindCssClass.Light;
	}

}
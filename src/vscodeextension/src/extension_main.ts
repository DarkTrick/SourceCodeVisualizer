import * as vscode from 'vscode';
import * as OutlineProviderAPI  from './outlineproviderAPI/extensionactivator';
import * as DefaultProviders from './outlineproviders/providerregistrer';
import * as VisualizingSystem from './visualprogramming/extensionactivator';

/**
 *   @brief setup extension within vscode
 **/

export function activate (context: vscode.ExtensionContext)
{
  // 1. activate foundation
  OutlineProviderAPI.activate (context);

  // 2. register all default providers
  DefaultProviders.activate (vscode);

  // 3. activate actual system
  VisualizingSystem.activate (context);

  return context;
}

//-----------------------------------------------------------------------------

//export function deactivate() {
//  // this code is called when your extension is deactivated
//}



import {VpLspExtenderCurlyBraces} from './lspextender_curlyBraces';
import {VpLspExtenderPython} from './lspextenderpython';
import {VpLspExtenderProvider} from '../outlineproviderAPI/lspextenderprovider';
import { VpOutlineProvider } from '../outlineproviderAPI/outlineprovider';

//-----------------------------------------------------------------------------

/**
 * Register all providers this extension ships by defaul.
 **/
export function activate(vscode: any)
{
  // register pure `VPOutlineProvider`s
  {
    //registerProvider (vscode, "Python", new VpOutlineProviderPython2 ());
  }

  // register `VP LSP Extender`s
  {
    registerLspExtender (vscode, "Typescript", new VpLspExtenderCurlyBraces ("typescript"));
    registerLspExtender (vscode, "typescriptreact", new VpLspExtenderCurlyBraces ("typescriptreact"));
    registerLspExtender (vscode, "Dart",       new VpLspExtenderCurlyBraces ("dart"));
    registerLspExtender (vscode, "Cpp",        new VpLspExtenderCurlyBraces ("cpp"));
    registerLspExtender (vscode, "C",          new VpLspExtenderCurlyBraces ("c"));
    registerLspExtender (vscode, "Php",        new VpLspExtenderCurlyBraces ("Php"));
    registerLspExtender (vscode, "Javascript", new VpLspExtenderCurlyBraces ("javascript"));
    registerLspExtender (vscode, "Java",       new VpLspExtenderCurlyBraces ("java"));
    registerLspExtender (vscode, "Python",     new VpLspExtenderPython ());
  }
}

//-----------------------------------------------------------------------------

async function registerProvider(vscode: any, language: string, provider: VpOutlineProvider){
  await vscode.commands.executeCommand('vp.registerOutlineProvider', language, provider );
}

//-----------------------------------------------------------------------------

async function registerLspExtender(vscode: any, language: string, provider: VpLspExtenderProvider){
  await vscode.commands.executeCommand('vp.registerLspExtenderProvider', language, provider );
}
//-----------------------------------------------------------------------------

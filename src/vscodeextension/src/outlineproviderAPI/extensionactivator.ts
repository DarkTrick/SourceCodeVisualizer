import * as vscode from 'vscode';
import * as path from 'path';
import {VpOutlineProvider} from "./outlineprovider";
import {VpLspExtenderProvider} from "./lspextenderprovider";
import {LanguageFeatureRegistry} from "./utils/languagefeatureregistry";
import * as Outline from './SymbolDefinition';
import * as utils from '../utils';
import { VpOutlineProviderWrapper } from './utils/outlineproviderwrapper';

//import {PPP} from './ppptest';
//import {TTT} from '../media/globaldatatest.js';

//-----------------------------------------------------------------

/**
 *  Function to activate outliner Api
 *   @brief init extension within vscode.
*          I.e. make API available in VSCode
 **/

export function activate(context: vscode.ExtensionContext)
{
  // IN: document, range
  // OUT: return SymbolDefinition::File
  utils.registerCommand (context, "vp.executeDefinitionProviderForRange", executeDefinitionProviderForRange);

  // IN: uri
  // OUT: return SymbolDefinition::File
  utils.registerCommand (context, "vp.executeDocumentDefinitionProvider", executeDocumentDefinitionProvider);


  // IN:  document, position
  // OUT: returns SymbolDefinition::Array<Symbol>
  utils.registerCommand (context, "vp.executeDefinitionProvider", executeDefinitionProviderForPosition);

  // IN:  document, position
  // OUT: returns SymbolDefinition::Array<Symbol>
  //      ( returns the Symbol, that is defining the symbol at `position`
  utils.registerCommand (context, "vp.executeLocationDefinerProvider", executeLocationDefinerProvider);


  // register outline provider
  utils.registerCommand (context, "vp.registerOutlineProvider", registerProvider);
  utils.registerCommand (context, "vp.registerLspExtenderProvider", registerLspExtenderProvider);
}

//-----------------------------------------------------------------

// State holder
const outlineProviderRegistry = new LanguageFeatureRegistry<VpOutlineProvider>();

//-----------------------------------------------------------------

function _getProvider (document: vscode.TextDocument)
          : VpOutlineProvider | Error
{
  // find language of current document
  let language = document.languageId;

  // get the appropriate provider for language
  let provider = outlineProviderRegistry.get(language);

  if (!provider){
    return new Error ("The detected language (" + language +
               ") is currently not supported." +
               "\nTry to install an extension that " +
               "makes this language available");
  }
  return provider;
}

//-----------------------------------------------------------------

export async function executeDefinitionProviderForPosition(uri: vscode.Uri,
                                                           position: vscode.Position)
      : Promise<Outline.Symbol[]>
{
  let document = await vscode.workspace.openTextDocument(uri);
  return executeDefinitionProviderForPositionOnDocument (document, position).
    then(symbols =>
    {
      return symbols;
    }).catch (err =>
    {
      vscode.window.showWarningMessage (err.message + "\n" + err.stack);
      return err;
    });
}

//-----------------------------------------------------------------

export async function executeLocationDefinerProvider(uri: vscode.Uri,
                                                           position: vscode.Position)
      : Promise<Outline.OutlineRange[]>
{
  let document = await vscode.workspace.openTextDocument(uri);
  let provider = _getProvider (document);

  if (provider instanceof Error) {
    vscode.window.showWarningMessage (provider.message);
    return new Promise (((resolve, reject) => {return [];}));
  }

  let outlineRanges = provider.provideLocationDefiner(document, position);
  return outlineRanges;
}

//-----------------------------------------------------------------

export function executeDefinitionProviderForPositionOnDocument(
              document: vscode.TextDocument,
              position: vscode.Position)
              : Promise<Outline.Symbol[]>
{
  let provider = _getProvider (document);

  if (provider instanceof Error) {
    vscode.window.showWarningMessage (provider.message);
    return new Promise (((resolve, reject) => {return [];}));
  }

  let symbols = provider.provideDefinitionOutline(document, position);
  return symbols;
}


//-----------------------------------------------------------------

/**
 * Provide outline for whole file
 **/
export async function executeDocumentDefinitionProvider(
                  document: vscode.TextDocument)
                  : Promise<Outline.File>
{
  let provider = _getProvider (document);

  if (provider instanceof Error) {
    vscode.window.showWarningMessage (provider.message);
    return new Promise (((resolve, reject) => {return [];}));
  }


  let fileSymbol = provider.provideDocumentOutline(document);

  return fileSymbol;
}


//-----------------------------------------------------------------

async function executeDefinitionProviderForRange(uri: vscode.Uri,
                                                 position: vscode.Position)
              //: Promise<Outline.OutlineInfo[] | Error>
{

  vscode.window.showErrorMessage ("Range visualization is not yet implemented");

  /*let ret: Outline.OutlineInfo[] = []
  let document = await vscode.workspace.openTextDocument(uri);

  // 1. find language of current document
  let language = document.languageId;

  // 2. get the appropriate provider for language
  let provider = outlineProviderRegistry.get(language);

  // 3. execute provider or return null
  if (provider)
  {
    let definitionInfos = await provider.provideDefinitionOutline(document, position);
    definitionInfos.forEach(async (definitionInfo) => {
      let symbol = definitionInfo.symbol;

      let uri = vscode.Uri.file(definitionInfo.uri);
      let doc = await vscode.workspace.openTextDocument (uri);
      let range = symbol.range_body;
      let rangeOutline = provider?.provideRangeOutline (doc, range);
      if (rangeOutline)
        definitionInfo.bodyParts = rangeOutline;
    });
    return ret;
  }

  return new Error ("Detected language (" + language +
                    ") of document is currently not supported." +
                    "\nTry to install an extension that makes this language available");
  */
}

//-----------------------------------------------------------------

function registerProvider(languageId: string, vpOutlineProvider: VpOutlineProvider)
{
  outlineProviderRegistry.register(languageId, vpOutlineProvider);
}

//-----------------------------------------------------------------

/**
 * Wrap VpLspExtenderProvider into a generic VpOutlineProvider and register it
 **/
function registerLspExtenderProvider(languageId: string, vpLspExtenderProvider: VpLspExtenderProvider)
{
  let vpOutlineProvider: VpOutlineProvider = new VpOutlineProviderWrapper (vpLspExtenderProvider);
  outlineProviderRegistry.register(languageId, vpOutlineProvider);
}

//-----------------------------------------------------------------

import * as Outline from '../outlineproviderAPI/SymbolDefinition'
import * as vscode from 'vscode'

/**
 *  Convert:
 *   Outline results to what is sent to webview
 **/
export class OutlineAdapter
{
  public static async getDefinition(fromFile: vscode.Uri,
                                    onPosition:   vscode.Position)
  {
    let definitions: undefined | Outline.Symbol[] = await
                    vscode.commands.executeCommand("vp.executeDefinitionProvider", fromFile, onPosition);

    if (!definitions)
      return [];

    // add strings where ranges were
    {
      definitions.forEach(async definition =>
      {
        if (definition.CLASS_TYPE != "symbol"){
          throw new TypeError("Outliner should return `symbol` objects. " +
                    "Instead it returned a `" + definition.CLASS_TYPE + "` object.");
        }

        // set head text
        definition.displayText = "";

        let uri = vscode.Uri.file(definition.uri);
        let doc = await vscode.workspace.openTextDocument (uri);

        if (definition.displayTextRange)
          definition.displayText = doc.getText (definition.displayTextRange);

        definition.parts.forEach(part =>
        {
          if (part.displayTextRange)
            part.displayText = doc.getText(part.displayTextRange);
        });
      });
    }

    return definitions;
  }
}
import * as vscode from 'vscode';
import { Range, window, Position, Selection } from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import {AssertX as assertx} from '../assert_utils';
import {executeDefinitionProviderForPositionOnDocument} from '../../../outlineproviderAPI/extensionactivator'
import * as utils from '../../../utils'
import {getTestDirPath} from "../../main"
import {MemoryFile} from "../memoryfile"
import { VpLspExtenderCurlyBraces } from '../../../outlineproviders/lspextender_curlyBraces';
import { OutlineUtils } from '../../../outlineproviderAPI/utils/outlineutils';
import { DocumentSymbolX } from '../../../outlineproviderAPI/utils/documentsymbolx';


async function openDocument(filename: string) {

  let testfile = path.resolve(getTestDirPath(), './testfiles', "typescript", filename + ".ts");
  let uri = vscode.Uri.file (testfile);
  let doc = await vscode.workspace.openTextDocument(uri);
  return doc;
}


async function createMemDocument(content: string)
  : Promise<vscode.TextDocument>
{
  let memfile = MemoryFile.createDocument (".ts");
  memfile.write (content);

  let doc = vscode.workspace.openTextDocument (memfile.uri);
  return doc;
}



suite('getLanguageSpecificSymbolInformation()', async () =>
{
  test('01 simple function: ranges check', async () =>
  {
    // setup
    let content =   "function aaa()\n"
                  + "{\n"
                  + "  let a = 5;\n"
                  + "}"
    let doc = await createMemDocument (content);

    let full_range = utils.range_new (0,0,3,1);
    let name_range = utils.range_new(0, 9, 0, 12);
    let symbol = new vscode.DocumentSymbol ("aaa", "",
                                            vscode.SymbolKind.Function,
                                            full_range, name_range) ;

    // run
    let subject = new VpLspExtenderCurlyBraces ("typescript");
    let actual = subject.getLanguageSpecificSymbolInformation (doc, symbol);

    // check
    let actual_rangeHead  = actual[0];
    let actual_rangeBody  = actual[1];

    assertx.range_equals (actual_rangeHead,
                          utils.range_new (0,9,1,0),
                          "function head range");

    assertx.range_equals (actual_rangeBody,
                          utils.range_new (2,0,2,12),
                          "function body range");

  });



  test('08 handle callback functions', async () =>
  {
    // setup
    let content = ""
    + "function aaa()\n"
    + "{\n"
    + "  return funcWithPromise ().\n"
    + "  then(symbols =>\n"
    + "  {\n"
    + "    return symbols;\n"
    + "  }).catch (err =>\n"
    + "  {\n"
    + "    return err;\n"
    + "  });\n"
    + "}\n"
    let doc = await createMemDocument (content);

    let full_range = utils.range_new (0, 0, 10, 1);
    let name_range = utils.range_new (0, 12, 0, 9);
    let symbol = new vscode.DocumentSymbol ("executeDefinitionProviderForPosition", "",
                                            vscode.SymbolKind.Function,
                                            full_range, name_range);
    let child0 = new vscode.DocumentSymbol ("catch() callback", "",
                                            vscode.SymbolKind.Function,
                                            utils.range_new (6, 11, 9, 2),
                                            utils.range_new (6, 11, 9, 2));
    let child1 = new vscode.DocumentSymbol ("then() callback", "",
                                            vscode.SymbolKind.Function,
                                            utils.range_new (3, 6, 6, 2),
                                            utils.range_new (3, 6, 6, 2));
    symbol.children.push (child0);
    symbol.children.push (child1);

    // run
    let subject = OutlineUtils;
    let actual = subject.documentSymbol2outlineSymbol (doc,
                                new DocumentSymbolX (symbol, doc.uri),
                                new VpLspExtenderCurlyBraces ("typescript"));

    // check
    let actual_parts = actual.parts;

    assert.strictEqual (actual_parts.length, 1, "Number of parts");

    let actual_part = actual_parts[0];

    assertx.range_equals (actual_part.displayTextRange,
                          utils.range_new (2,0,9,5),
                          "text range");


  });


  test('08 constructor (total range = selection range)', async () =>
  {
    // setup
    let content = ""
    + "constructor (){\n"
    + "  this.lspExtender = lspExtender;\n"
    + "}\n"

    let doc = await createMemDocument (content);

    let full_range = utils.range_new (0, 0, 2, 1);
    let name_range = utils.range_new (0, 0, 2, 1);
    let symbol = new vscode.DocumentSymbol ("constructor", "",
                                            vscode.SymbolKind.Function,
                                            full_range,
                                            name_range);

    // run
    let subject = new VpLspExtenderCurlyBraces ("typescript");
    let actual = subject.getLanguageSpecificSymbolInformation (doc, symbol);

    // check
    let actual_rangeHead  = actual[0];
    let actual_rangeBody  = actual[1];

    assertx.range_equals (actual_rangeHead,
                          utils.range_new (0,0,0,14),
                          "name range");
    assertx.range_equals (actual_rangeBody,
                          utils.range_new (1,0,1,33),
                          "text range");
  });






  test('08 Case: outline information not in order', async () =>
  {
    // setup
    let content = ""
        + "class AAA\n"
        + "{\n"
        + "  public bb()\n"
        + "  {\n"
        + "    return 5;\n"
        + "  }\n"
        + "\n"
        + "  public aa()\n"
        + "  {\n"
        + "    return 6;\n"
        + "  }\n"
        + "}\n"

    let doc = await createMemDocument (content);

    let symbol = new vscode.DocumentSymbol ("AAA", "",
                                            vscode.SymbolKind.Class,
                                            utils.range_new (0, 0, 11, 1),
                                            utils.range_new (0, 6, 0, 9));
    // child 0 is the one, that's actually later within the code
    let child0 = new vscode.DocumentSymbol ("aa", "",
                                            vscode.SymbolKind.Method,
                                            utils.range_new (7, 2, 10, 3),
                                            utils.range_new (7, 9, 7, 11));
    let child1 = new vscode.DocumentSymbol ("bb", "",
                                            vscode.SymbolKind.Method,
                                            utils.range_new (2, 2, 5, 3),
                                            utils.range_new (2, 9, 2, 11));
    symbol.children.push (child0);
    symbol.children.push (child1);

    // run
    let subject = OutlineUtils;
    let actual = subject.documentSymbol2outlineSymbol (doc,
                                new DocumentSymbolX (symbol, doc.uri),
                                new VpLspExtenderCurlyBraces ("typescript"));

    // check
    let actual_parts = actual.parts;

    assert.strictEqual (actual_parts.length, 2, "Number of parts");


  });



  test('08 Case: In class: method declaration', async () =>
  {
    // setup
    let content = ""
        + "class MyClass\n"
        + "{\n"
        + "  public:\n"
        + "     aa();\n"
        + "}\n"

    let doc = await createMemDocument (content);

    let symbol = new vscode.DocumentSymbol ("AAA", "",
                                            vscode.SymbolKind.Class,
                                            utils.range_new (0, 0, 4, 1),
                                            utils.range_new (0, 6, 0, 13));
    let child0 = new vscode.DocumentSymbol ("aa", "",
                                            vscode.SymbolKind.Method,
                                            utils.range_new (3, 5, 3, 10),
                                            utils.range_new (3, 5, 3, 7));
    child0.detail = "declaration";
    symbol.children.push (child0);

    // run
    let subject = OutlineUtils;
    let actual = subject.documentSymbol2outlineSymbol (doc,
                                new DocumentSymbolX (symbol, doc.uri),
                                new VpLspExtenderCurlyBraces ("typescript"));

    // check
    let actual_parts = actual.parts;
    assertx.range_equals (actual_parts[1].displayTextRange,
                          utils.range_new (3, 5, 3, 9), "displayTextRange of aa()");

  });


  test('08 Case: In class: interface method declaration', async () =>
  {
    // setup
    let content = ""
        + "class MyClass\n"
        + "{\n"
        + "  public:\n"
        + "     virtual aa() = 0;\n"
        + "}\n"

    let doc = await createMemDocument (content);

    let symbol = new vscode.DocumentSymbol ("AAA", "",
                                            vscode.SymbolKind.Class,
                                            utils.range_new (0, 0, 4, 1),
                                            utils.range_new (0, 6, 0, 13));
    let child0 = new vscode.DocumentSymbol ("aa", "",
                                            vscode.SymbolKind.Method,
                                            utils.range_new (3, 5, 3, 22),
                                            utils.range_new (3, 13, 3, 15));
    child0.detail = "declaration";
    symbol.children.push (child0);

    // run
    let subject = OutlineUtils;
    let actual = subject.documentSymbol2outlineSymbol (doc,
                                new DocumentSymbolX (symbol, doc.uri),
                                new VpLspExtenderCurlyBraces ("typescript"));

    // check
    let actual_parts = actual.parts;
    assertx.range_equals (actual_parts[1].displayTextRange,
                          utils.range_new (3, 13, 3, 21), "displayTextRange of aa()");

  });

});
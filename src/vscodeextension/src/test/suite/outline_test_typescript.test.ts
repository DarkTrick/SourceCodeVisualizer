import * as vscode from 'vscode';
import { Range, window, Position, Selection } from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import {AssertX as assertx} from './assert_utils';
import {executeDefinitionProviderForPositionOnDocument} from '../../outlineproviderAPI/extensionactivator'
import * as utils from '../../utils'
import {getTestDirPath} from "../main"
import {MemoryFile} from "./memoryfile"


async function openDocument(filename: string) {

  let testfile = path.resolve(getTestDirPath(), './testfiles', "typescript", filename + ".ts");
  let uri = vscode.Uri.file (testfile);
  let doc = await vscode.workspace.openTextDocument(uri);
  return doc;
}


function createMemDocument(content: string)
{
  let testfile = MemoryFile.createDocument (".ts");
  testfile.write (content);
  return testfile;
}



suite('Parsing Tests: Typescript', async () =>
{

  // Doesn't work, because VSCode is not able to
// properly load and use parsers in test code
/*

  test('01 function range ', async () =>
  {
    // setup
    let doc = await openDocument ("01_function");
    let pos = new vscode.Position(0, 10);

    let expected_range_head = utils.range_new (0,9,0,14);
    let expected_range_body = utils.range_new (1,0,1,11);

    // run
    let actual = await executeDefinitionProviderForPositionOnDocument (doc, pos);

    // test 1: Check symbol itself
    assert.strictEqual (actual.length, 1, "Number of found symbols");
    let outlineSymbol = actual[0];
    assert.strictEqual (outlineSymbol.kind, "function", "symbol kind");
    assertx.range_equals (outlineSymbol.displayTextRange,
                          expected_range_head, "function head range");

    // test 1: Check inner symbols
    let parts = outlineSymbol.parts
    assert.strictEqual (parts.length, 1, "Number of found inner symbols");
    let functionBody = parts[0];
    assert.strictEqual (functionBody.CLASS_TYPE, "Text", "symbol type");
    assertx.range_equals (functionBody.displayTextRange,
                          expected_range_body, "function body range");

  });


  test('03 function calls function', async () =>
  {
    // setup
    let doc = await openDocument ("03_function_calls_function");
    let pos = new vscode.Position(5, 10);

    let expected_range_head = utils.range_new (0,9,0,14);
    let expected_range_body = utils.range_new (1,0,1,11);

    // run
    let actual = await executeDefinitionProviderForPositionOnDocument (doc, pos);

    // test 1: Check symbol itself
    assert.strictEqual (actual.length, 1, "Number of found symbols");
    let outlineSymbol = actual[0];
    assert.strictEqual (outlineSymbol.kind, "function", "symbol kind");
    assertx.range_equals (outlineSymbol.displayTextRange,
                          expected_range_head, "function head range");

    // test 1: Check inner symbols
    let parts = outlineSymbol.parts
    assert.strictEqual (parts.length, 1, "Number of found inner symbols");
    let functionBody = parts[0];
    assert.strictEqual (functionBody.CLASS_TYPE, "Text", "symbol type");
    assertx.range_equals (functionBody.displayTextRange,
                          expected_range_body, "function body range");

  });
*/


});
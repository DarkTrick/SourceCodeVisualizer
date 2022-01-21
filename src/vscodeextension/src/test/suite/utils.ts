import * as vscode from 'vscode';
import * as assert from 'assert';

import { MemoryFile } from './memoryfile';

export async function memoryFile_create (strContent: string,
                                         extension = "")
{
  let memfile = MemoryFile.createDocument (extension);
  memfile.write (strContent);
  let doc = await vscode.workspace.openTextDocument (memfile.getUri ());
  return doc;
}



export async function sleep(ms: number) {
  await _sleep(ms);
}

function _sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export function range_toString(range: vscode.Range | null)
{
  if (null == range)
    return "(null)";

  return "Range (line: " + range.start.line + " char: " + range.start.character
              + " | "
              + "line: " + range.end.line + " char: " + range.end.character
              + ")"
}
import * as vscode from 'vscode';


/**
 * Return:true, if range2 is (even partly) inside range1
 **/
export function check_rangeIntersect(range1: vscode.Range,
                                     range2: vscode.Range)
                : boolean
{
  return (range_contains (range1, range2.start) ||
          range_contains (range1, range2.end  )) ;
}

// ------------------------------------------------------------------------

/**
   * Convert lineNo+offset of a TextDocument into the
   *  character position
   **/
export function textdocument_position2charPosition(
                    document: vscode.TextDocument,
                    lineNr: number,
                    offset: number) : number
{
  let pos = new vscode.Position(lineNr, offset);
  return document.offsetAt (pos);
}

// ------------------------------------------------------------------------

export function textdocument_charPos2position(
                  document: vscode.TextDocument,
                  charPos: number)
{
  return document.positionAt (charPos);
}

// ------------------------------------------------------------------------

/**
 * Register a command in vscode
 **/
export function registerCommand(context: vscode.ExtensionContext, command: string, callback: any)
{
  let disposable = vscode.commands.registerCommand (command,  callback);
  context.subscriptions.push (disposable);
}

// ------------------------------------------------------------------------

export function range_fromArray(array: any[]):
                          vscode.Range
{
  // info: new vscode.Range (array[0], array[1]) fails, as
  //        the elements are not recognized as `Position`s.
  let self = range_new (array[0].line
                        ,array[0].character
                        ,array[1].line
                        ,array[1].character);
  return self;
}

// ------------------------------------------------------------------------

export function range_new(lineNr1: number, pos1: number,
                          lineNr2: number, pos2: number):
                          vscode.Range
{
  return new vscode.Range (
        new vscode.Position (lineNr1, pos1),
        new vscode.Position (lineNr2, pos2));
}

// ------------------------------------------------------------------------

export function range_equals (range1: vscode.Range,
                              range2: vscode.Range): boolean
{
  return (range1.start.line == range2.start.line &&
          range1.start.character == range2.start.character &&
          range1.end.line == range2.end.line &&
          range1.end.character == range2.end.character);
}

// ------------------------------------------------------------------------

export function range_contains (range:    vscode.Range,
                                position: vscode.Position): boolean
{
  if (position.line == range.start.line){
    return position.character >= range.start.character;
  }

  if (position.line == range.end.line){
    return position.character <= range.start.character;
  }

  if (position.line > range.start.line &&
      position.line < range.end  .line)
  {
    return true;
  }

  return false;
}


// ------------------------------------------------------------------------


/**
 * Extract a given vscode.Range from `stringArray`
 **/
export function stringArray_getRange_asArray(stringArray: string[],
                                              range: vscode.Range)
{
  let ret = stringArray.slice (range.start.line, range.end.line + 1);

  ret[0] = ret[0].substr (range.start.character);

  let endIdx = ret.length-1
  ret[endIdx] = ret[endIdx].substring (0, range.end.character);


  return ret;
}



// ------------------------------------------------------------------------

export function vscodeSymbolKind2String(kind: vscode.SymbolKind): string
{
  switch(kind)
  {
    case vscode.SymbolKind.File:          return "file";
    case vscode.SymbolKind.Module:        return "module";
    case vscode.SymbolKind.Namespace:     return "namespace";
    case vscode.SymbolKind.Package:       return "package";
    case vscode.SymbolKind.Class:         return "class";
    case vscode.SymbolKind.Method:        return "method";
    case vscode.SymbolKind.Property:      return "property";
    case vscode.SymbolKind.Field:         return "field";
    case vscode.SymbolKind.Constructor:   return "constructor";
    case vscode.SymbolKind.Enum:          return "enum";
    case vscode.SymbolKind.Interface:     return "interface";
    case vscode.SymbolKind.Function:      return "function";
    case vscode.SymbolKind.Variable:      return "variable";
    case vscode.SymbolKind.Constant:      return "constant";
    case vscode.SymbolKind.String:        return "string";
    case vscode.SymbolKind.Number:        return "number";
    case vscode.SymbolKind.Boolean:       return "boolean";
    case vscode.SymbolKind.Array:         return "array";
    case vscode.SymbolKind.Object:        return "object";
    case vscode.SymbolKind.Key:           return "key";
    case vscode.SymbolKind.Null:          return "null";
    case vscode.SymbolKind.EnumMember:    return "enumMember";
    case vscode.SymbolKind.Struct:        return "struct";
    case vscode.SymbolKind.Event:         return "event";
    case vscode.SymbolKind.Operator:      return "operator";
    case vscode.SymbolKind.TypeParameter: return "typeParameter";
  }
  return "<unknown type>";
}

// ------------------------------------------------------------------------

export function textDocument2stringArray(document: vscode.TextDocument)
{
  return document.getText ().split ("\n");
}

// ------------------------------------------------------------------------


export function strArray_extractRange(codeArray: string[], range: vscode.Range)
{
  let res = codeArray.slice (range.start.line, range.end.line+1);
  return res
}

// ------------------------------------------------------------------------

export function isWhitespace (char: string)
{
  return (" " == char || "\t" == char || "\n" == char);
}


/**
 * find `searchString` in `strArray`
 *
 * Parameters
 *  - `start`: [line, character] where search should be started
 *
 * Returns [line, character]
 **/
export function findInStrArray (searchString: string,
                                strArray: string[],
                                start: number[] | null = null)
                                : number[] | null
{
  if (start == null)
    start = [0,0]
  let startLine = start[0];
  let startChar = start[1];

  if (startLine > strArray.length-1)
    throw new Error("Array bounds exceeded");

  // search first line
  let pos = strArray[startLine].indexOf (searchString, startChar);
  if (pos > -1)
    return [startLine, pos];

  // search rest
  for (let i = startLine+1; i < strArray.length-1; ++i)
  {
    let pos = strArray[i].indexOf (searchString);
    if (pos > -1)
      return [i, pos];
  }

  return null;
}



/**
 * find `searchString` in `document`
 *
 * Parameters
 *  - `start`: [line, character] where search should be started
 *
 * Returns [line, character]
 **/
export function findInDocument (searchString: string,
                                document: vscode.TextDocument,
                                start: number[] | null = null)
                                : number[] | null
{
  const code = (function (lineNr: number){
    return document.lineAt (lineNr).text;
  });

  if (!start)
    start = [0,0]
  let startLine = start[0];
  let startChar = start[1];

  if (startLine > document.lineCount-1)
    throw new Error("Array bounds exceeded");

  // search first line
  let pos = code (startLine).indexOf (searchString, startChar);
  if (pos > -1)
    return [startLine, pos];

  // search rest
  for (let i = startLine+1; i < document.lineCount-1; ++i)
  {
    let pos = code (i).indexOf (searchString);
    if (pos > -1)
      return [i, pos];
  }

  return null;
}



export function document_getRange(document: vscode.TextDocument)
  : vscode.Range
{
  let lastLineIndex = document.lineCount-1;
  let lastLineLength = document.lineAt (lastLineIndex).text.length;

  let documentRange = range_new (0,0, lastLineIndex, lastLineLength);

  return documentRange;
}



export function path_getFilename (strUri: String)
{
  let filename = strUri.replace(/^.*[\\\/]/, '');
  return filename;
}


export function documentSymbolArray_sortByRange (io_array: vscode.DocumentSymbol[])
{
  io_array.sort (function(a,b){
    if ( (a.range.start.line > b.range.start.line)
            || (a.range.start.line == b.range.start.line &&
                a.range.start.character > b.range.start.character))
      return 1;
      return -1;
  });
}



var gTestdata_outlineData = {};

const myfile_py = String.raw`
class MyClass2:

  def foo1b(self):
    """return a string"""
    return g_asString(55)

  def foo2b(self):
    pass

  def foo3b(self, param1: str):
    """vertically long method"""

    foo1b ()

    foo1b ()

    return g_asString(55)
`
gTestdata_outlineData["file:///usr/myfile.py"] = {
  content: myfile_py,
  contentLineBuffer: myfile_py.split("\n"),
  outline: {
    "file:///usr/myfile.py":
    {
      uri: "file:///usr/myfile.py",
      CLASS_TYPE: "File",
      language: "python",
      displayText: "file:///usr/myfile.py",
      parts:[
        {
          CLASS_TYPE: "Text",
          language: "python",
          displayTextRange: [{line: 0, character: 0}, {line: 0, character: 19}],
          displayText: '# MOCK file content'
        }
      ]
    },
    "foo1b":
    {
      uri: "file:///usr/myfile.py",
      CLASS_TYPE: "Symbol",
      language: "python",
      parts:[
        {
          uri: "file:///usr/myfile.py",
          CLASS_TYPE: "Text",
          language: "python",
          displayTextRange: [{line: 4, character: 0}, {line: 6, character: 0}],
          displayText: '    """return a string"""\n    return g_asString(55)'
        }
      ],

      kind: "Function",
      totalRange: [{line: 3, character: 0}, {line: 6, character: 0}],
      attributes: [],
      displayTextRange: [{line: 3, character: 6}, {line: 3, character: 17}],
      displayText: "foo1b(self)",
    },
    "foo3b":
    {
      uri: "file:///usr/myfile.py",
      CLASS_TYPE: "Symbol",
      language: "python",
      parts:[
        {
          uri: "file:///usr/myfile.py",
          CLASS_TYPE: "Text",
          language: "python",
          displayTextRange: [{line: 10, character: 6}, {line: 18, character: 0}],
          displayText: '    """vertically long method"""\n    #with a single line comment a \n    foo1b ()\n\n    foo1b ()\n\n    return g_asString(55)'
        }
      ],

      kind: "Function",
      totalRange: [{line: 10, character: 0}, {line: 18, character: 0}],
      attributes: [],
      displayTextRange: [{line: 10, character: 6}, {line: 10, character: 30}],
      displayText: "foo3b_very_very_very_very_very_very_long(self, param1: str)",
    },
    "wide_function":
    {
      uri: "file:///usr/myfile.py",
      CLASS_TYPE: "Symbol",
      language: "python",
      parts:[
        {
          uri: "file:///usr/myfile.py",
          CLASS_TYPE: "Text",
          language: "python",
          displayTextRange: [{line: 10, character: 6}, {line: 18, character: 0}],
          displayText: '    """horizontally long method asfd asdf asdf asdf 52 asdf veasdf asdf"""\n\n' +
                       '    foo1b ()\n\n' +
                       '    foo1b ()\n\n' +
                       '    return g_asString(55)'
        }
      ],

      kind: "Function",
      totalRange: [{line: 10, character: 0}, {line: 18, character: 0}],
      attributes: [],
      displayTextRange: [{line: 10, character: 6}, {line: 10, character: 30}],
      displayText: "wide_function (self, param1: str, param2, param3, param4, param5, param6, param7)",
    },
  }
};


gTestdata_outlineData["file:///usr/myfile.py"].outline["MyClass2"] =
    {
      uri: "file:///usr/myfile.py",
      language: "python",
      CLASS_TYPE: "Symbol",
      parts:[
        gTestdata_outlineData["file:///usr/myfile.py"].outline["foo1b"],
        gTestdata_outlineData["file:///usr/myfile.py"].outline["foo3b"],
        {
          uri: "file:///usr/myfile.py",
          language: "python",
          CLASS_TYPE: "Symbol",
          parts:[],
          kind: "Function",
          totalRange: [{line: 0, character: 0}, {line: 0, character: 0}],
          attributes: [],
          displayTextRange: [{line: 0, character: 0}, {line: 0, character: 0}],
          displayText: "function_no_impl(self)",
        }
      ],
      kind: "Class",
      totalRange: [{line: 1, character: 0}, {line: 18, character: 0}],
      attributes: [],
      displayTextRange: [{line: 1, character: 6}, {line: 1, character: 14}],
      displayText: "MyClass2",
    };



const myfile_ts_content = String.raw`
class MyClass2 {

  constructor() {
    this.var1 = 1;
    this.var2: number = 2;
  }

  standard_method_definition(a: string, b: number, c: MyClass2) {
    var a = 4;
    let b = 5;
    let c = "hello c";

    let d: str = "hello d";
  }

  /**

  **/
  fat_arrow_defined_function = () => {
    this.standard_method_definition("",1)
    return "hello";
  }
}

function standard_function(): string {
  return "hello"
}

function recursive_function(iterations: number): string {
  if(iterations <= 0)
    return 1
  return 1 + recursive_function(iterations - 1);
}

const fat_arrow_function = (): number => {
  standard_function();
  return recursive_function(28);
}
`
gTestdata_outlineData["file:///usr/myfile.ts"] = {
  content: myfile_ts_content,
  contentLineBuffer: myfile_ts_content.split("\n"),
  outline: {
    "file:///usr/myfile.ts":
    {
      uri: "file:///usr/myfile.ts",
      CLASS_TYPE: "File",
      language: "typescript",
      displayText: "file:///usr/myfile.ts",
      parts:[        ]
    }
  }
};

gTestdata_outlineData["file:///usr/myfile.ts"].outline["constructor"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    {
      uri: "file:///usr/myfile.ts",
      language: "typescript",
      CLASS_TYPE: "Text",
      kind: "Method",
      totalRange: [{line: 3, character: 0}, {line: 6, character: 0}],
      attributes: [],
      displayTextRange: [{line: 3, character: 0}, {line: 6, character: 0}],
      displayText:
                  '    this.var1 = 1;\n' +
                  '    this.var2: number = 2;\n'
    }
  ],
  kind: "Method",
  totalRange: [{line: 3, character: 0}, {line: 6, character: 3}],
  attributes: [],
  displayTextRange: [{line: 3, character: 2}, {line: 6, character: 15}],
  displayText: "constructor()",
}

gTestdata_outlineData["file:///usr/myfile.ts"].outline["standard_method_definition"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    {
      uri: "file:///usr/myfile.ts",
      language: "typescript",
      CLASS_TYPE: "Text",
      kind: "Method",
      totalRange: [{line: 7, character: 0}, {line: 14, character: 0}],
      attributes: [],
      displayTextRange: [{line: 7, character: 0}, {line: 14, character: 0}],
      displayText:
      '  var a = 4;\n' +
      '  let b = 5;\n' +
      '  let c = "hello c";\n' +
      '\n' +
      '  let d: str = "hello d";\n'
    }
  ],
  kind: "Method",
  totalRange: [{line: 7, character: 0}, {line: 15, character: 3}],
  attributes: [],
  displayTextRange: [{line: 8, character: 2}, {line: 13, character: 61}],
  displayText: 'standard_method_definition(a: string, b: number, c: MyClass2)'
}

gTestdata_outlineData["file:///usr/myfile.ts"].outline["fat_arrow_defined_function"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    {
      uri: "file:///usr/myfile.ts",
      language: "typescript",
      CLASS_TYPE: "Text",
      kind: "Method",
      totalRange: [{line: 20, character: 0}, {line: 23, character: 3}],
      attributes: [],
      displayTextRange: [{line: 20, character: 0}, {line: 23, character: 0}],
      displayText:
      '  this.standard_method_definition()\n' +
      '  return "hello";\n'
    }
  ],
  kind: "Function",
  totalRange: [{line: 19, character: 0}, {line: 22, character: 2}],
  attributes: [],
  displayTextRange: [{line: 19, character: 2}, {line: 19, character: 33}],
  displayText: 'fat_arrow_defined_function = ()'
}

gTestdata_outlineData["file:///usr/myfile.ts"].outline["MyClass2"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    gTestdata_outlineData["file:///usr/myfile.ts"].outline["constructor"],
    gTestdata_outlineData["file:///usr/myfile.ts"].outline["standard_method_definition"],
    gTestdata_outlineData["file:///usr/myfile.ts"].outline["fat_arrow_defined_function"],
  ],
  kind: "Class",
  totalRange: [{line: 1, character: 0}, {line: 18, character: 0}],
  attributes: [],
  displayTextRange: [{line: 1, character: 6}, {line: 1, character: 14}],
  displayText: "MyClass2",
};


gTestdata_outlineData["file:///usr/myfile.ts"].outline["recursive_function"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    {
      uri: "file:///usr/myfile.ts",
      language: "typescript",
      CLASS_TYPE: "Text",
      kind: "Function",
      totalRange: [{line: 8, character: 0}, {line: 14, character: 3}],
      attributes: [],
      displayTextRange: [{line: 9, character: 3}, {line: 13, character: 27}],
      displayText:
          'if(iterations <= 0)\n' +
          '  return 1\n' +
          'return 1 + recursive_function(iterations - 1);\n'
    }
  ],
  kind: "Method",
  totalRange: [{line: 8, character: 0}, {line: 14, character: 3}],
  attributes: [],
  displayTextRange: [{line: 9, character: 3}, {line: 13, character: 27}],
  displayText: 'recursive_function(iterations: number): string'
}

gTestdata_outlineData["file:///usr/myfile.ts"].outline["standard_function"] = {
  uri: "file:///usr/myfile.ts",
  language: "typescript",
  CLASS_TYPE: "Symbol",
  parts:[
    {
      uri: "file:///usr/myfile.ts",
      language: "typescript",
      CLASS_TYPE: "Text",
      kind: "Function",
      totalRange: [{line: 8, character: 0}, {line: 14, character: 3}],
      attributes: [],
      displayTextRange: [{line: 9, character: 3}, {line: 13, character: 27}],
      displayText:'return "hello"\n'
    }
  ],
  kind: "Method",
  totalRange: [{line: 8, character: 0}, {line: 14, character: 3}],
  attributes: [],
  displayTextRange: [{line: 9, character: 3}, {line: 13, character: 27}],
  displayText: 'standard_function(): string'
}

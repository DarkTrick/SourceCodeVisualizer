var gTestdata_outlineData = {};

gTestdata_outlineData["file:///usr/myfile.py"] = {content: String.raw`
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
`,
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
gTestdata_outlineData["file:///usr/myfile.py"].contentLineBuffer = gTestdata_outlineData["file:///usr/myfile.py"].content.split("\n");

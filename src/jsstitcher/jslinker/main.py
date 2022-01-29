from jslinker.js_file_stitcher import JsFileStitcher

import sys
import os


class JsStitcherCUI:
  @staticmethod
  def showHelp():
    print("""
 Run: jsstitcher inputfile

 Works like a simplified version of the C++ preprocessor.

  - require ("<file path>");
    Tells jsstitcher to include file content of <file path> into the output.
      E.g.
        fileA:
          require ("fileB.js");

  IMPORTANT:
    Use exaclty the pattern described above:
    - There must be exactly one space before the bracket
    - Use doublequotes ( " ) only - no single quotes
    - There must be a semicolon at the end

  Constraints:
   - Does not solve dependency loops and would run forever then.
      (E.g. A -> B -> C -> A)
    """)

  def _run (self, infile):
    stitcher = JsFileStitcher ([infile])
    result = stitcher.run()
    if (result == True):
      print (stitcher.getStitchedContent ())
    else:
      print (result)

  def run(self,args):
    if (len(args) < 1):
      self.__class__.showHelp()
      return

    infile = args[0]
    os.path.abspath (infile)

    self._run (infile)

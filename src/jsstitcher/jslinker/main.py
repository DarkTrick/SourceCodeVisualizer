from jslinker.js_file_stitcher import JsFileStitcher

import sys
import os


class JsStitcherCUI:
  @staticmethod
  def showHelp():
    print("""
 Usage: jsstitcher inputfile

 Works like a simplified version of the C++ preprocessor.

 Commands within js files:

  //@require: <file path>
    Tells jsstitcher to include file content of <file path> into the output
    file before the following code.

  //@output: <file path>
    Tells jsstitcher where to output the final product.
    - jsstitcher will use only the `output` value of the first given file.
      E.g.
           fileA:                        fileB:
             //@require: fileB             //@output:  b.js
             //@output:  a.js

      jsstitcher fileA   =>  jsstitcher will output to a.js

   - Within the first given file, the last appear will be used.
     E.g.
         //@output: ../script.js
         //@output: ../myoutput.js  =>  output to `../myoutput.js`

 Constraints:
   - Does not solve dependency loops and would run forever then.
      (E.g. A -> B -> C -> A)


    """)

  def _run (self, infile):
    stitcher = JsFileStitcher ([infile])
    result = stitcher.run()
    if (result == True):
      stitcher.persistData()
    else:
      print (result)

  def run(self,args):
    if (len(args) < 1):
      self.__class__.showHelp()
      return

    infile = args[0]
    os.path.abspath (infile)

    self._run (infile)

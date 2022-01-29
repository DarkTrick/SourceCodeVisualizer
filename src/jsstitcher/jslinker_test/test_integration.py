import unittest
import tempfile
from os import path

from jslinker.js_file_stitcher import JsFileStitcher

ENCODING = "utf-8"

class TestIntegration(unittest.TestCase):

  def test_integration(self):
    # ---- setup ----

    # setup output file
    outputFile = tempfile.NamedTemporaryFile()

    # setup input files
    file1 = tempfile.NamedTemporaryFile()
    file2 = tempfile.NamedTemporaryFile()


    file2_filename = str(path.split(file2.name)[1])

    file1Content = 'require ("' + file2_filename + '");\n' + \
                   "content_1"
    file2Content = "content_2"

    file1.write (bytes(file1Content, ENCODING))
    file1.flush()
    file2.write (bytes(file2Content, ENCODING))
    file2.flush()

    expected = "content_2\ncontent_1\n"

    # ---- run ----
    jsStitcher = JsFileStitcher ([file1.name])
    jsStitcher.run()

    # ---- test ----
    actual = jsStitcher.getStitchedContent()

    self.assertEqual (expected, actual)



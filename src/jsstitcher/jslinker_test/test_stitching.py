import unittest
from jslinker_test.data_content_provider_mock import DataContentProviderMock
from jslinker.js_stitcher import JsStitcher



class TestMain_Stitching(unittest.TestCase):

  # ------------------------------------------------------

  def test_error_msg_file_not_found(self):
    # setup
    files = {"/fileA": 'require ("fileB");\n1'}
    dataContentProvider = DataContentProviderMock (files)

    # run
    jsStitcher = JsStitcher (["/fileA"], dataContentProvider)
    actual = jsStitcher.run ()

    # test
    self.assertTrue ("File could not be found" in actual, "\n\nactual: " + actual)
    self.assertTrue ("/fileB" in actual, "\n\nactual: " + actual)

  # ------------------------------------------------------

  def _test_dependencyStitching(self, testcase, files, expected):
    # setup
    dataContentProvider = DataContentProviderMock (files)

    # run
    jsStitcher = JsStitcher (["/fileA"], dataContentProvider)
    jsStitcher.run ()
    actual = jsStitcher.getStitchedContent ()

    # test
    self.assertEqual (expected, actual, testcase)

# ------------------------------------------------------

  def test_A_B(self):
    # setup
    testcase = \
    """
      A -> B
    """
    files = {}
    files["/fileA"] = 'require ("fileB");\n' + \
                     "1"
    files["/fileB"] = "2"

    expected = "2\n1\n"

    # run & test
    self._test_dependencyStitching (testcase, files, expected)


# ------------------------------------------------------

  def test_A_B_C(self):
    # setup
    testcase = \
    """
      A -> B
        -> C
    """
    files = {}
    files["/fileA"] = 'require ("fileB");\n' + \
                     'require ("fileC");\n' + \
                     "1"
    files["/fileB"] = "2"
    files["/fileC"] = "3"

    expected = "3\n2\n1\n"

    # run & test
    self._test_dependencyStitching (testcase, files, expected)



# ------------------------------------------------------

  def test_A_B_C_D_C(self):
    # setup
    testcase = \
    """
      A -> B -> C
        -> C
        -> D
    """
    files = {}
    files["/fileA"] = 'require ("fileB");\n' + \
                      'require ("fileC");\n' + \
                      'require ("fileD");\n' + \
                      "1"
    files["/fileB"] = 'require ("fileC");\n' + \
                      "2"
    files["/fileC"] = "3"
    files["/fileD"] = "4"

    expected = "3\n4\n2\n1\n"

    # run & test
    self._test_dependencyStitching (testcase, files, expected)



# ------------------------------------------------------
import unittest
from jslinker.parse_file_content import ParsedFile
from jslinker.parse_file_content import ParseException


class TestCreateFileFromContent(unittest.TestCase):

  # ------------------------------------------------------------------------

  def test_emptyContent(self):
    # setup
    filecontent = ""

    # run
    file = ParsedFile.newFromContent (filecontent)

    # test
    self.assertEqual (file.content, "", "Empty content should result in an empty file")
    self.assertEqual (len(file.getRelativeDependencies()), 0, "Empty content should have no dependencies")

  # ------------------------------------------------------------------------

  def test_onlyJsContent(self):
    # setup
    filecontent = "random content"

    # run
    file = ParsedFile.newFromContent (filecontent)

    # test
    self.assertEqual (file.content, "random content")

  # ------------------------------------------------------------------------

  def test_keywords_and_content(self):
    # setup
    filecontent = "//@require: foo\n" + \
                  "random content"

    # run
    file = ParsedFile.newFromContent (filecontent)

    # test
    self.assertEqual (file.content, "random content")
    self.assertEqual (file.getRelativeDependencies()[0], "foo")

  # ------------------------------------------------------------------------

  def test_keywordNeverFinishes(self):
    # setup
    filecontent = "//@require foo"

    # run
    try:
      ParsedFile.newFromContent (filecontent)
      self.assertFalse ("An expection shoul've been thrown")
    except:
      pass

  # ------------------------------------------------------------------------

  def test_keywordNeverFinishes_Second(self):
    # setup
    filecontent = "//@require: foo\n" + \
                  "//@require foo2"

    # run
    try:
      ParsedFile.newFromContent (filecontent)
      self.assertFalse ("An expection shoul've been thrown")
    except ParseException as e:
      pass


  # ------------------------------------------------------------------------

class TestCreateFileFromContent_dependencies(unittest.TestCase):
  def _test_dependencies(self, fileContent, expectedDependencies):
    # run
    file = ParsedFile.newFromContent (fileContent)

    # test
    self.assertEqual (file.content, "")

    # test if all expected dependencies are there
    self.assertEqual (len(file.getRelativeDependencies()), len(expectedDependencies))
    for expected in expectedDependencies:
      self.assertTrue (expected in file.getRelativeDependencies())

  # ------------------------------------------------------------------------

  def test_oneDependency(self):
    # setup
    fileContent = "//@require: asdf\n"

    # run & test
    self._test_dependencies (fileContent, ["asdf"])

  # ------------------------------------------------------------------------

  def test_dependency_without_linebreak_at_the_end(self):
    # setup
    fileContent = "//@require: asdf"

    # run & test
    self._test_dependencies (fileContent, ["asdf"])

  # ------------------------------------------------------------------------
  def test_multipleDependency(self):
    # setup
    fileContent = "//@require: dep1\n" + \
                  "//@require: dep2\n" + \
                  "//@require: dep3\n"

    # run & test
    self._test_dependencies (fileContent, ["dep1", "dep2", "dep3"])

  # ------------------------------------------------------------------------

class TestCreateFileFromContent_output(unittest.TestCase):
  def _test_output(self, filecontent, expectedOutfile):
    # run
    file = ParsedFile.newFromContent (filecontent)

    # test
    self.assertEqual (file.content, "")
    self.assertEqual (file.outfile, expectedOutfile)

  # ------------------------------------------------------------------------

  def test_output(self):
    # setup
    filecontent = "//@output: asdf\n"

    # run & test
    self._test_output (filecontent, "asdf")

  # ------------------------------------------------------------------------

  def test_output_twice(self):
    # setup
    filecontent = "//@output: asdf\n" + \
                  "//@output: newOutput\n"

    # run & test
    self._test_output (filecontent, "newOutput")

  # ------------------------------------------------------------------------
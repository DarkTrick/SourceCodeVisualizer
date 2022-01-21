import unittest
import os
from jslinker.parse_file_content import ParsedFile
from jslinker.file import File

class TestDependencyConversionFromRelativeToAbsolute(unittest.TestCase):

  # -----------------------------------------------------------------

  def _test_dependency_same_directory(self, initialPath, dependency, expected):
    parsedFile = ParsedFile()
    parsedFile.dependency_add (dependency)

    #run
    file = File(initialPath, parsedFile)

    #test
    self.assertEqual (file.getDependencies_abs(), [expected])

  # -----------------------------------------------------------------

  def test_dependency_same_directory(self):
    self._test_dependency_same_directory ("/path/to/file", "dep",   "/path/to/dep")
    self._test_dependency_same_directory ("/path/to/file", "foo",   "/path/to/foo")
    self._test_dependency_same_directory ("/path/to/file", "./dep", "/path/to/dep")

  # -----------------------------------------------------------------

  def test_dependency_dir_below(self):
    self._test_dependency_same_directory ("/path/to/file", "../dep", "/path/dep")

  # -----------------------------------------------------------------

  def test_dependency_with_abs_path(self):
    self._test_dependency_same_directory ("/path/to/file", "/abs/path",   "/abs/path")

  # -----------------------------------------------------------------


class TestOutputAbsPathCreation(unittest.TestCase):

  # -----------------------------------------------------------------

  def test_dependency_same_directory(self):
    parsedFile = ParsedFile()
    parsedFile.outfile = "outfile"

    #run
    file = File("/path/to/file", parsedFile)

    #test
    self.assertEqual (file.getOutfile_abs(), "/path/to/outfile")

  # -----------------------------------------------------------------
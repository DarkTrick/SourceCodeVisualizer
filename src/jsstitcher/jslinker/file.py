from os import path
from typing import List

from jslinker.parse_file_content import ParsedFile


class File:

  # ----------------------------------------------------------------

  def __init__(self, filePath: str, parsedFile: ParsedFile):
    self._fqFile = path.abspath (filePath)
    self._baseDir = path.split(self._fqFile)[0]
    self._parsedFile = parsedFile

  # ----------------------------------------------------------------

  def __eq__(self, other):
    return (self._fqFile == other._fqFile)

  # ----------------------------------------------------------------

  @staticmethod
  def newFromContent(filePath, content):
    parsedFile = ParsedFile.newFromContent (content)
    return File (filePath, parsedFile)

  # ----------------------------------------------------------------

  @staticmethod
  def _createOneAbspath (basePath: str, relPath):
    if path.isabs (relPath):
      return path.abspath(relPath)
    else:
      abspath = path.abspath (path.join (basePath, relPath))
      return abspath
    return None

  # ----------------------------------------------------------------

  @staticmethod
  def _createAbspathFilelist (basePath: str, relativePaths: List[str]):
    """Create list of abosolute pathnames from `relativeFilenames`
       in relation to `basePath`"""
    absPaths = []
    for relPath in relativePaths:
      absPaths.append (File._createOneAbspath (basePath, relPath))

    return absPaths

  # ----------------------------------------------------------------

  def getOutfile_abs(self):
    outpath = self._parsedFile.outfile
    if (outpath != None):
      return self.__class__._createOneAbspath (self._baseDir, outpath)

    return ""

  # ----------------------------------------------------------------

  def getDependencies_abs(self):
    relDeps = self._parsedFile.getRelativeDependencies()
    return self.__class__._createAbspathFilelist (self._baseDir, relDeps)

  # ----------------------------------------------------------------

  def getContent(self):
    return self._parsedFile.content

  # ----------------------------------------------------------------
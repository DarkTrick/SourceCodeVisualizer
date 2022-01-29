from jslinker.data_content_provider import DataContentProvider
from jslinker.file import File
from jslinker.my_queue import MyQueue
from jslinker.parse_file_content import ParseException

from typing import List

class JsStitcher:

  # -----------------------------------------------------------------------------

  def __init__(self, initialFilepathList: List[str],
                     dataContentProvider: DataContentProvider):
    self._initialFilepathList = initialFilepathList[:]
    self._dataContentProvider = dataContentProvider

    self._fileList = []
    self._stitchedContent = ""

    self._outfile = ""


  # -----------------------------------------------------------------------------

  def run(self):
    """
      Stiches all `files together
    """
    try:
      self._createStitchedContent()
    except FileNotFoundError as e:
      return ("ERROR: " + str (e))
    except ParseException as e:
      return ("ERROR: " + str (e))
    except Exception as e:
      raise (e)

    return True


  # -----------------------------------------------------------------------------

  def _createStitchedContent(self):
    self._fileList = JsStitcher._createDependencyList (self._initialFilepathList, self._dataContentProvider)
    self._stitchedContent = self.__class__._stitchFiles(self._fileList)

  # -----------------------------------------------------------------------------
  def _extractOutfileInformation(self):
    if (len (self._initialFilepathList) > 0):
      path = self._initialFilepathList[0]
      file = self.__class__._getFileFromPath (path, self._dataContentProvider)

      self._outfile = file.getOutfile_abs()
  # -----------------------------------------------------------------------------

  @staticmethod
  def _stitchFiles( fileList: List[File]) -> str:
    stitchedContent = ""
    for file in fileList:
      stitchedContent += file.getContent() + "\n"

    return stitchedContent

  # -----------------------------------------------------------------------------

  @staticmethod
  def _getFileFromPath (path, dataContentProvider):
    filecontent = dataContentProvider.read (path)
    if (None == filecontent):
      raise FileNotFoundError("File could not be found or accessed:\n  " + path)

    try:
      file = File.newFromContent (path, filecontent)
    except ParseException as e:
      raise ParseException (str (e) + "\n  file: '" + path + "'")
    return file

  # -----------------------------------------------------------------------------

  @staticmethod
  def _createDependencyList(initialFilepathList: List[str],
          dataContentProvider: DataContentProvider) -> List[File]:
    """
      Return:
        List of `File`s in with least dependent file first and most dependent file last
        E.g.
            Dependency           Output
              A->B->C     =>    [C,B,A]
              A->B->D     =>    [D,C,B,A]
               ->C->D
    """

    unprocessedPaths = MyQueue()
    unprocessedPaths.putList (initialFilepathList)

    processedFiles = []

    while (not unprocessedPaths.empty()):
      # create a file structure
      file = JsStitcher._getFileFromPath (unprocessedPaths.get(), dataContentProvider)

      # if file was already processed, remove it, to move it
      #  higher in the "include priority"
      if (file in processedFiles):
        processedFiles.remove (file)

      # record file dependencies
      unprocessedPaths.putList (file.getDependencies_abs ())

      processedFiles.append (file)


    processedFiles.reverse()
    return processedFiles

  # -----------------------------------------------------------------------------

  def getStitchedContent(self):
    return self._stitchedContent

  # -----------------------------------------------------------------------------

  def persistData(self):
    self._dataContentProvider.write (self._outfile, self._stitchedContent)

  # -----------------------------------------------------------------------------

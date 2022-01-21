
from jslinker.data_content_provider import DataContentProvider

class DataContentProviderMock (DataContentProvider):
  """
    Receives a dictionary of files during instantiation.
    returns contents of this dictionary on request.
    E.g.
      fileDict[<filepath1>] = "filecontent"
      fileDict[<filepath2>] = "filecontent"
  """

  def __init__(self, fileDictionary):
    super ().__init__ ()
    self._files = fileDictionary

  def read(self, filename: str) -> str:
    if (not filename in self._files):
      return None
    return self._files[filename]

  def write(self, filepath: str, content: str):
    self._files[filepath] = content
    return True
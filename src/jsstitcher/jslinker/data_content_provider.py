
class DataContentProvider:
  """ Interface class for getting content of files """

  def read(self, filepath: str) -> str:
    """
      Return <file content>: usual case
             None: data source could not be found/opened
    """
    raise Exception ("implement in subclass")

  def write(self, filepath: str, content: str):
    """
      Return:
            True, `content` was written
            False, otherwise
    """
    raise Exception ("implement in subclass")
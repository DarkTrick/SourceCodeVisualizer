from jslinker.data_content_provider import DataContentProvider
from os import path

class FileContentProvider (DataContentProvider):

  def read(self, filepath: str) -> str:
    content = ""
    if (not path.isfile (filepath)):
      return None

    with open(filepath, "r") as file:
      content = file.read()
    return content

  def write(self, filepath: str, content: str):
    """
      Write to file or - if filepath is empty - write to stdout
    """
    if ("" != filepath):
      if (not path.isfile (filepath)):
        return None
      with open(filepath, "w") as file:
        file.write (content)
    else:
      print (content)

    return True
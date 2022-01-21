from typing import List

from jslinker.js_stitcher import JsStitcher
from jslinker.file_content_provider import FileContentProvider

class JsFileStitcher(JsStitcher):
  """class that uses JsStitcher with FileContentProvider"""
  def __init__(self, initialFilepathList: List[str]):
    super ().__init__ (initialFilepathList, FileContentProvider())
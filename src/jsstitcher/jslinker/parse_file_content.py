from typing import List

# ======================================================
# ======================================================
# ======================================================
# KW = KeyWord

# the current logic would only allow one single keyword
KW = {"DEPENDS_ON": 'require ("'}
KW_END   = '");'

class ParseException(Exception):
  pass

# ======================================================
# ======================================================
# ======================================================

class _FileFromContentCreator:

  @staticmethod
  def create(fileContent: str):
    """
      Create a `ParsedFile` object form fileContent
    """
    file = ParsedFile()

    keyword = KW["DEPENDS_ON"]
    # contains content without keywords
    file.content = ""
    kwStart = 0
    kwEnd = 0
    lastEnd = 0

    while(True):

      # --- find keyword ----
      kwStart = fileContent.find(keyword, kwStart)
      if (-1 == kwStart):
        # append remaining file content
        file.content += fileContent[lastEnd:]
        break

      # --- find value ----
      value_start = kwStart + len (keyword)
      value_end = fileContent.find (KW_END, kwStart)
      if (-1 == value_end):
        raise ParseException (_FileFromContentCreator._createParseError (
                              fileContent,kwStart,"Keyword not 'finished': missing  '" + KW_END + "'after keyword"))

      if (-1 == value_end):
        value_end = len (fileContent)
      value = fileContent[value_start:value_end]

      # --- find keyword end ----
      kwEnd = value_end + len(KW_END)

      # also swallow preceeding linebreak, if there
      if (len (fileContent) > kwEnd and fileContent[kwEnd] == "\n"):
        kwEnd += 1


      # --- take action for keyword ---
      if (keyword == KW["DEPENDS_ON"]):
        file.dependency_add (value)

      # prepare for next round
      kwStart = kwEnd
      lastEnd = kwEnd

    return file

  @staticmethod
  def _createParseError(content, filePosition, message):
    return str (message) + ". Line: " + str (1+content.count("\n",0,filePosition))

# ======================================================
# ======================================================
# ======================================================

class ParsedFile:
  def __init__(self):
    self.content = ""
    self._dependencies: List[str]  = []
    self.outfile = None

  # ------------------------------------------------------------

  def dependency_add(self, dependency: str):
    self._dependencies.append (dependency)

  # ------------------------------------------------------------

  def getRelativeDependencies(self):
    return self._dependencies

  # ------------------------------------------------------------

  @staticmethod
  def newFromContent(fileContent: str):
    return _FileFromContentCreator.create (fileContent)

  # ------------------------------------------------------------

# ======================================================
# ======================================================
# ======================================================
from typing import List

# ======================================================
# ======================================================
# ======================================================
# KW = KeyWord
KW_IDENTIFIER_START = "//@"
KW_IDENTIFIER_END   = ":"
KW = {"DEPENDS_ON": "require",
      "OUTFILE": "output"}

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

    # contains content without keywords
    file.content = ""
    kwIdStart = 0
    kwStart = 0
    kwEnd = 0
    lastEnd = 0

    while(True):
      kwIdStart = fileContent.find(KW_IDENTIFIER_START, kwIdStart)
      if (-1 == kwIdStart):
        file.content += fileContent[lastEnd:]
        break

      # --- find keyword ----
      kwStart = kwIdStart + len (KW_IDENTIFIER_START)
      kwEnd = fileContent.find (KW_IDENTIFIER_END, kwStart)
      if (-1 == kwEnd):
        raise ParseException (_FileFromContentCreator._createParseError (
                              fileContent,kwStart,"Keyword not 'finished'; ':' missing after keyword"))

      keyword = fileContent[kwStart:kwEnd]

      # --- find value ----
      value_start = kwEnd + len (KW_IDENTIFIER_END)
      value_end = fileContent.find ("\n", kwEnd + len(KW_IDENTIFIER_END))
      if (-1 == value_end):
        value_end = len (fileContent)
      value = fileContent[value_start:value_end].strip()

      # --- take action for keyword ---
      if (keyword == KW["DEPENDS_ON"]):
        file.dependency_add (value)
      elif (keyword == KW["OUTFILE"]):
        file.outfile = value
      else:
        raise ParseException (_FileFromContentCreator._createParseError (
                              fileContent,kwStart, "Unknown keyword"))

      # prepare for next round
      kwIdStart = value_end + 1
      lastEnd = value_end + 1

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
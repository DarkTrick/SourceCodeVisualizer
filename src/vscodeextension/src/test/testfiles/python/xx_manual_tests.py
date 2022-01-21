def aaa():
  return 5

def bbb():
  return aaa()

# a comment

def bbb2():
  a = Test()
  return aaa()


a = 14

class Test:

  def aaa(self):
    return 5


  def bbb(self):
    return self.aaa ()

  def ccc(self):
    return self.aaa ()



class Parent :
   def foo():
      return "parent::foo()"
   def foo2():
      return 11


class ChildA (Parent):
  def foo():
    return "ChildA::foo()"
  def foo2(param1,
           param2):
    return 3

class ChildB (Parent):
  def foo():
   return "ChildB::foo()"


def childparenttest():
  """explaining the function"""
  # short comment

  test = None
  if (input() > 1):
    test = ChildA()
  else:
    test = ChildB()

  def asdf():
    pass

  test.foo()


def breaking_parameters (param1,
                         param2,
                         param3):
  pass


def long_long_long_method (param1, param2,
                           param3, param4,
                           param5, param6):
  pass
  pass
  pass


def long_long_long_method2 (param1, param2,
                            param3, param4,
                            param5, param6):
  a = 5 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
  pass
  pass


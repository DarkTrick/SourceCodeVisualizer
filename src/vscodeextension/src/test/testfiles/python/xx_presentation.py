


def main():
  print ("hello ")
  printWorld ()


def printWorld():
  print ("World")







class クラス:

  def foo1(self):
    return 1

  def foo2(self):
    return 2

  def foo3(self):
    return self.foo1 () \
         + self.foo2 ()




















class 親:
  def foo(self):
    return "親"

class 子1(親):
  def foo(self):
    return "子 1"

class 子2(親):
  def foo(self):
    return "子 2"

def 親子(判定):
  子 = None
  if (1 == 判定):
   子 = 子1 ()
  if (2 == 判定):
   子 = 子2 ()
  子.foo ()














def 外():
  print ("複雑な関数")

  def 内1():
    return 1
  内1 ()
  def 内2():
    return 2

  def 内3():
    return 3

  内1 ()
  内2 ()
  内3 ()



def 外():
  def 内1():
    return 1
  def 内2():
    return 2
  def 内3():
    return 3

  内1 ()
  内2 ()
  内3 ()



def foo():
  def 関数１():
    print("hello world")








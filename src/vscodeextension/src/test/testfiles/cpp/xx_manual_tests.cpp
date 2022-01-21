#include <iostream>
#include "xx_manual_tests.h"
using namespace std;

class ClassWithInlineDeclarations
{
  public:
  int fooA(){
    return 1 + 1;
  }
  int fooB(){
    return 1 + 2;
  }
  int fooC(){
    return 1 + 3;
  }
};


class Parent{
  public:
    virtual void foo();
};

class Child1 :public Parent {
  public:
    virtual void foo();
};

class Child2 : public Parent {
  public:
    virtual void foo();
};


void Parent::foo()
{
  cout << "Parent::foo" << endl;
}

void Child1::foo()
{
  cout << "Child1::foo" << endl;
}

void Child2::foo()
{
  cout << "Child2::foo" << endl;
}


int main()
{
  /* multi line comment */
  // single line comment
  Parent * obj = new Child2 ();
  obj->foo();
  delete obj;

  return 1;
}


void foo()
{
  int myvar = 1;
  char myvar2 = 2;

  foo2();

}


void foo2()
{

}

namespace {

  int a;
  char b;
}
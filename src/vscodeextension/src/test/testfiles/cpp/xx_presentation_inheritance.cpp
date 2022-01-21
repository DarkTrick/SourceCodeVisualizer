#include <iostream>
using namespace std;



struct Parent{
    virtual void foo()
    {
      cout << "Parent";
    }
};

struct Child1 :public Parent {
    virtual void foo(){
      cout << "Child1";
    }
};

struct Child2 : public Parent {
    virtual void foo(){
      cout << "Child2";
    }
};

int main()
{
  Parent * obj = new Child2 ();
  obj->foo();
  delete obj;

  return 1;
}
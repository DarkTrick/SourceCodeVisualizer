

let a = 4;
let ab = 4;
let ac = 4;
let ad = 4;
let ae = 4;

function ccc() {
  return 5;
}

function ddd() {
  let a = new Test();
  exAsyncFunc();
  return ccc ();
}

export function exFunc()
{
  exAsyncFunc ();
  return ccc();
}

export async function exAsyncFunc()
{
  exFunc() ;
  return ccc();
}



class Test{

  aaa(){                 // returns: vscode.LocationLink

  }

  bbb(){                 // returns: vscode.LocationLink
    return this.aaa ();  // returns: vscode.LocationLink
  }

  async ccc(){
    return this.aaa ();
  }

}

class Parent {
  public foo()  { return "Parent::foo()"; }
  public foo2() { return 11; }
}

class ChildA extends Parent {
  public foo() { return "ChildA::foo()"; }
}

class ChildB extends Parent {
  public foo() { return "ChildB::foo()"; }
}

function childparenttest(){
  let test: Parent = new ChildA();
  test.foo();
}
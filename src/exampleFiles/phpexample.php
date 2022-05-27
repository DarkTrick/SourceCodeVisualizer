<?php

function functionName() {
  print("Hello World");
}

function func2() {
  functionName();
  functionName();
  functionName();
}

function func3() {
  func2();
  func2();
  func2();
}

print("Hello World");
print("Hello World");
?>
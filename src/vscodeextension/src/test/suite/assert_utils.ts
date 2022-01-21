import * as vscode from 'vscode';
import * as assert from 'assert';
import * as testutils from './utils'
import * as domainutils from '../../utils'

export class AssertX
{

  static isTrue(
      actual: boolean,
      message: string = "")
  {
    assert.strictEqual (actual, true, message);
  }


  static range_equals(
      actual: vscode.Range | null,
      expected: vscode.Range | null,
      message: string = "")
  {
    message = "Ranges don't match" +
                "\n  actual:   " + testutils.range_toString (actual) +
                "\n  expected: " + testutils.range_toString (expected) +
                "\n  " + message;

    if (actual == expected)
      return;

    if (null == actual)
      assert.fail (message);

    if (null == expected)
      assert.fail (message);

    if (!domainutils.range_equals (actual, expected))
      assert.fail (message);
  }
}
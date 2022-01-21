import * as child_process from 'child_process';
import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath,
} from '@vscode/test-electron';


import { runTests } from 'vscode-test';

export function getTestDirPath()
{
  return path.resolve(__dirname, "../../src/test");
}


async function main()
{
    try {
      // The folder containing the Extension Manifest package.json
      // Passed to `--extensionDevelopmentPath`
      const extensionDevelopmentPath = path.resolve(__dirname, '../../');

      // The path to test runner
      // Passed to --extensionTestsPath
      const extensionTestsPath = path.resolve(__dirname, './suite/index');
      const vscodeExecutablePath = await downloadAndUnzipVSCode('1.61.1');
      const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

      // Use cp.spawn / cp.exec for custom setup
      child_process.spawnSync(cliPath,
        ['--install-extension', 'ms-python.python', 'ms-python.vscode-pylance'],
        {
        encoding: 'utf-8',
        stdio: 'inherit'
      });

      // Download VS Code, unzip it and run the integration test
      //await runTests({ extensionDevelopmentPath, extensionTestsPath });
      await runTests({
        // Use the specified `code` executable
        vscodeExecutablePath,
        extensionDevelopmentPath,
        extensionTestsPath
      });
    } catch (err) {
      console.error('Failed to run tests');
      process.exit(1);
    }

}


main();

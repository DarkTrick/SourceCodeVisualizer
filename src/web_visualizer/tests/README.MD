This directory is for
1. testing the visualization subsystem within the browser (no vs code needed).
2. testing specific reocurring scenarios (test cases).

(**For beginners:** Just open a random html file and see what happens)

Each file represents one test case, that needs to be inspected manually.

For continuous tests during development, use `_arbitrary_tests.html`

### Folder `shared_files`

*Note: In general, you should not need to touch any of these files*

This folder contains code to setup a (debugging) system within the browser.
Yes, the code and structure needs improvement.
#### `browserSystem.js`:

Does system initialization (e.g. "decide the first shown window")
#### `backendEmulation.js`:

Implements the mock backend used for this testing environment

#### `exampleoutlineData`:

Contains outline data, that can be used among all tests.

*Background:*
Outline data is very noisy and difficult to set up, so we need a
*shared* database for this - especially as long as the interface is unstable.






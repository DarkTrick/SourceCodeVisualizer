# What is this?
Source root directory for the code structure visualizer.

# Install Environment

*(Instruction for Ubuntu)*

```bash
# install python3 (needed for web_visualizer
sudo apt install python3

# install nodejs
sudo apt install nodejs
```

# Build
```bash
# install project specific dependencies
npm run install

# compile code and create VSCode extension file
npm run compile
```

This will create a VSCode extension file in `../release`

For building individual subdirectories, use `npm run install` / `npm run compile`
withing the various subdirectories

# Release
- Increase version: `./vscodeextension/package.json` :: `version`
- Add contents to `./vscodeextension/CHANGELOG.md`
- *build*
- (test)
- commit & push
- upload the result to vscode marketplace



Dependencies
------------
- `python3` (for building `web_visualizer`)


# Manually create an extension package
======================================

- `npm run compile` (<- maybe unnecessary?)
- `cd vscodeextension`
- `./node_modules/vsce/out/vsce package`


# Install vsix extension package file
======================================

`code --install-extension outline-visualizer.vsix`


# Development
=============

There are 2 subsystems:
- VSCode extension (directory `vscodeextension`)
- Visualizer (directory `web_visualizer`)




## How to support a new language?
-----------------------------------

***First*: Understand, why all languages are not supported by default:**

The parsers providing information to VSCode (the *Language Service Provider*) do not provide enough detail about the code to be able to visualize them. Therefore you need an "*adapter*" that provides the level of detail we need.


That being said...


To support a new language you need to supply an outline provider. For that you need to ...
1. ... write the code.
2. ... distribute it



### 1. How to write the code for an outline provider?


Three choices:


#### Use the finished `VpLspExtenderCurlyBraces` adapter (easiest)

`VpLspExtenderCurlyBraces` is the general-purpose class used for providing language support for languages that use curly braces (like Typescript, Javascript, Php, Java, ...).

You can copy and paste the classes code and extend it to your needs.


Using this interface requires a parser ([`DefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#DefinitionProvider), [`DocumentSymbolProvider`](https://code.visualstudio.com/api/references/vscode-api#DocumentSymbolProvider)) for the target language to be separately available  (this is mostly the case for common programming languages).


*See Also:*
- How curly-braced languages are registered with `VPLspExtenderCurlyBraces`. `vscodeextension/src/outlineproviders/lspextenderprovider.ts`, function `activate`.


#### Implement `VpLspExtenderProvider` (2nd easiest)

*See:* `vscodeextension/src/outlineproviderAPI/lspextenderprovider.ts`.

This is the easiest way of writint a provider. Many common parsing-tasks are generalized and you don't need to reimplement them.

Using this interface requires a parser ([`DefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#DefinitionProvider), [`DocumentSymbolProvider`](https://code.visualstudio.com/api/references/vscode-api#DocumentSymbolProvider)) for the target language to be separately available  (this is mostly the case for common programming languages).

*Note:* What exactly you need to implement might be a little difficult to figure out at first. But compared to the alternative, it's woth the hassle. See implementation for Python or C++.

```
  ___________________________
 |                           |
 |  DefinitionProvider       |
 |                           |  Basic language parser
 |  DocumentSymbolProvider   |
 |___________________________|
             ↑
             |  request
  ___________|______________
 |                          |
 |                          |
 |  VpLspExtenderProvider   |   Adapter: Processes the results
 |                          |   from above to fit the needs
 |__________________________|   (interface) of the VPSystem.
              ↑
              |  request
       _______|______
      |              |
      |              |
      |   VPSystem   |
      |              |
      |______________|

```


#### Implement `VpOutlineProvider` (hard)

This is the hardest way to implement a provider.

You need to implement the a `VpOutlineProvider` (`vscodeextensions/src/outlineproviderAPI/outlineprovider.ts`)

This implementation can fully replace a language parser. I.e. `DefinitionProvider` and `DocumentSymbolProvider` are *not* needed.



#### Remarks

- You might find hints in `vscodeextension/src/outlineproviders/providerregistrer` in funciton `activate`.

### 2. How to distribute my code?

- You could distribute it as your own VSCode addon.
- You could file a merge request to add it to this code base.



# Misc
======

**This is stuff I wrote for myself; not yet structured**


### Facts on VSCode
- currently open document: vscode.window.activeTextEditor.document
   - has:
      - filename
      - getText()
- user messages: vscode.window
   - showInformationMessage
   - showErrorMessage
   - showInputBox


### Prototype Structure
./[prototype]/media contains a fully functional html version of
  the system. This content is loaded by VSCode, when run
  inside vscode. Pure html-changes should be done here.


## How to test?

- Open project in VSCode
- If not yet done, do [Install environment] (see chapter below).
- F5 for start debugging
- Ctrl+Shift+P (Menu->View->Command Palette...) to run a command
- type "visualize code as diagram" to start the webview


## Install environment
- linux: `sudo apt-get install nodejs`

# install yeoman and vs code extension gen
- linux: `sudo npm install -g yo generator-code`

# Here you find information:
https://code.visualstudio.com/api/extension-guides/overview


## Common
- Content: package.json:
  - dependencies
  - Extension entry point (`main`)

- Restrictions:
  - No access to DOM,Html,CSS of VSCode

- Before opening/ editing / running Webview-extensions:
  `npm install`

## Client / Server Architecture
- Language Server Protocol:

    Editor1: Lang Client
                             <--->     Server: Lang Server
    Edtior2: Lang Client

    Specifies exactly the client/server architecture, I'm aiming for.
    "Server" is a static code analyzer and provides information of the
     code, if a respective function was called.


## Specific


- WebView API: create complete custom UI with HTML,Javascript,CSS
- Custom Editor API: Create custom read/write editor for files

 ___________         ___________________         __________
|   View    |       |    Controller     |       |  Model   |
|           | <---> |                   | <---> |          |
|Webview API|       | Custom Editor API |       |  VSCode  |
|___________|       |___________________|       |__________|




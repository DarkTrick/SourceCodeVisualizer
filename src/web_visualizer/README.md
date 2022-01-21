What is this?
=============

This subsystem called *visualizing subsystem*.

This is the part in charge of the visualization (basically everything the user interacts with in regard of this addon).

It is called *web_visualizer*, because it uses *web* tech (html/css/javascript) and runs in the *webview* of vscode.

**This "subsystem" can be used independently of the VSCode addon. It can be used by any other system, that complies with the interface and supports html5 tech**


Build
=====

- `npm run compile`
- output will be in ./release

Note: To make the output available for the VSCode addon, copy everything to vscodeextension/media/

Dependencies
-------------
- `python3` Must be available as command.


Develop
=======

### Overview (/Structure)

`src` contains all *loose* source files. The build process will stitch all source files together into one two big source files (one for js and one for css) and places them in the `release` folder. After building the system can be tested within a browser using stuff in `tests` folder.


### Why do you use jssticher and not package XYZ from node?

I don't like the dependency on fog-like packages that are very difficult to grasp - especially in cases where their interface suddely changes and noone is able to build the project anymore.
Therefore I use the very simple self-written jssticher, that does the job.



### Automated Tests

There are none. ...so sad...



### Testing (within the browser)

To test you don't need vscode. Look at `tests` for more information.

### Interface: Visualize Information

The following is the generl way of visualizing information
```
// convey that the event is for the visualizing subsystem
let event = new Event ("message");

event.data = [] // see below

window.dispatchEvent (event);
```

`event.data` is an array of objects to visualize. See subsections to see their
structure

#### Visualize Text Messages

```
{
   type: "messageBox",
   requestedId: null, // noone specific requested the object
   data: {
            type: "<MESSAGE TYPE>", // "Error" | "Warning" | "Info" | "<arbitrary>"
            title: "Message title",
            message: "Message content"
         }
};
```

`<MESSAGE TYPE>` *can* be an arbitrary string. The message will be formatted by the CSS class `.VpwMessageWindow.<MESSAGE TYPE>` (spaces will be replaced by "_").

The following presets are available:

- `Error`: Format as error message
- `Warning`: Format as warning message
- `Info`: Format as info message


#### Visualize Code Entities

```
{
   type: "visualizeOutline",
   requestedId: null, // noone specific requested the object
   data: {
            <OUTLINE DATA>
         }
};
```

Content of `<OUTLINE DATA>` can be found in
`../vscodeextension/src/outlineproviderAPI/SymbolDefinition.ts`

Examples can be found in
`./tests/shared_files/exampleoutlineData.js`












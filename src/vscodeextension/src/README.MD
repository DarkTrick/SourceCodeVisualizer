#What is this?
==============

This is the VSCode addon for the code structure visualizer. It handles everything that has to do with VSCode.

The code here compiles to a VSCode extension, that uses the `web_visualizer` to visualize code inside a `Webview` (see VSCode API). 


# Build
========

*IMPORTANT*: Building here will not build the web_visualizer.

Therefore, **I recommend building from source root**, except if you know what you're doing (= how to keep everything in sync)

### Build for distribution

`npm run install` (only for very first build)<br>
`npm run publish`


### Build for development

`npm run install` (only for very first build)<br>
`npm run compile`



# Development
===============

## Install Environment

### Ubuntu

```
# install nodejs
sudo apt install nodejs
```

### Windows

You need `npm` available as commands


## Testing

### Manual Testing
- [Install Environment]
- Open project in VSCode
- `F5` for start debugging
- `Ctrl`+`Shift`+`P` (= `Menu`->`View`->`Command Palette...`) 
- type `visualize` and select the result



### Auto Testing

Doens't work. <br>
Don't try to make it work. I already spend 50+ hours getting things to work. 

*Background*:<br>
The system is made up of various "independent" extensions and also depends on other 3rd-party extensions (like Python parser) to run.

Problem: VSCode is not able to reliably load any dependencies (not even the ones I implemented here). 















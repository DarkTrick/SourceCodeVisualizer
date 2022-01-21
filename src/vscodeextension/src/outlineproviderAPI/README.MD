
Create support for your own language
====================================
aka: create your own `OutlineProvider`

To support your own language, you need to create
an `VPOutlineProvider`. You have two options to
create your own `VPOutlineProvider`:

1. (difficult) Implement the interface `VPOutlineProvider`
   and register it with
   `vscode.commands.executeCommand('vp.registerOutlineProvider', language, [your_outline_provider]);`

2. (suggested; easy) Implement the interface
   `VPLspExtenderProvider` and register it with
   `vscode.commands.executeCommand('vp.registerLspExtenderProvider', language, provider );`<br>
   <br>
   Your Provider will be wrapped into a `VPOutlinerProvider`.<br>
   With this interface you save yourself a lot of trouble when
   implementing a `VPOutlineProvider` as it only requires you to
   implement some very basic behaviour.


Summary
========
Extension/Package for managing outline providers.

Important for 3rd Parties:
  - `vp.registerOutlineProvider`command will register a 3rd party `OutlineProvider`
    that could enable the system to visualize new languages
  - `SymbolDefinition.ts` file; it contains the data structures, that are returned by
    an `OutlineProvider`

Internally important:
  - `vp.executeOutlineProvider`
  - `vp.executeDefinitionProvider`
      Both used for receiving outlining information for a given source



Structure of packages:
========================

 ______________________                    _____________________
|                      |                  |                     |
|  OutlineProviderAPI  |   ◂----- -----▸  |  VisualProgramming  |
|______________________|                  |_____________________|
                  |
           ▲      |
           |      |- executeProvider
           |      |        (used by VisualProgramming package/system)
           |      |- registerProvider
           |      |        (used by 3rd Party Outline Providers)
           |      |- SymbolDefinition
           |               (Resulting Structures returned by an OutlineProvider)
           |
           ▼
 ______________________
|                      |
|  OutlineProviders    |
|______________________|
    |
    |-- PythonProvider
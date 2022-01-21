This folder contains default outliner classes for various languages.

Necessary methods of a provider
================================
Every outline provider needs to
implement the interface `VPOutlineProvider` in `outlineproviderAPI`

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
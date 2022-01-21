TESTS MUST BE DONE IN CHROME! (because VSCode uses chrome)

Next up
========
- Allow editing  


TODO
=====


- use scss instead of raw css .... slowly things get out of control

- Context menu: should not resize with world-resizing.
   Structural change needed:
   There needs to be two layers:
      1. world, 
         which is not a VgfWindow, but a literal "window"
         to look into the world. This worldWindow is not transformable.
         This is the object returned by widget.getWorld
      2. world.anchor,
         which contains the transformable part of the world
      
      Then: A context menu will be opened on world; so it's always 
            100% size
      Also: "mousedown"+caption=true for finishing the context menu
            can be appended to world instead of document.body


- bug: webview: doubleclick to open a definition resets window resizing

- Context-Items on window:
   - If it's a class: 
      "open parent classes"

   
- Funktion: get callee   
    
- Function decls and code parts shoulbe easily collapsable.
  ( Make "Blocks" collapsable )
   Perhaps with an onHover-callapse button on left side.     


             
                  
                  
- Refactor:
  * visualizer.ts:
      macht akt VSCode tab && visualizing kram. Sollte geteilt werden:
         - TabManager
         - Visualizer
           visualizer.visualize (tabmanager.tab)
  
  * visualizer.ts:: _translate_outlineRanges2outlineEntities
      Die Funk gehoert eigenltich in eine utils-Klasse
      
- Connection line is getting newly created on click.
   Problem: In 
      VpwWorld::connection_createIfNotExisting      
    the existence of a line is not checked          

- Fenster: Multiselect and multi-moving




Other-Systems-connection
=========================

- Check https://developers.google.com/code-search/
    und https://about.sourcegraph.com/
   Vielleicht kann man VP da integrieren

- Guck dir Kythe.io und "Code Search Google" an, was in die
   Richtung von outliner geht. Vielleicht koennte man meine
   Idee von VSCode in diese Applikationen einarbeiten.



Cpp-specific bugs
=================
[ very low priority, because cpp doesn't work well anyway, 
  because of VSCode's bad C++ parser ]

- cpp: include files cannot be opened via F12
- CPP-Parser: unnamed namespaces don't work
               --> probably same as for constructors in ts
               

Prototyps
==========
- HTML-Viewmodel-Prototyp:
   1) Mache Prototyp, der die Sourcedatei mit HTML annotiert.
      Bsp:
         class MyClass:
            def foo(self):
               pass
      Als
         <class><keyword>class</keyword> <name>MyClass</name>
         <function><keyword>def</keyword>
             <name>foo</name><params>(self)</params>:
            <functionbody>    pass</functionbody>
         </function>
         </class>

   2) Zeige im Webview einfach nur die HTML-Seite
      2.1) Schreibe CSS, damit es schoener aussieht
      2.2) Ueberlege dir, wie abgekoppelte Sachen dargestellt werden
           sollten... geht das ueberhaupt? die gehoeren ja immer zu
           ihrem parent...
            - koennte ich <class> bewegen, ohne <function>
              bewegen zu lassen?
            - Obwohl der Klassenname nur einmal da ist, muss er
              zweimal angezeigt werden.
      2.3) Mache so, dass mehrere Dateien angezeigt werden koennen
      2.4) Mache es als "Editor", damit Aenderungen direkt in die
           Datei geschrieben wuerden.


Older TODOs
===============

- Use Custom Editor API:
  - Try example
  - Try to communicate with the webview

  //- Is it possible to use the custom Editor with some kind of
  //    markup-rendering?

- UI changes @html-view:
      - onZoom->redraw connecting lines
      - onDrag -> if(exceeds Canvas) -> enlarge Canvas
      - onResize -> redraw connecting lines of resizing text box

- Write a Code converter-protype, that would roughly parse python code
   into a different language for presentation and then parse it back for
   saving.

- Create a Mock API to work with the CustomEditor API,
  to pretend we're getting real function calls with
  real code


Planning:
----------
  - decide how several things should be rendered.
    ? How do we render code in general?
        ? Every line in a div? Every line an Edit field?
    ? How do we handle longer statements?
        e.g.  a( b( c( d() ) ) )
        ? does each call goes inside a div?
        ? how are lines going to be drawn?
            ? is the whole structure going to be stretched out?
              ( see notes)
    ? How do we render parameters?
    ? How do we handle doc-comments? (e.g. @brief, @param)
    ? How do we handle doc-comments, that cannot be parsed?
    ? How do we handle comments in code?
        The initial idea was to remove the "#" or "//"-signes
    ? How do we handle indentation?


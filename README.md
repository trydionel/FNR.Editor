# FNR.Editor
FNR.Editor is a client-side application for generating maze-like levels for a
mobile game my wife and I are working on. It showcases many of the amazing
capabilities of modern browsers: File IO, Canvas, WebGL, and the require.js
dependency system.

## Setup
No setup required! Simply clone the repo and launch a webserver for the
directory.

    git clone https://github.com/trydionel/FNR.Editor.git
    cd FNR.Editor
    python -mSimpleHTTPServer

## Development
FNR.Editor works entirely client-side. It relies on a few awesome tools to do
this:

* require.js
* underscore.js
* backbone.js
* THREE.js
* Twitter Bootstrap

Most of these libraries are loaded in `index.html` (outside the control of
require.js) to make dependency management more convenient. Aside from that,
the entire application lives under `/js`.

## Bugs/TODO
The application is heavily WebKit-based at the moment. No guarantees that it
can run outside of Chrome 20+ at the moment, though I'm pretty sure Firefox,
Safari and Opera can support all of the "high-end" features.

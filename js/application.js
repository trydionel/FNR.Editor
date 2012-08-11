define(function(require) {

  var Prefabs = require('collections/prefabs');
  var Blocks  = require('collections/blocks');

  var Layers  = require('views/layers');
  var Palette = require('views/palette');
  var Editor  = require('views/editor');
  var Preview = require('views/preview');
  var Toolbar = require('views/toolbar');

  function Application(options) {
    this.prefabs = options.prefabs || new Prefabs();
    this.blocks  = options.blocks  || new Blocks();

    // This is clunky
    this.blocks.model.prefabs = this.prefabs;

    this.layers  = new Layers;
    this.palette = new Palette({ prefabs: this.prefabs });
    this.editor  = new Editor({ palette: this.palette, layers: this.layers, collection: this.blocks });
    this.preview = new Preview({ collection: this.blocks, editor: this.editor });
    this.toolbar = new Toolbar({ collection: this.blocks });
  };

  Application.prototype.run = function() {
    this.layers.render();
    this.palette.render();
    this.editor.render();
    this.preview.render();
    this.toolbar.render();
  };

  return Application;
});

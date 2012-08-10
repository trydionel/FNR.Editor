// *********************************************
// *
// * Create scene object factories and prefabs
// *
// *********************************************
var Prefab = Backbone.Model.extend({
  defaults: {
    size: 100,
    layer: 0,
    wireframe: false
  },

  initialize: function() {
    var size = this.get('size'),
      color = this.get('color'),
      wireframe = this.get('wireframe');

    var geometry = new THREE.CubeGeometry(size, size, size);
    var material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe });

    this.set({
      geometry: geometry,
      material: material
    }, { silent: true });
  }
});

var Block = Backbone.Model.extend({
  initialize: function() {
    var prefab = this.prefab();
    var mesh = new THREE.Mesh(prefab.get('geometry'), prefab.get('material'));

    this.set('mesh', mesh, { silent: true });

    this.on('change:type', this.setType, this);
  },

  prefab: function() {
    return Prefabs.get(this.get('type'));
  },

  setType: function(type) {
    var prefab = this.prefab();
    this.set('prefab', prefab, { silent: true });
    this.get('mesh').material = prefab.get('material');
  },

  toJSON: function() {
    return _.pick(this.attributes, 'type', 'x', 'y', 'z');
  }
});

var PrefabCollection = Backbone.Collection.extend({ model: Prefab });
var Prefabs = new PrefabCollection([
  { id: 'Shrub', color: 0x00ff00 },
  { id: 'Dirt', color: 0xffa54f, layer: -1 },
  { id: 'Water', color: 0x82cffd, layer: -1 }
]);

var BlockCollection = Backbone.Collection.extend({ model: Block });
var Blocks = new BlockCollection;

// ********************************************
// *
// * Set up Prefab Palette
// *
// ********************************************
var Palette = Backbone.View.extend({

  el: '#container .palette',

  template: _.template($('#palette-tmpl').text()),

  events: {
    'click li:not(.nav-header)' : 'choosePrefab'
  },

  initialize: function(options) {
    options = options || {};

    this.prefabs = options.prefabs;
    if (!this.prefabs) throw "ArgumentError: Must supply list of prefabs";

    this.selection = null;
    this.prefab = null;
  },

  render: function() {
    var types = this.prefabs.pluck('id');
    this.$el.html(this.template({ blocks: types }));
  },

  choosePrefab: function(event) {
    var target = $(event.currentTarget);

    target.siblings().removeClass('active');
    target.addClass('active');

    this.selection = target.text();
    this.prefab = this.prefabs.get(this.selection);
  }
});

var palette = new Palette({ prefabs: Prefabs });
palette.render();

// ********************************************
// *
// * Set up Editor
// *
// ********************************************
var Editor = Backbone.View.extend({

  el: '#container .editor',

  events: {
    'mousedown canvas' : 'startDrawing',
    'mouseup canvas'   : 'stopDrawing',
    'mousemove canvas' : 'draw'
  },

  initialize: function(options) {
    options = options || {};
    if (!options.palette) throw "ArgumentError: Must supply a Prefab Palette";

    var canvas = this.$('canvas')[0];

    this.width   = canvas.width;
    this.height  = canvas.height;
    this.palette = options.palette;
    this.size    = options.size || { x: 40, y: 10 };
    this.drawing = false;
    this.ctx     = canvas.getContext('2d');
    this.cell    = {
      width: (this.width - 1) / this.size.x,
      height: (this.height - 1) / this.size.y
    };

    this.collection.on('add remove change', this.render, this);
  },

  startDrawing: function(event) {
    this.drawing = true;
    this.draw(event);
  },

  stopDrawing: function() {
    this.drawing = false;
  },

  draw: function(event) {
    event.preventDefault();

    if (!this.drawing) return;
    if (!this.palette.selection) return;

    var prefab = this.palette.prefab;
    var cell = this.cellAtPosition({
      x: event.offsetX,
      y: event.offsetY
    });
    if (!cell) return;

    var preexisting = this.collection.detect(function(element) {
      return element.get('x') == cell.x && element.get('z') == cell.y;
    });

    if (preexisting) {
      if (this.palette.selection == 'Erase') {
        this.collection.remove(preexisting);
      } else {
        preexisting.set({
          type: this.palette.selection,
          y: prefab.get('layer')
        });
      }
    } else {
      if (this.palette.selection == 'Erase') return;
      var element = {};
      element.type = this.palette.selection;
      element.x = cell.x;
      element.y = prefab.get('layer');
      element.z = cell.y;
      this.collection.add(element);
    }
  },

  cellAtPosition: function(position) {
    if (position.x < 0 || position.y < 0) return;
    if (position.x >= this.width || position.y >= this.height) return;

    var x = Math.floor(position.x / this.cell.width);
    var y = Math.floor(position.y / this.cell.height);

    return { x: x, y: y };
  },

  render: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawElements();
    this.drawGrid();
  },

  drawElements: function() {
    this.collection.each(_.bind(function(element) {
      var prefab = element.prefab();
      var color = new THREE.Color(prefab.get('color')).getContextStyle();

      this.ctx.fillStyle = color;
      this.ctx.fillRect(
        element.get('x') * this.cell.width,
        element.get('z') * this.cell.height,
        this.cell.width,
        this.cell.height);
    }, this));
  },

  drawGrid: function() {
    this.ctx.fillStyle = "#333";

    for (var x = 0; x <= this.size.x; x++)
      this.ctx.fillRect(x * this.cell.width, 0, 1, editor.height);
    for (var y = 0; y <= this.size.y; y++)
      this.ctx.fillRect(0, y * this.cell.height, editor.width, 1);
  }
});

var editor = new Editor({ palette: palette, collection: Blocks });
editor.render();

// ********************************************
// *
// * Set up ThreeJS scene preview
// *
// ********************************************
THREE.Object3D.prototype.clear = function() {
  var children = this.children;
  for (var i = children.length - 1; i >= 0; i--) {
    var child = children[i];
    child.clear();
    this.remove(child);
  };
};

var Preview = Backbone.View.extend({

  el: '#container .preview',

  DISTANCE: 1000,

  initialize: function(options) {
    var canvas = this.$('canvas')[0];

    this.editor = options.editor;

    this.width = canvas.width;
    this.height = canvas.height;
    this.timeZero = +new Date;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);

    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });

    this.collection.on('add remove change', _.throttle(this.draw, 100), this);
    this.draw();

    _.bindAll(this, 'render', 'draw');
  },

  render: function(time) {
    webkitRequestAnimationFrame(this.render);

    var t = (time - this.timeZero) / 1600.0;

    this.camera.position.x = this.center.x + this.DISTANCE * Math.cos(0.1 * t);
    this.camera.position.y = 750;
    this.camera.position.z = this.center.z + this.DISTANCE * Math.sin(0.1 * t);

    this.camera.lookAt(this.center);

    this.renderer.render(this.scene, this.camera);
  },

  draw: function() {
    this.scene.clear();
    this.scene.add(this.camera);
    this.recenter();

    this.collection.each(_.bind(function(block) {
      var prefab = block.prefab();
      var size = prefab.get('size');
      var mesh = block.get('mesh');

      mesh.position = new THREE.Vector3(size * block.get('x'), size * block.get('y'), size * block.get('z'));
      this.scene.add(mesh);
    }, this));
  },

  recenter: function() {
    var minX = _.min(this.collection.pluck('x'));
    var maxX = _.max(this.collection.pluck('x'));
    var minZ = _.min(this.collection.pluck('z'));
    var maxZ = _.max(this.collection.pluck('z'));

    // FIXME: Shouldn't hardcode prefab size
    this.center = new THREE.Vector3(100 * (minX + maxX) / 2, -20, 100 * (minZ + maxZ) / 2);
  }
});

var preview = new Preview({ collection: Blocks, editor: editor });
preview.render();

// ********************************************
// *
// * Build toolbar
// *
// ********************************************
var Toolbar = Backbone.View.extend({
  el: '.toolbar',

  events: {
    "click .save" : "save"
  },

  save: function() {
    var json = this.collection.toJSON();
    console.log(JSON.stringify(json));
  }
});

var toolbar = new Toolbar({ collection: Blocks });
toolbar.render();

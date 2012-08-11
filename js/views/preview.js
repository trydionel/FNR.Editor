define(function(require) {
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

      this.collection.on('all', _.throttle(this.draw, 100), this);
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

  return Preview;
});

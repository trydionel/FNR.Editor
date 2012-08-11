define(function(require) {
  function Prefab() { Backbone.Model.apply(this, arguments) };
  return Backbone.Model.extend({
    constructor: Prefab,

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
});

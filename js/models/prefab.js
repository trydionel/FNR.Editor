define(function(require) {
  function Prefab() { Backbone.Model.apply(this, arguments) };
  return Backbone.Model.extend({
    constructor: Prefab,

    defaults: {
      size: 100,
      wireframe: false,
      category: 'Tile'
    },

    initialize: function() {
      var color     = this.get('color'),
          wireframe = this.get('wireframe'),
          factory   = this.get('factory') || function(model) {
            var size = model.get('size');
            return new THREE.CubeGeometry(size, size, size);
          };

      var geometry = factory(this);
      var material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe });

      this.set({ geometry: geometry, material: material }, { silent: true });
    }
  });
});

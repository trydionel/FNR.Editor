define(function(require) {
  function Block() { Backbone.Model.apply(this, arguments) };
  return Backbone.Model.extend({
    constructor: Block,

    initialize: function() {
      var prefab = this.prefab();
      var mesh = new THREE.Mesh(prefab.get('geometry'), prefab.get('material'));

      this.set('mesh', mesh, { silent: true });

      this.on('change:type', this.setType, this);
    },

    prefab: function() {
      return Block.prefabs.get(this.get('type'));
    },

    setType: function(type) {
      var prefab = this.prefab();
      this.set('prefab', prefab, { silent: true });
      this.get('mesh').material = prefab.get('material');
    },

    toJSON: function() {
      return _.pick(this.attributes, 'type', 'x', 'y', 'z');
    }
  }, {
    prefabs: _([])
  });
});

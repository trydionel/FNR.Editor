define(function(require) {
  function Block() { Backbone.Model.apply(this, arguments) };
  return Backbone.Model.extend({
    constructor: Block,

    initialize: function() {
      this.setType(this.get('type'));
      this.on('change:type', this.setType, this);
    },

    prefab: function() {
      return Block.prefabs.get(this.get('type'));
    },

    setType: function(type) {
      var prefab = this.prefab();
      var mesh = new THREE.Mesh(prefab.get('geometry'), prefab.get('material'));

      this.set({
        prefab: prefab,
        category: prefab.get('category'),
        mesh: mesh }, { silent: true });
    },

    toJSON: function() {
      return _.pick(this.attributes, 'type', 'category', 'x', 'y', 'z');
    }
  }, {
    prefabs: _([])
  });
});

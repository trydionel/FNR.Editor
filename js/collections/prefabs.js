define(function(require) {
  var Prefab = require('models/prefab');
  return Backbone.Collection.extend({
    model: Prefab
  });
});

define(function(require) {
  var Block = require('models/block');
  return Backbone.Collection.extend({
    model: Block
  });
});

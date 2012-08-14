define(function(require) {
  var Block = require('models/block');
  return Backbone.Collection.extend({
    model: Block,

    comparator: function(block) {
      return [block.get('y'), block.get('z'), block.get('x')];
    }

  });
});

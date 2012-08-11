define(function(require) {

  var template = require('text!templates/layers.html');

  return Backbone.View.extend({

    el: '#container .layers',

    template: _.template(template),

    events: {
      "click li:not(.nav-header)" : "choose"
    },

    initialize: function() {
      this.selection = 0;
      this.on('change:layer', this.render, this);
    },

    render: function() {
      this.$el.html(this.template({
        selection: this.selection,
        layers: _.range(-2, 3)
      }));
    },

    choose: function(event) {
      var target = $(event.currentTarget);
      this.selection = parseInt(target.text(), 10);
      this.trigger('change:layer');
    }

  });
});

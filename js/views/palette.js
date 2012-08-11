define(function(require) {

  var template = require('text!templates/palette.html');

  var Palette = Backbone.View.extend({

    el: '#container .palette',

    template: _.template(template),

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
  return Palette;
});

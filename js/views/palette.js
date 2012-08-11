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

      this.prefab = this.prefabs.at(0);
      this.selection = this.prefab.get('id');

      this.on('change:prefab', this.render, this);
    },

    render: function() {
      var types = this.prefabs.pluck('id');
      this.$el.html(this.template({
        selection: this.selection,
        blocks: types
      }));
    },

    choosePrefab: function(event) {
      var target = $(event.currentTarget);

      this.selection = $.trim(target.text());
      this.prefab = this.prefabs.get(this.selection);

      this.trigger('change:prefab');
    }
  });
  return Palette;
});

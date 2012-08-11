define(function(require) {

  var SaveDialog = require('views/saveDialog');
  var LoadDialog = require('views/loadDialog');

  return Backbone.View.extend({

    el: '.toolbar',

    events: {
      "click .save" : "save",
      "click .load" : "load"
    },

    initialize: function() {
      this.collection.on('add remove change', this.cleanup, this);
    },

    save: function() {
      var dialog = new SaveDialog({ collection: this.collection });
      dialog.render();
    },

    load: function() {
      var dialog = new LoadDialog({ collection: this.collection });
      dialog.render();
    }

  });
});

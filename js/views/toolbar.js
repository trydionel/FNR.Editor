define(function(require) {

  var SaveDialog = require('views/saveDialog');
  var LoadDialog = require('views/loadDialog');
  var GenerateDialog = require('views/generateDialog');

  return Backbone.View.extend({

    el: '.toolbar',

    events: {
      "click .new"  : "new",
      "click .save" : "save",
      "click .load" : "load",
      "click .generate" : "generate"
    },

    initialize: function() {
      this.collection.on('add remove change', this.cleanup, this);
    },

    new: function() {
      if (confirm("Existing changes will be lost.")) {
        this.collection.reset();
      }
    },

    save: function() {
      var dialog = new SaveDialog({ collection: this.collection });
      dialog.render();
    },

    load: function() {
      var dialog = new LoadDialog({ collection: this.collection });
      dialog.render();
    },

    generate: function() {
      var dialog = new GenerateDialog({ collection: this.collection });
      dialog.render();
    }

  });
});

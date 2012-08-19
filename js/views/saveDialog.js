define(function(require) {

  var template = require('text!templates/save.html');
  var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
  var URL = window.webkitURL || window.URL;

  return Backbone.View.extend({

    template: _.template(template),

    mimetype: 'text/plain',

    events: {
      "change .filename" : "rename",
      "click .download"  : "close",
      "hidden"           : "cleanup"
    },

    initialize: function() {
      var json = this.collection.toJSON();

      var blob = new BlobBuilder();
      blob.append(JSON.stringify(json));

      this.blobURL = URL.createObjectURL(blob.getBlob(this.mimetype));
    },

    render: function() {
      this.setElement(this.template({ href: this.blobURL }));
      this.$el.modal();
      return this;
    },

    rename: function() {
      var name = this.$('.filename').val();
      if (!name.length) name = "scene.json";

      this.$('.download').attr('download', name);
    },

    close: function() {
      this.$el.modal('hide');
      this.remove();
    },

    cleanup: function() {
      _.delay(function(url) {
        URL.revokeObjectURL(url);
      }, 1000, this.blobURL);
    }

  });

});

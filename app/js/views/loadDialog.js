define(function(require) {

  var template = require('text!templates/load.html');

  return Backbone.View.extend({

    template: _.template(template),

    events: {
      "click .upload" : "load"
    },

    render: function() {
      this.setElement(this.template());
      this.$el.modal();
      return this;
    },

    load: function() {
      var files = this.$('.file')[0].files;
      if (files.length) {
        var file = files[0];
        var reader = new FileReader;

        reader.onload = _.bind(function(event) {
          var text = event.target.result;
          var json = JSON.parse(text);
          this.collection.reset(json);
        }, this);

        reader.readAsText(file);
      }
      this.close();
    },

    close: function() {
      this.$el.modal('hide');
      this.remove()
    }

  });

});

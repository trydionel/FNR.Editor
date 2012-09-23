define(function(require) {

  var template = require('text!templates/generate.html');
  var Maze = require('lib/maze');
  var SceneLoader = require('lib/sceneLoader');

  return Backbone.View.extend({

    template: _.template(template),

    events: {
      "change input"    : "resize",
      "click .generate" : "generate",
      "click .select"   : "select"
    },

    initialize: function() {
      this.maze = new Maze({ width: 10, height: 10 });
    },

    render: function() {
      this.setElement(this.template());
      this.generate();
      this.$el.modal();
      return this;
    },

    resize: function() {
      var w = parseInt(this.$('.width').val(), 10);
      var h = parseInt(this.$('.height').val(), 10);

      this.maze.width  = w;
      this.maze.height = h;
      this.generate();
    },

    updateProgress: function(pct) {
      if (Math.floor(pct) % 10 == 0) this.$('.progress .bar').width(pct + "%");
    },

    generate: function() {
      this.maze.build();
      this.maze.render(this.$('canvas')[0].getContext('2d'));
    },

    select: function() {
      var loader = new SceneLoader({ maze: this.maze, collection: this.collection });

      loader.on('progress', this.updateProgress, this);
      loader.on('done', this.close, this);

      loader.load();
    },

    close: function() {
      this.$el.modal('hide');
      this.remove()
    }

  });

});

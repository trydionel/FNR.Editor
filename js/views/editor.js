define(function(require) {
  return Backbone.View.extend({

    el: '#container .editor',

    gridColor: '#08C',

    events: {
      'mousedown canvas' : 'startDrawing',
      'mouseup canvas'   : 'stopDrawing',
      'mousemove canvas' : 'draw'
    },

    initialize: function(options) {
      options = options || {};
      if (!options.palette) throw "ArgumentError: Must supply a Prefab Palette";
      if (!options.layers) throw "ArgumentError: Must supply a layers view";

      var canvas = this.$('canvas')[0];

      this.width   = canvas.width;
      this.height  = canvas.height;
      this.palette = options.palette;
      this.layers  = options.layers;
      this.size    = options.size || { x: 80, y: 80 };
      this.drawing = false;
      this.ctx     = canvas.getContext('2d');
      this.cell    = {
        width: (this.width - 1) / this.size.x,
        height: (this.height - 1) / this.size.y
      };

      this.$el.scrollLeft(canvas.width / 4);
      this.$el.scrollTop(canvas.height / 4);

      this.collection.on('all', this.render, this);
      this.layers.on('change:layer', this.render, this);
    },

    startDrawing: function(event) {
      this.drawing = true;
      this.draw(event);
    },

    stopDrawing: function() {
      this.drawing = false;
    },

    draw: function(event) {
      event.preventDefault();

      if (!this.drawing) return;
      if (!this.palette.selection) return;
      if (typeof this.layers.selection == 'undefined') return;

      var cell = this.cellAtPosition({
        x: event.offsetX,
        y: event.offsetY
      });
      if (!cell) return;

      var preexisting = this.collection.detect(_.bind(function(block) {
        return block.get('x') == cell.x &&
          block.get('y') == this.layers.selection &&
          block.get('z') == cell.y;
      }, this));

      if (preexisting) {
        if (this.palette.selection == 'Erase') {
          this.collection.remove(preexisting);
        } else {
          preexisting.set({
            type: this.palette.selection,
            y: this.layers.selection
          });
        }
      } else {
        if (this.palette.selection == 'Erase') return;
        this.collection.add({
          type: this.palette.selection,
          x: cell.x,
          y: this.layers.selection,
          z: cell.y
        });
      }
    },

    cellAtPosition: function(position) {
      if (position.x < 0 || position.y < 0) return;
      if (position.x >= this.width || position.y >= this.height) return;

      var x = Math.floor(position.x / this.cell.width);
      var y = Math.floor(position.y / this.cell.height);

      return { x: x, y: y };
    },

    render: function() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawElements();
      this.drawGrid();
    },

    drawElements: function() {
      var inView = this.collection.filter(_.bind(function(block) {
        return block.get('y') == this.layers.selection;
      }, this));
      _.each(inView, _.bind(function(element) {
        var prefab = element.prefab();
        var color = new THREE.Color(prefab.get('color')).getContextStyle();

        this.ctx.fillStyle = color;
        this.ctx.fillRect(
          element.get('x') * this.cell.width,
          element.get('z') * this.cell.height,
          this.cell.width,
          this.cell.height);
      }, this));
    },

    drawGrid: function() {
      this.ctx.fillStyle = this.gridColor;

      for (var x = 0; x <= this.size.x; x++)
        this.ctx.fillRect(x * this.cell.width, 0, 1, this.height);
      for (var y = 0; y <= this.size.y; y++)
        this.ctx.fillRect(0, y * this.cell.height, this.width, 1);
    }
  });
});

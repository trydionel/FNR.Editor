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

      var canvas = this.$('canvas')[0];

      this.width   = canvas.width;
      this.height  = canvas.height;
      this.palette = options.palette;
      this.size    = options.size || { x: 40, y: 10 };
      this.drawing = false;
      this.ctx     = canvas.getContext('2d');
      this.cell    = {
        width: (this.width - 1) / this.size.x,
        height: (this.height - 1) / this.size.y
      };

      this.collection.on('all', this.render, this);
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

      var prefab = this.palette.prefab;
      var cell = this.cellAtPosition({
        x: event.offsetX,
        y: event.offsetY
      });
      if (!cell) return;

      var preexisting = this.collection.detect(function(element) {
        return element.get('x') == cell.x && element.get('z') == cell.y;
      });

      if (preexisting) {
        if (this.palette.selection == 'Erase') {
          this.collection.remove(preexisting);
        } else {
          preexisting.set({
            type: this.palette.selection,
            y: prefab.get('layer')
          });
        }
      } else {
        if (this.palette.selection == 'Erase') return;
        this.collection.add({
          type: this.palette.selection,
          x: cell.x,
          y: prefab.get('layer'),
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
      this.collection.each(_.bind(function(element) {
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

define(function(require) {

  function SceneLoader(options) {
    options = options || {};

    if (!options.maze) throw "ArgumentError: maze required";
    if (!options.collection) throw "ArgumentError: collection required";

    this.maze       = options.maze;
    this.collection = options.collection;
    this.totalOps   = this.maze.width * this.maze.height + 2 * (this.maze.width + this.maze.height) + 2;
    this.ops        = 0;
    this.progress   = 0;

    _.bindAll(this, 'waitForCompletion', 'updateProgress', 'loadCell', 'placeBlock', 'placeEdge');
  }

  _.extend(SceneLoader.prototype, Backbone.Events);

  SceneLoader.prototype.load = function() {
    // Place a crapton of blocks
    for (var x = 0; x < this.maze.width; x++) {
      for (var z = 0; z < this.maze.height; z++) {
        _.defer(this.loadCell, x, z);
      }
    }

    // Add surrounding walls
    for (var x = -1; x < 2 * this.maze.width; x++) {
      _.defer(this.placeEdge, x, null);
    }
    for (var z = -1; z < 2 * this.maze.height; z++) {
      _.defer(this.placeEdge, null, z);
    }

    this.waitForCompletion();
  };

  SceneLoader.prototype.waitForCompletion = function() {
    if (this.progress >= 100) {
      this.collection.trigger('reset');
      this.trigger('done');
    } else {
      _.defer(this.waitForCompletion);
    }
  };

  SceneLoader.prototype.updateProgress = function() {
    this.ops++;
    this.progress = this.ops / this.totalOps * 100;
    this.trigger('progress', this.progress);
  };

  SceneLoader.prototype.placeBlock = function(x, z, y, type) {
    var attributes = {
      x: x,
      y: y || 0,
      z: z,
      type: type || 'Shrub'
    };
    var options  = { silent: true };

    if (!this.collection.where(attributes).length) {
      this.collection.add(attributes, options);
    }
  };

  SceneLoader.prototype.placeEdge = function(x, z) {
    if (z === null) {
      this.placeBlock(x, -1);
      this.placeBlock(x, 2 * this.maze.height - 1);
    }
    if (x === null) {
      this.placeBlock(-1, z);
      this.placeBlock(2 * this.maze.width - 1, z);
    }
    this.updateProgress();
  };

  SceneLoader.prototype.loadCell = function(x, z) {
    this.placeBlock(2 * x, 2 * z, -1, 'Dirt');

    if (this.maze.hasNorthWall(x, z)) {
      this.placeBlock(2 * x    , 2 * z - 1);
      this.placeBlock(2 * x + 1, 2 * z - 1);
    }

    if (this.maze.hasSouthWall(x, z)) {
      this.placeBlock(2 * x    , 2 * z + 1);
      this.placeBlock(2 * x - 1, 2 * z + 1);
    } else {
      if (z < this.maze.height - 1) {
        this.placeBlock(2 * x, 2 * z + 1, -1, 'Dirt');
      }
    }

    if (this.maze.hasEastWall(x, z)) {
      this.placeBlock(2 * x + 1, 2 * z    );
      this.placeBlock(2 * x + 1, 2 * z + 1);
    } else {
      if (x < this.maze.width - 1) {
        this.placeBlock(2 * x + 1, 2 * z, -1, 'Dirt');
      }
    }

    if (this.maze.hasWestWall(x, z)) {
      this.placeBlock(2 * x - 1, 2 * z    );
      this.placeBlock(2 * x - 1, 2 * z - 1);
    }

    this.updateProgress();
  };

  return SceneLoader;

});

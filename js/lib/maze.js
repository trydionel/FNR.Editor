define(function(require) {

  /*
   * A Recursive Backtracker maze generator.
   * Implemented from Jamis Buck's Ruby version:
   *   https://gist.github.com/755866#file_recursive_backtracker2.rb
   */

  var N = 1, S = 2, E = 4, W = 8,
      DX = {}, DY = {}, OPPOSITE = {};

  DX[E] = 1; DX[W] = -1; DX[N] =  0; DX[S] = 0;
  DY[E] = 0; DY[W] =  0; DY[N] = -1; DY[S] = 1;
  OPPOSITE[E] = W; OPPOSITE[W] = E; OPPOSITE[N] = S; OPPOSITE[S] = N;

  function Maze(options) {
    options = options || {};

    this.width = options.width || 10;
    this.height = options.height || 10;
  }

  Maze.N = N;
  Maze.S = S;
  Maze.E = E;
  Maze.W = W;
  Maze.DIRECTIONS = [N, S, E, W];

  Maze.prototype.resetGrid = function() {
    this.grid = [];
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.grid[this.indexOf(x, y)] = 0;
      }
    }
  }

  Maze.prototype.build = function() {
    this.resetGrid();
    this.carvePassagesFrom(0, 0);
    return this.grid;
  };

  Maze.prototype.carvePassagesFrom = function(cx, cy) {
    var directions = this.randomDirections(),
        direction, nx, ny;

    for (var i = 0; i < directions.length; i++) {
      direction = directions[i];
      nx = cx + DX[direction];
      ny = cy + DY[direction];

      if (this.isValidPoint(nx, ny)) {
        this.grid[this.indexOf(cx, cy)] |= direction;
        this.grid[this.indexOf(nx, ny)] |= OPPOSITE[direction];
        this.carvePassagesFrom(nx, ny);
      }
    }
  };

  Maze.prototype.indexOf = function(x, y) {
    return this.width * y + x;
  };

  Maze.prototype.at = function(x, y) {
    return this.grid[this.indexOf(x, y)];
  };

  Maze.prototype.hasNorthWall = function(x, y) { return (this.at(x, y) & N) !== 0; };
  Maze.prototype.hasSouthWall = function(x, y) { return (this.at(x, y) & S) !== 0; };
  Maze.prototype.hasEastWall  = function(x, y) { return (this.at(x, y) & E) !== 0; };
  Maze.prototype.hasWestWall  = function(x, y) { return (this.at(x, y) & W) !== 0; };

  Maze.prototype.isValidPoint = function(x, y) {
    return (0 <= y && y < this.height) && (0 <= x && x < this.width) && (this.grid[this.indexOf(x, y)] === 0);
  };

  Maze.prototype.randomDirections = function() {
    var d = [N, S, E, W], out = [];
    while (d.length) out.push(d.splice(Math.random() * d.length, 1)[0]);
    return out;
  };

  Maze.prototype.render = function(context) {
    var canvas = context.canvas,
        w = Math.floor(canvas.width / this.width),
        h = Math.floor(canvas.height / this.height),
        cell;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        cell = this.grid[this.indexOf(x, y)];
        context.fillStyle = "#000";
        if ((cell & N) !== 0)
          context.fillRect(w * x, h * y, w, 1);
        if ((cell & S) !== 0)
          context.fillRect(w * x, h * (y + 1), w, 1);
        if ((cell & E) !== 0)
          context.fillRect(w * (x + 1), h * y, 1, h);
        if ((cell & W) !== 0)
          context.fillRect(w * x, h * y, 1, h);
      }
    }
    context.strokeRect(0, 0, this.width * w, this.height * h);
  };

  return Maze;
});

;(function(exports) {
  var Coquette = function(game, canvasId, width, height, backgroundColor, autoFocus) {
    var canvas = document.getElementById(canvasId);
    this.renderer = new exports.Renderer(this, game, canvas, width, height, backgroundColor);
    this.inputter = new exports.Inputter(this, canvas, autoFocus);
    this.entities = new exports.Entities(this, game);
    this.runner = new exports.Runner(this);
    this.collider = new exports.Collider(this);

    var self = this;
    this.ticker = new exports.Ticker(this, function(interval) {
      self.runner.update(interval);
      if (game.update !== undefined) {
        game.update(interval);
      }

      self.entities.update(interval)
      self.renderer.update(interval);
      self.collider.update(interval);
      self.inputter.update();
    });
  };

  exports.Coquette = Coquette;
})(this);

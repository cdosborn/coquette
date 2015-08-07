;(function(exports) {
  var Maths = Coquette.Collider.Maths;

  var Renderer = function(coquette, game, canvas, wView, hView, backgroundColor) {
    this.c = coquette;
    this.game = game;
    canvas.style.outline = "none"; // stop browser outlining canvas when it has focus
    canvas.style.cursor = "default"; // keep pointer normal when hovering over canvas
    this._ctx = canvas.getContext('2d');
    this._backgroundColor = backgroundColor;

    canvas.width = wView;
    canvas.height = hView;
    this._viewSize = { x:wView, y:hView };
    this._viewCenter = { x: this._viewSize.x / 2, y: this._viewSize.y / 2 };
    this._target = undefined;

  };

  Renderer.prototype = {
    getCtx: function() {
      return this._ctx;
    },

    getViewSize: function() {
      return this._viewSize;
    },

    getViewCenter: function() {
      return this._viewCenter;
    },

    setViewCenter: function(pos) {
      this._viewCenter.x = pos.x;
      this._viewCenter.y = pos.y;
    },

    follow: function(pos) {
      this._target = pos;
      this._viewCenter.x = pos.x;
      this._viewCenter.y = pos.y;
    },

    unfollow: function() {
      this._target = undefined;
    },

    setBackground: function(color) {
      this._backgroundColor = color;
    },

    update: function(interval) {
      var ctx = this.getCtx();

      if (this._target) {
          this._viewCenter.x = this._target.x;
          this._viewCenter.y = this._target.y;
      }

      var viewTranslate = viewOffset(this._viewCenter, this._viewSize);

      ctx.translate(viewTranslate.x, viewTranslate.y);

      // draw background
      var viewArgs = [
            this._viewCenter.x - this._viewSize.x / 2,
            this._viewCenter.y - this._viewSize.y / 2,
            this._viewSize.x,
            this._viewSize.y 
      ]
      if (this._backgroundColor !== undefined) {
          ctx.fillStyle = this._backgroundColor;
          ctx.fillRect.apply(ctx, viewArgs);
      } else {
          ctx.clearRect.apply(ctx, viewArgs);
      }

      // draw game and entities
      var drawables = [this.game]
        .concat(this.c.entities.all().sort(zindexSort));
      for (var i = 0, len = drawables.length; i < len; i++) {
        if (drawables[i].draw !== undefined) {
          var drawable = drawables[i];

          ctx.save();

          if (drawable.center !== undefined && drawable.angle !== undefined) {
            ctx.translate(drawable.center.x, drawable.center.y);
            ctx.rotate(drawable.angle * Maths.RADIANS_TO_DEGREES);
            ctx.translate(-drawable.center.x, -drawable.center.y);
          }

          drawables[i].draw(ctx);

          ctx.restore();
        }
      }

      ctx.translate(-viewTranslate.x, -viewTranslate.y);
    },

    onScreen: function(obj) {
      return Maths.rectanglesIntersecting(obj, {
        size: this._viewSize,
        center: {
          x: this._viewCenter.x,
          y: this._viewCenter.y
        }
      });
    }
  };

  var viewOffset = function(viewCenter, viewSize) {
    return {
      x: -(viewCenter.x - viewSize.x / 2),
      y: -(viewCenter.y - viewSize.y / 2)
    }
  };

  // sorts passed array by zindex
  // elements with a higher zindex are drawn on top of those with a lower zindex
  var zindexSort = function(a, b) {
    return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
  };

  exports.Renderer = Renderer;
})(typeof exports === 'undefined' ? this.Coquette : exports);

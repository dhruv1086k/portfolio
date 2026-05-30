function ParticleSlider(a) {
  var b = this;
  (b.sliderId = "particle-slider"),
    (b.color = "#fff"),
    (b.hoverColor = "#88f"),
    (b.width = 0),
    (b.height = 20),
    (b.ptlGap = 0),
    (b.ptlSize = 0.2),
    (b.slideDelay = 1),
    (b.arrowPadding = 10),
    (b.showArrowControls = !0),
    (b.onNextSlide = null),
    (b.onWidthChange = null),
    (b.onHeightChange = null),
    (b.onSizeChange = null),
    (b.monochrome = !1),
    (b.mouseForce = 1e4),
    (b.restless = !0),
    (b.imgs = []);
  if (a) {
    var c = [
      "color",
      "hoverColor",
      "width",
      "height",
      "ptlGap",
      "ptlSize",
      "slideDelay",
      "arrowPadding",
      "sliderId",
      "showArrowControls",
      "onNextSlide",
      "monochrome",
      "mouseForce",
      "restless",
      "imgs",
      "onSizeChange",
      "onWidthChange",
      "onHeightChange",
    ];
    for (var d = 0, e = c.length; d < e; d++) a[c[d]] && (b[c[d]] = a[c[d]]);
  }
  (b.$container = b.$("#" + b.sliderId)),
    (b.$$children = b.$container.childNodes),
    (b.$controlsContainer = b.$(".controls")),
    (b.$$slides = b.$(".slide", b.$(".slides").childNodes, !0)),
    (b.$controlLeft = null),
    (b.$controlRight = null),
    (b.$canv = b.$(".draw")),
    (b.$srcCanv = document.createElement("canvas")),
    (b.$srcCanv.style.display = "none"),
    b.$container.appendChild(b.$srcCanv),
    (b.$prevCanv = document.createElement("canvas")),
    (b.$prevCanv.style.display = "none"),
    b.$container.appendChild(b.$prevCanv),
    (b.$nextCanv = document.createElement("canvas")),
    (b.$nextCanv.style.display = "none"),
    b.$container.appendChild(b.$nextCanv),
    (b.$overlay = document.createElement("p")),
    b.$container.appendChild(b.$overlay),
    (b.imgControlPrev = null),
    (b.imgControlNext = null),
    b.$$slides.length <= 1 && (b.showArrowControls = !1),
    b.$controlsContainer &&
    b.$controlsContainer.childNodes &&
    b.showArrowControls == !0
      ? ((b.$controlLeft = b.$(".left", b.$controlsContainer.childNodes)),
        (b.$controlRight = b.$(".right", b.$controlsContainer.childNodes)),
        (b.imgControlPrev = new Image()),
        (b.imgControlNext = new Image()),
        (b.imgControlPrev.onload = function () {
          (b.$prevCanv.height = this.height),
            (b.$prevCanv.width = this.width),
            b.loadingStep();
        }),
        (b.imgControlNext.onload = function () {
          (b.$nextCanv.height = this.height),
            (b.$nextCanv.width = this.width),
            b.loadingStep();
        }),
        (b.imgControlPrev.src = b.$controlLeft.getAttribute("data-src")),
        (b.imgControlNext.src = b.$controlRight.getAttribute("data-src")))
      : (b.showArrowControls = !1),
    b.width <= 0 && (b.width = b.$container.clientWidth),
    b.height <= 0 && (b.height = b.$container.clientHeight),
    (b.mouseDownRegion = 0),
    (b.colorArr = b.parseColor(b.color)),
    (b.hoverColorArr = b.parseColor(b.hoverColor)),
    (b.mx = -1),
    (b.my = -1),
    (b.swipeOffset = 0),
    (b.cw = b.getCw()),
    (b.ch = b.getCh()),
    (b.frame = 0),
    (b.nextSlideTimer = !1),
    (b.currImg = 0),
    (b.lastImg = 0),
    (b.imagesLoaded = 0),
    (b.pxlBuffer = { first: null }),
    (b.recycleBuffer = { first: null }),
    (b.ctx = b.$canv.getContext("2d")),
    (b.srcCtx = b.$srcCanv.getContext("2d")),
    (b.prevCtx = b.$prevCanv.getContext("2d")),
    (b.nextCtx = b.$nextCanv.getContext("2d")),
    (b.$canv.width = b.cw),
    (b.$canv.height = b.ch),
    (b.shuffle = function () {
      var a, b;
      for (var c = 0, d = this.length; c < d; c++)
        (b = Math.floor(Math.random() * d)),
          (a = this[c]),
          (this[c] = this[b]),
          (this[b] = a);
    }),
    (Array.prototype.shuffle = b.shuffle),
    (b.$canv.onmouseout = function () {
      (b.mx = -1), (b.my = -1), (b.mouseDownRegion = 0);
    }),
    (b.$canv.onmousemove = function (a) {
      function c(a) {
        var c = 0,
          d = 0,
          e = typeof a == "string" ? b.$(a) : a;
        if (e) {
          (c = e.offsetLeft), (d = e.offsetTop);
          var f = document.getElementsByTagName("body")[0];
          while (e.offsetParent && e != f)
            (c += e.offsetParent.offsetLeft),
              (d += e.offsetParent.offsetTop),
              (e = e.offsetParent);
        }
        (this.x = c), (this.y = d);
      }
      var d = new c(b.$container);
      (b.mx =
        a.clientX -
        d.x +
        document.body.scrollLeft +
        document.documentElement.scrollLeft),
        (b.my =
          a.clientY -
          d.y +
          document.body.scrollTop +
          document.documentElement.scrollTop);
    }),
    (b.$canv.onmousedown = function () {
      if (b.imgs.length > 1) {
        var a = 0;
        b.mx >= 0 && b.mx < b.arrowPadding * 2 + b.$prevCanv.width
          ? (a = -1)
          : b.mx > 0 &&
            b.mx > b.cw - (b.arrowPadding * 2 + b.$nextCanv.width) &&
            (a = 1),
          (b.mouseDownRegion = a);
      }
    }),
    (b.$canv.onmouseup = function () {
      if (b.imgs.length > 1) {
        var a = "";
        b.mx >= 0 && b.mx < b.arrowPadding * 2 + b.$prevCanv.width
          ? (a = -1)
          : b.mx > 0 &&
            b.mx > b.cw - (b.arrowPadding * 2 + b.$nextCanv.width) &&
            (a = 1),
          a != 0 &&
            b.mouseDownRegion != 0 &&
            (a != b.mouseDownRegion && (a *= -1),
            b.nextSlideTimer && clearTimeout(b.nextSlideTimer),
            b.nextSlide(a)),
          (b.mouseDownRegion = 0);
      }
    });
  b.$canv.ontouchstart = function (e) {
    if (b.imgs.length > 1) {
      var a = 0;
      var touch = e.touches[0];
      var rect = b.$canv.getBoundingClientRect();
      var touchX = touch.clientX - rect.left;
      b.mx = touchX;
      b.mx >= 0 && b.mx < b.arrowPadding * 2 + b.$prevCanv.width
        ? (a = -1)
        : b.mx > 0 &&
          b.mx > b.cw - (b.arrowPadding * 2 + b.$nextCanv.width) &&
          (a = 1),
        (b.mouseDownRegion = a);
    }
  };

  b.$canv.ontouchmove = function (e) {
    var touch = e.touches[0];
    var rect = b.$canv.getBoundingClientRect();
    b.mx = touch.clientX - rect.left;
    b.my = touch.clientY - rect.top;
  };

  b.$canv.ontouchend = function (e) {
    if (b.imgs.length > 1) {
      var a = "";
      b.mx >= 0 && b.mx < b.arrowPadding * 2 + b.$prevCanv.width
        ? (a = -1)
        : b.mx > 0 &&
          b.mx > b.cw - (b.arrowPadding * 2 + b.$nextCanv.width) &&
          (a = 1),
        a != 0 &&
          b.mouseDownRegion != 0 &&
          (a != b.mouseDownRegion && (a *= -1),
          b.nextSlideTimer && clearTimeout(b.nextSlideTimer),
          b.nextSlide(a)),
        (b.mouseDownRegion = 0);
    }
  };
  if (b.imgs.length == 0)
    for (var d = 0, e = b.$$slides.length; d < e; d++) {
      var f = new Image();
      b.imgs.push(f), (f.src = b.$$slides[d].getAttribute("data-src"));
    }
  b.imgs.length > 0 &&
    (b.imgs[0].onload = function () {
      b.loadingStep();
    }),
    b.requestAnimationFrame(function () {
      b.nextFrame();
    });
}
var psParticle = function (a) {
  (this.ps = a),
    (this.ttl = null),
    (this.color = a.colorArr),
    (this.next = null),
    (this.prev = null),
    (this.gravityX = 0),
    (this.gravityY = 0),
    (this.x = Math.random() * a.cw),
    (this.y = Math.random() * a.ch),
    (this.velocityX = Math.random() * 5 - 2.5), // Reduced from 10 to 5
    (this.velocityY = Math.random() * 5 - 2.5);

};
(psParticle.prototype.move = function () {
  var a = this.ps,
    b = this;
  if (this.ttl != null && this.ttl-- <= 0)
    a.swapList(b, a.pxlBuffer, a.recycleBuffer), (this.ttl = null);
  else {
    var c = this.gravityX + a.swipeOffset - this.x,
      d = this.gravityY - this.y,
      e = Math.sqrt(Math.pow(c, 2) + Math.pow(d, 2)),
      f = Math.atan2(d, c),
      g = e * 0.005; // Reduced from 0.01 to 0.005
    a.restless == !0
      ? (g += Math.random() * 0.1 - 0.05)
      : g < 0.01 &&
        ((this.x = this.gravityX + 0.25), (this.y = this.gravityY + 0.25));
    var h = 0,
      i = 0;
    if (a.mx >= 0 && a.mouseForce) {
      var j = this.x - a.mx,
        k = this.y - a.my;
      (h = Math.min(
        a.mouseForce / (Math.pow(j, 2) + Math.pow(k, 2)),
        a.mouseForce
      )),
        (i = Math.atan2(k, j)),
        typeof this.color == "function" &&
          ((i += Math.PI), (h *= 0.001 + Math.random() * 0.1 - 0.05));
    } else (h = 0), (i = 0);
    (this.velocityX += g * Math.cos(f) + h * Math.cos(i)),
      (this.velocityY += g * Math.sin(f) + h * Math.sin(i)),
      (this.velocityX *= 0.89),  //damping effect
      (this.velocityY *= 0.89);
      (this.x += this.velocityX),
      (this.y += this.velocityY);
  }
}),
  (ParticleSlider.prototype.Particle = psParticle),
  (ParticleSlider.prototype.swapList = function (a, b, c) {
    var d = this;
    a == null
      ? (a = new d.Particle(d))
      : b.first == a
      ? a.next != null
        ? ((a.next.prev = null), (b.first = a.next))
        : (b.first = null)
      : a.next == null
      ? (a.prev.next = null)
      : ((a.prev.next = a.next), (a.next.prev = a.prev)),
      c.first == null
        ? ((c.first = a), (a.prev = null), (a.next = null))
        : ((a.next = c.first),
          (c.first.prev = a),
          (c.first = a),
          (a.prev = null));
  }),
  (ParticleSlider.prototype.parseColor = function (a) {
    var b,
      a = a.replace(" ", "");
    if ((b = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(a)))
      b = [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)];
    else if ((b = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(a)))
      b = [
        parseInt(b[1], 16) * 17,
        parseInt(b[2], 16) * 17,
        parseInt(b[3], 16) * 17,
      ];
    else if (
      (b = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(a))
    )
      b = [+b[1], +b[2], +b[3], +b[4]];
    else if ((b = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(a)))
      b = [+b[1], +b[2], +b[3]];
    else return null;
    isNaN(b[3]) && (b[3] = 1), (b[3] *= 255);
    return b;
  }),
  (ParticleSlider.prototype.loadingStep = function () {
    var a = this;
    a.imagesLoaded++;
    if (a.imagesLoaded >= 3 || a.showArrowControls == !1)
      a.resize(),
        a.slideDelay > 0 &&
          (a.nextSlideTimer = setTimeout(function () {
            a.nextSlide();
          }, 1e3 * a.slideDelay));
  }),
  (ParticleSlider.prototype.$ = function (a, b, c) {
    var d = this;
    if (a[0] == ".") {
      var e = a.substr(1);
      b || (b = d.$$children);
      var f = [];
      for (var g = 0, h = b.length; g < h; g++)
        b[g].className && b[g].className == e && f.push(b[g]);
      return f.length == 0 ? null : f.length == 1 && !c ? f[0] : f;
    }
    return document.getElementById(a.substr(1));
  }),
  (ParticleSlider.prototype.nextFrame = function () {
    var a = this;
    (a.mouseDownRegion == 1 && a.mx < a.cw / 2) ||
    (a.mouseDownRegion == -1 && a.mx > a.cw / 2)
      ? (a.swipeOffset = a.mx - a.cw / 2)
      : (a.swipeOffset = 0);
    var b = a.pxlBuffer.first,
      c = null;
    while (b != null) (c = b.next), b.move(), (b = c);
    a.drawParticles();
    if (a.frame++ % 25 == 0 && (a.cw != a.getCw() || a.ch != a.getCh())) {
      var d = a.getCh(),
        e = a.getCw();
      a.ch != e &&
        typeof a.onWidthChange == "function" &&
        a.onWidthChange(a, e),
        a.ch != d &&
          typeof a.onHeightChange == "function" &&
          a.onHeightChange(a, d),
        typeof a.onSizeChange == "function" && a.onSizeChange(a, e, d),
        a.resize();
    }
    setTimeout(function () {
      a.requestAnimationFrame(function () {
        a.nextFrame();
      });
    }, 15);
  }),
  (ParticleSlider.prototype.nextSlide = function (a) {
    var b = this;
    b.nextSlideTimer != null && b.imgs.length > 1
      ? ((b.currImg =
          (b.currImg + b.imgs.length + (a ? a : 1)) % b.imgs.length),
        b.resize(),
        b.slideDelay > 0 &&
          (b.nextSlideTimer = setTimeout(function () {
            b.nextSlide();
          }, 1e3 * b.slideDelay)))
      : b.slideDelay > 0 &&
        (b.nextSlideTimer = setTimeout(function () {
          b.nextSlide();
        }, 1e3 * b.slideDelay)),
      typeof b.onNextSlide == "function" && b.onNextSlide(b.currImg);
  }),
  (ParticleSlider.prototype.drawParticles = function () {
    var a = this,
      b = a.ctx.createImageData(a.cw, a.ch),
      c = b.data,
      d,
      e,
      f,
      g,
      h,
      i,
      j = a.pxlBuffer.first;
    while (j != null) {
      (e = ~~j.x), (f = ~~j.y);
      for (g = e; g < e + a.ptlSize && g >= 0 && g < a.cw; g++)
        for (h = f; h < f + a.ptlSize && h >= 0 && h < a.ch; h++)
          (d = (h * b.width + g) * 4),
            (i = typeof j.color == "function" ? j.color() : j.color),
            (c[d + 0] = i[0]),
            (c[d + 1] = i[1]),
            (c[d + 2] = i[2]),
            (c[d + 3] = i[3]);
      j = j.next;
    }
    (b.data = c), a.ctx.putImageData(b, 0, 0);
  }),
  (ParticleSlider.prototype.getPixelFromImageData = function (a, b, c) {
    var d = this,
      e = [];
    for (var f = 0; f < a.width; f += d.ptlGap + 1)
      for (var g = 0; g < a.height; g += d.ptlGap + 1)
        (i = (g * a.width + f) * 4),
          a.data[i + 3] > 0 &&
            e.push({
              x: b + f,
              y: c + g,
              color:
                d.monochrome == !0
                  ? [d.colorArr[0], d.colorArr[1], d.colorArr[2], d.colorArr[3]]
                  : [a.data[i], a.data[i + 1], a.data[i + 2], a.data[i + 3]],
            });
    return e;
  }),
  (ParticleSlider.prototype.init = function (a) {
    var b = this;
    if (b.imgs.length > 0) {
      (b.$srcCanv.width = b.imgs[b.currImg].width),
        (b.$srcCanv.height = b.imgs[b.currImg].height),
        b.srcCtx.clearRect(0, 0, b.$srcCanv.width, b.$srcCanv.height),
        b.srcCtx.drawImage(b.imgs[b.currImg], 0, 0);
      var c = b.getPixelFromImageData(
        b.srcCtx.getImageData(0, 0, b.$srcCanv.width, b.$srcCanv.height),
        ~~(b.cw / 2 - b.$srcCanv.width / 2),
        ~~(b.ch / 2 - b.$srcCanv.height / 2)
      );
      if (b.showArrowControls == !0) {
        b.prevCtx.clearRect(0, 0, b.$prevCanv.width, b.$prevCanv.height),
          b.prevCtx.drawImage(b.imgControlPrev, 0, 0);
        var d = b.getPixelFromImageData(
          b.prevCtx.getImageData(0, 0, b.$prevCanv.width, b.$prevCanv.height),
          b.arrowPadding,
          ~~(b.ch / 2 - b.$prevCanv.height / 2)
        );
        for (var e = 0, f = d.length; e < f; e++)
          (d[e].color = function () {
            return b.mx >= 0 && b.mx < b.arrowPadding * 2 + b.$prevCanv.width
              ? b.hoverColorArr
              : b.colorArr;
          }),
            c.push(d[e]);
        b.nextCtx.clearRect(0, 0, b.$nextCanv.width, b.$nextCanv.height),
          b.nextCtx.drawImage(b.imgControlNext, 0, 0);
        var g = b.getPixelFromImageData(
          b.nextCtx.getImageData(0, 0, b.$nextCanv.width, b.$nextCanv.height),
          b.cw - b.arrowPadding - b.$nextCanv.width,
          ~~(b.ch / 2 - b.$nextCanv.height / 2)
        );
        for (var e = 0, f = g.length; e < f; e++)
          (g[e].color = function () {
            return b.mx > 0 &&
              b.mx > b.cw - (b.arrowPadding * 2 + b.$nextCanv.width)
              ? b.hoverColorArr
              : b.colorArr;
          }),
            c.push(g[e]);
      }
      if (b.currImg != b.lastImg || a == !0)
        c.shuffle(), (b.lastImg = b.currImg);
      var h = b.pxlBuffer.first;
      for (var e = 0, f = c.length; e < f; e++) {
        var i = null;
        h != null
          ? ((i = h), (h = h.next))
          : (b.swapList(b.recycleBuffer.first, b.recycleBuffer, b.pxlBuffer),
            (i = b.pxlBuffer.first)),
          (i.gravityX = c[e].x),
          (i.gravityY = c[e].y),
          (i.color = c[e].color);
      }
      while (h != null)
        (h.ttl = ~~(Math.random() * 10)),
          (h.gravityY = ~~(b.ch * Math.random())),
          (h.gravityX = ~~(b.cw * Math.random())),
          (h = h.next);
      b.$overlay.innerHTML = b.$$slides[b.currImg].innerHTML;
    }
  }),
  (ParticleSlider.prototype.getCw = function () {
    var a = this;
    return Math.min(
      document.body.clientWidth,
      a.width,
      a.$container.clientWidth
    );
  }),
  (ParticleSlider.prototype.getCh = function () {
    var a = this;
    return Math.min(
      document.body.clientHeight,
      a.height,
      a.$container.clientHeight
    );
  }),
  (ParticleSlider.prototype.resize = function () {
    var a = this;
    (a.cw = a.getCw()),
      (a.ch = a.getCh()),
      (a.$canv.width = a.cw),
      (a.$canv.height = a.ch),
      a.init(!0);
  }),
  (ParticleSlider.prototype.setColor = function (a) {
    var b = this;
    b.colorArr = b.parseColor(a);
  }),
  (ParticleSlider.prototype.setHoverColor = function (a) {
    var b = this;
    b.hoverColorArr = b.parseColor(a);
  }),
  (ParticleSlider.prototype.requestAnimationFrame = function (a) {
    var b = this,
      c =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (a) {
          window.setTimeout(a, 1e3 / 60);
        };
    c(a);
    ParticleSlider.prototype.cyclePxlBuffer = function (a) {
      var b = this;
      var c = b.ctx;
      var d = b.cw;
      var e = b.ch;
      var c = this.ctx;
      c.globalAlpha = 0.7;
      c.fillStyle = "rgba(0, 0, 0, 0.8)"; // Apply slight blur
      c.fillRect(0, 0, d, e);
      c.globalAlpha = 1;
      var f = b.pxlBuffer.first;
      var g = b.recycleBuffer;
      while (f != null) {
        f.x += f.vx;
        f.y += f.vy;
        f.z += f.vz;
        f.life -= 0.1;
        f.s -= 0.01;
        if (f.s <= 0 || f.life <= 0) {
          b.pxlBuffer.first = f.next;
          f.next = g.first;
          g.first = f;
          f = b.pxlBuffer.first;
          continue;
        }
        if (a == !0) {
          f.vx += f.rand(-1, 1) / 100;
          f.vy += f.rand(-1, 1) / 100;
          f.vz += f.rand(-1, 1) / 100;
        }
        c.fillStyle =
          "rgba(" +
          f.r +
          "," +
          f.g +
          "," +
          f.b +
          "," +
          Math.min(1, Math.max(0, f.life / 10)) +
          ")";
        c.beginPath();
        c.arc(f.x, f.y, f.s, 0, 2 * Math.PI, !1);
        c.fill();
        f = f.next;
      }
    };
    ParticleSlider.prototype.addPxl = function (a, b, c, d, e) {
      var f = this;
      var g = f.recycleBuffer.first;
      if (g) {
        f.recycleBuffer.first = g.next;
        g.x = a;
        g.y = b;
        g.z = f.rand(-100, 100);
        g.r = c;
        g.g = d;
        g.b = e;
        g.vx = f.rand(-1, 1) / 4;
        g.vy = f.rand(-1, 1) / 4;
        g.vz = f.rand(-1, 1) / 4;
        g.life = f.rand(5, 10);
        g.s = 0.1 + f.rand(0, f.ptlSize / 100);
        return g;
      }
      return null;
    };
  });

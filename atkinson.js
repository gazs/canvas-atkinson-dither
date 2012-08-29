(function() {
  var Imagewell,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Imagewell = (function() {

    function Imagewell(element) {
      this.draw = __bind(this.draw, this);
      this.saveAndDraw = __bind(this.saveAndDraw, this);
      this.loadAndRender = __bind(this.loadAndRender, this);
      var _this = this;
      this.element = document.getElementById(element);
      this.canvas = document.createElement('canvas');
      if (!this.canvas.getContext) {
        alert("You need a browser capable of Canvas (and a lot of other things) to use this :(");
        return false;
      }
      this.element.addEventListener("dragover", function(e) {
        e.stopPropagation();
        return e.preventDefault();
      }, false);
      this.element.addEventListener("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
        return _this.element.className = "hover";
      }, false);
      this.element.addEventListener("dragleave", function(e) {
        e.stopPropagation();
        e.preventDefault();
        return _this.element.className = "emtpy";
      }, false);
      this.element.addEventListener("drop", function(e) {
        var file;
        e.stopPropagation();
        e.preventDefault();
        file = e.dataTransfer.files[0];
        if (!file.type.match('image')) return false;
        return _this.loadAndRender(file);
      }, false);
    }

    Imagewell.prototype.loadAndRender = function(file) {
      var reader,
        _this = this;
      reader = new FileReader();
      reader.onload = function(event) {
        return _this.saveAndDraw(event.target.result);
      };
      return reader.readAsDataURL(file);
    };

    Imagewell.prototype.saveAndDraw = function(dataurl) {
      this.originalpicture = dataurl;
      return this.draw(this.originalpicture);
    };

    Imagewell.prototype.draw = function(src, width, height) {
      var ctx, image,
        _this = this;
      if (src == null) src = this.originalpicture;
      if (width == null) width = 512;
      if (height == null) height = 384;
      ctx = this.canvas.getContext('2d');
      image = new Image();
      image.src = src;
      return image.onload = function() {
        var imgd, prop, worker, _i, _len, _ref;
        if (image.height > height || image.width > width) {
          if (image.height > image.width) {
            _this.canvas.height = height;
            _this.canvas.width = (height / image.height) * image.width;
          }
          if (image.width > image.height) {
            _this.canvas.width = width;
            _this.canvas.height = (width / image.width) * image.height;
          }
        } else {
          _ref = ['height', 'width'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            _this.canvas[prop] = image[prop];
          }
        }
        ctx.drawImage(image, 0, 0, _this.canvas.width, _this.canvas.height);
        imgd = ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
        worker = new Worker("worker.js");
        worker.addEventListener("message", function(event) {
          if (event.data.image) {
            ctx.putImageData(event.data.image, 0, 0);
            _this.element.src = _this.canvas.toDataURL("image/png");
            _this.element.className = "";
            document.getElementById("savetodesktop").disabled = false;
          }
          if (event.data.percent) {
            if (event.data.percent === 100) {
              document.getElementById("progresswindow").style.display = "none";
            } else {
              document.getElementById("progresswindow").style.display = "block";
            }
            document.getElementById("progressmessage").innerHTML = event.data.message;
            return document.getElementById("progresspercent").style.width = event.data.percent + "%";
          }
        }, false);
        worker.addEventListener("error", (function(e) {
          alert("error");
          return console.error(e);
        }), false);
        return worker.postMessage(imgd);
      };
    };

    return Imagewell;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    return window.imagewell = new Imagewell('imagewell');
  }, false);

}).call(this);

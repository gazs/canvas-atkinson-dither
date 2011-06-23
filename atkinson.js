(function() {
  var Imagewell;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Imagewell = (function() {
    function Imagewell(element) {
      this.draw = __bind(this.draw, this);;
      this.saveAndDraw = __bind(this.saveAndDraw, this);;
      this.loadAndRender = __bind(this.loadAndRender, this);;      this.element = document.getElementById(element);
      this.canvas = document.createElement('canvas');
      if (!this.canvas.getContext) {
        alert("You need a browser capable of Canvas (and a lot of other things) to use this :(");
        return false;
      }
      this.element.addEventListener("dragover", function(e) {
        e.stopPropagation();
        return e.preventDefault();
      }, false);
      this.element.addEventListener("dragenter", __bind(function(e) {
        e.stopPropagation();
        e.preventDefault();
        return this.element.className = "hover";
      }, this), false);
      this.element.addEventListener("dragleave", __bind(function(e) {
        e.stopPropagation();
        e.preventDefault();
        return this.element.className = "emtpy";
      }, this), false);
      this.element.addEventListener("drop", __bind(function(e) {
        var file;
        e.stopPropagation();
        e.preventDefault();
        file = e.dataTransfer.files[0];
        if (!file.type.match('image')) {
          return false;
        }
        return this.loadAndRender(file);
      }, this), false);
      this.element.addEventListener("dragstart", __bind(function(e) {
        event.dataTransfer.setData("text/uri-list", this.element.src);
        return event.dataTransfer.setData("text/plain", this.element.src);
      }, this), false);
    }
    Imagewell.prototype.loadAndRender = function(file) {
      var reader;
      reader = new FileReader();
      reader.onload = __bind(function(event) {
        return this.saveAndDraw(event.target.result);
      }, this);
      return reader.readAsDataURL(file);
    };
    Imagewell.prototype.saveAndDraw = function(dataurl) {
      this.originalpicture = dataurl;
      return this.draw(this.originalpicture);
    };
    Imagewell.prototype.draw = function(src, width, height) {
      var ctx, image;
      if (src == null) {
        src = this.originalpicture;
      }
      if (width == null) {
        width = 512;
      }
      if (height == null) {
        height = 384;
      }
      ctx = this.canvas.getContext('2d');
      image = new Image();
      image.src = src;
      return image.onload = __bind(function() {
        var imgd, prop, worker, _i, _len, _ref;
        if (image.height > height || image.width > width) {
          if (image.height > image.width) {
            this.canvas.height = height;
            this.canvas.width = (height / image.height) * image.width;
          }
          if (image.width > image.height) {
            this.canvas.width = width;
            this.canvas.height = (width / image.width) * image.height;
          }
        } else {
          _ref = ['height', 'width'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            this.canvas[prop] = image[prop];
          }
        }
        ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
        imgd = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        worker = new Worker("worker.js");
        worker.addEventListener("message", __bind(function(event) {
          if (event.data.image) {
            ctx.putImageData(event.data.image, 0, 0);
            this.element.src = this.canvas.toDataURL("image/png");
            this.element.className = "";
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
        }, this), false);
        worker.addEventListener("error", (function(e) {
          alert("error");
          return console.error(e);
        }), false);
        return worker.postMessage(imgd);
      }, this);
    };
    return Imagewell;
  })();
  document.addEventListener("DOMContentLoaded", function() {
    return window.imagewell = new Imagewell('imagewell');
  }, false);
}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  document.addEventListener("DOMContentLoaded", function() {
    var canvas, draw, imagewell;
    canvas = document.createElement('canvas');
    imagewell = document.getElementById('imagewell');
    draw = function(src) {
      var ctx, image;
      if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        image = new Image();
        image.src = src;
        return image.onload = function() {
          var imgd, prop, _i, _len, _ref;
          _ref = ['height', 'width'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            canvas[prop] = image[prop];
          }
          ctx.drawImage(image, 0, 0);
          imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
          window.worker = new Worker("worker.js");
          worker.addEventListener("message", function(event) {
            if (event.data.image) {
              ctx.putImageData(event.data.image, 0, 0);
              imagewell.src = canvas.toDataURL("image/png");
            }
            if (event.data.progress) {
              return console.log(event.data.progress);
            }
          }, false);
          worker.addEventListener("error", (function(event) {
            return alert("error");
          }), false);
          return worker.postMessage(imgd);
        };
      }
    };
    imagewell.addEventListener("dragover", __bind(function(event) {
      event.stopPropagation();
      return event.preventDefault();
    }, this), false);
    imagewell.addEventListener("drop", __bind(function(event) {
      var file, reader;
      event.stopPropagation();
      event.preventDefault();
      file = event.dataTransfer.files[0];
      console.log(event.dataTransfer.files[0]);
      if (!file.type.match('image.*')) {
        return false;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        return draw(e.target.result);
      };
      return reader.readAsDataURL(file);
    }, this), false);
    imagewell.addEventListener("dragstart", __bind(function(event) {
      console.log(imagewell.src);
      event.dataTransfer.setData("DownloadURL", imagewell.src);
      event.dataTransfer.setData("text/plain", imagewell.src);
      return console.log("dragging");
    }, this), false);
    return draw("default.png");
  }, false);
}).call(this);

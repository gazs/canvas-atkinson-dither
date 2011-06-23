(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  document.addEventListener("DOMContentLoaded", function() {
    var canvas, imagewell;
    canvas = document.createElement('canvas');
    imagewell = document.getElementById('imagewell');
    window.draw = function(src, width, height) {
      var ctx, image;
      if (width == null) {
        width = 512;
      }
      if (height == null) {
        height = 384;
      }
      document.body.style.cursor = "wait";
      if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        image = new Image();
        image.src = src;
        return image.onload = function() {
          var imgd, prop, _i, _len, _ref;
          if (image.height > 512 || image.width > 384) {
            console.log("nagy");
            if (image.height > image.width) {
              console.log("portrait");
              canvas.height = height;
              canvas.width = (height / image.height) * image.width;
            }
            if (image.width > image.height) {
              console.log("landscape");
              canvas.width = width;
              canvas.height = (width / image.width) * image.height;
            }
          } else {
            _ref = ['height', 'width'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prop = _ref[_i];
              canvas[prop] = image[prop];
            }
          }
          console.log(image.height, image.width, image.height / image.width, canvas.height, canvas.width, canvas.height / canvas.width);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
          window.worker = new Worker("worker.js");
          worker.addEventListener("message", function(event) {
            if (event.data.image) {
              ctx.putImageData(event.data.image, 0, 0);
              imagewell.src = canvas.toDataURL("image/png");
              document.body.style.cursor = "";
              document.getElementById("savetodesktop").disabled = false;
              imagewell.className = "";
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
    imagewell.addEventListener("dragenter", function(event) {
      return imagewell.className = "hover";
    }, false);
    imagewell.addEventListener("dragleave", function(event) {
      return imagewell.className = "empty";
    }, false);
    imagewell.addEventListener("drop", __bind(function(event) {
      var file, reader;
      event.stopPropagation();
      event.preventDefault();
      file = event.dataTransfer.files[0];
      if (!file.type.match('image.*')) {
        return false;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        return draw(e.target.result);
      };
      return reader.readAsDataURL(file);
    }, this), false);
    return imagewell.addEventListener("dragstart", __bind(function(event) {
      console.log(event.dataTransfer.files[0]);
      event.dataTransfer.setData("text/uri-list", imagewell.src);
      return event.dataTransfer.setData("text/plain", imagewell.src);
    }, this), false);
  }, false);
}).call(this);

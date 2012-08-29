(function() {
  var Draggable, init,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Draggable = (function() {

    function Draggable(handle, element) {
      this.element = element;
      this.up = __bind(this.up, this);
      this.move = __bind(this.move, this);
      this.down = __bind(this.down, this);
      handle.addEventListener("mousedown", this.down, false);
    }

    Draggable.prototype.getCssPos = function(side) {
      return parseInt(getComputedStyle(this.element)[side].replace("px", ""), 10);
    };

    Draggable.prototype.down = function(e) {
      var ev, _i, _len, _ref;
      this.isDown = true;
      _ref = ["move", "up"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ev = _ref[_i];
        document.addEventListener("mouse" + ev, this[ev], false);
      }
      this.offsettop = this.getCssPos("top") - e.clientY;
      return this.offsetleft = this.getCssPos("left") - e.clientX;
    };

    Draggable.prototype.move = function(e) {
      if (this.isDown) {
        this.element.style.top = e.clientY + this.offsettop + "px";
        return this.element.style.left = e.clientX + this.offsetleft + "px";
      }
    };

    Draggable.prototype.up = function(e) {
      var ev, _i, _len, _ref, _results;
      this.isDown = false;
      _ref = ["move", "up"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ev = _ref[_i];
        _results.push(document.removeEventListener("mouse" + ev, this[ev], false));
      }
      return _results;
    };

    return Draggable;

  })();

  init = function() {
    var closebutton, menuitem, savetodesktop, titlebar, uploadfromdesktop, w, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    if (!(!!window.File && !!window.FileList && !!window.FileReader)) {
      alert("This webpage won't work on your browser, try upgrading?");
    }
    _ref = document.querySelectorAll(".window");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      titlebar = w.querySelector("header");
      if (titlebar) new Draggable(titlebar, w);
    }
    _ref2 = document.querySelectorAll(".menu a");
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      menuitem = _ref2[_j];
      menuitem.addEventListener("click", function() {
        switch (this.id) {
          case 'help':
            return document.getElementById("helpwindow").style.display = "block";
          case 'about':
            return document.getElementById("aboutwindow").style.display = "block";
          case 'export':
            return savetodesktop();
          case 'import':
            return document.getElementById("uploadfromdesktop").click();
          default:
            return alert("not implemented yet");
        }
      }, false);
    }
    _ref3 = document.querySelectorAll(".close");
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      closebutton = _ref3[_k];
      closebutton.addEventListener("click", function() {
        return this.parentNode.parentNode.style.display = "none";
      }, false);
    }
    uploadfromdesktop = function() {
      var reader;
      reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      return reader.onloadend = function() {
        return imagewell.saveAndDraw(reader.result);
      };
    };
    savetodesktop = function() {
      if (imagewell.element.src.match("^data:image")) {
        return document.location.href = imagewell.element.src.replace("image/png", "image/octet-stream");
      }
    };
    document.getElementById("loadfromdesktop").addEventListener('click', (function() {
      return document.getElementById('uploadfromdesktop').click();
    }), false);
    document.getElementById("savetodesktop").addEventListener('click', savetodesktop, false);
    document.getElementById("uploadfromdesktop").addEventListener('change', uploadfromdesktop, false);
    return document.getElementById("size").addEventListener("change", function(e) {
      var height, newOption, selection, width, _ref4;
      if (e.target.value === "Other...") {
        selection = prompt("How big should the picture be?", "800x600");
        newOption = document.createElement("option");
        newOption.innerHTML = selection;
        e.target.appendChild(newOption);
        newOption.selected = true;
      } else {
        selection = e.target.value;
      }
      _ref4 = selection.split("x"), height = _ref4[0], width = _ref4[1];
      imagewell.draw(null, height, width);
      return console.log(e.target.value);
    }, false);
  };

  document.addEventListener('DOMContentLoaded', init, false);

}).call(this);

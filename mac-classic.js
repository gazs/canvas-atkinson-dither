(function() {
  var Draggable, init;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Draggable = (function() {
    function Draggable(handle, element) {
      this.element = element;
      this.up = __bind(this.up, this);;
      this.move = __bind(this.move, this);;
      this.down = __bind(this.down, this);;
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
    var actions, closebutton, menuitem, titlebar, w, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
    _ref = document.querySelectorAll(".window");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      titlebar = w.querySelector("header");
      if (titlebar) {
        new Draggable(titlebar, w);
      }
    }
    actions = {
      help: function() {
        return document.getElementById("helpwindow").style.display = "block";
      },
      about: function() {
        return document.getElementById("aboutwindow").style.display = "block";
      }
    };
    _ref2 = document.querySelectorAll(".menu a");
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      menuitem = _ref2[_j];
      menuitem.addEventListener("click", function() {
        try {
          return actions[this.id]();
        } catch (e) {
          return alert("not implemented yet");
        }
      }, false);
    }
    _ref3 = document.querySelectorAll(".close");
    _results = [];
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      closebutton = _ref3[_k];
      _results.push(closebutton.addEventListener("click", function() {
        return this.parentNode.parentNode.style.display = "none";
      }, false));
    }
    return _results;
  };
  document.addEventListener('DOMContentLoaded', init, false);
}).call(this);

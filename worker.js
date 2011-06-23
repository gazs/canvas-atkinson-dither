(function() {
  var atkinson, luminance, threshold;
  threshold = function(i) {
    if (i <= 127) {
      return 0;
    } else {
      return 255;
    }
  };
  luminance = function(imagedata) {
    var i, pixels, _ref;
    this.postMessage({
      percent: 0,
      message: "calculating luminance values..."
    });
    pixels = imagedata.data;
    for (i = 0, _ref = pixels.length; 0 <= _ref ? i <= _ref : i >= _ref; i += 4) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] = parseInt(pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11, 10);
    }
    return imagedata;
  };
  atkinson = function(imagedata) {
    var err, i, mono, one, pixels, w, _i, _len, _ref, _ref2;
    this.postMessage({
      percent: 50,
      message: "dithering..."
    });
    pixels = imagedata.data;
    w = imagedata.width;
    for (i = 0, _ref = pixels.length; 0 <= _ref ? i <= _ref : i >= _ref; i += 4) {
      mono = threshold(pixels[i]);
      err = parseInt((pixels[i] - mono) / 8, 10);
      pixels[i] = mono;
      _ref2 = [i + 4, i + 8, i + (4 * w) - 4, i + (4 * w), i + (4 * w) + 4, i + (8 * w)];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        one = _ref2[_i];
        pixels[one] += err;
      }
      pixels[i + 1] = pixels[i + 2] = pixels[i];
    }
    this.postMessage({
      percent: 100,
      message: "complete"
    });
    return imagedata;
  };
  this.addEventListener("message", function(event) {
    return this.postMessage({
      image: atkinson(luminance(event.data))
    });
  }, false);
}).call(this);

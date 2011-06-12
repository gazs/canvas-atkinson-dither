(function() {
  var atkinson, luminance, threshold;
  threshold = function(i) {
    if (i <= 128) {
      return 0;
    } else {
      return 255;
    }
  };
  luminance = function(imagedata) {
    var i, pixels, _ref;
    pixels = imagedata.data;
    for (i = 0, _ref = pixels.length; 0 <= _ref ? i <= _ref : i >= _ref; i += 4) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] = parseInt(pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11, 10);
    }
    this.postMessage({
      progress: "luminance done"
    });
    return imagedata;
  };
  atkinson = function(imagedata) {
    var err, i, mono, neighbours, one, pixels, w, _ref;
    pixels = imagedata.data;
    w = imagedata.width;
    for (i = 0, _ref = pixels.length; 0 <= _ref ? i <= _ref : i >= _ref; i += 4) {
      neighbours = [i + 4, i + 8, i + (4 * w) - 4, i + (4 * w), i + (4 * w) + 4, i + (8 * w)];
      mono = threshold(pixels[i]);
      err = parseInt((pixels[i] - mono) / 8, 10);
      pixels[i] = mono;
      for (one in neighbours) {
        pixels[neighbours[one]] += err;
      }
      pixels[i + 1] = pixels[i + 2] = pixels[i];
    }
    this.postMessage({
      progress: "atkinson done"
    });
    return imagedata;
  };
  this.addEventListener("message", function(event) {
    return this.postMessage({
      image: atkinson(luminance(event.data))
    });
  });
}).call(this);

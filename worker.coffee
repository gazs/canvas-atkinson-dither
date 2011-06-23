threshold = (i) -> if i <= 127 then 0 else 255

luminance = (imagedata) ->
  @postMessage percent: 0, message: "calculating luminance values..."
  pixels = imagedata.data
  for i in [0..pixels.length] by 4
    # luminance: red x 0.3 + green x 0.59 + blue x 0.11
    pixels[i] = pixels[i+1] = pixels[i+2] =
      parseInt(
        pixels[i] * 0.3 +
        pixels[i+1] * 0.59 +
        pixels[i+2] * 0.11
      , 10)
  return imagedata

atkinson = (imagedata) ->
  @postMessage percent: 50, message: "dithering..."
  pixels = imagedata.data
  w = imagedata.width
  for i in [0..pixels.length] by 4 # = r, g, b, a
    mono = threshold pixels[i]
    err  = parseInt (pixels[i] - mono) / 8, 10
    pixels[i] = mono
    for one in [i+4, i+8, i+(4*w)-4, i+(4*w), i+(4*w)+4, i+(8*w)]
      pixels[one] += err
    pixels[i+1] = pixels[i+2] = pixels[i]
  @postMessage percent: 100, message: "complete"
  return imagedata

@addEventListener "message", (event) ->
  @postMessage image: atkinson luminance event.data
,false

threshold = (i) -> if i <= 128 then 0 else 255

luminance = (imagedata) ->
  pixels = imagedata.data
  for i in [0..pixels.length] by 4
    # luminance: red x 0.3 + green x 0.59 + blue x 0.11
    pixels[i] = pixels[i+1] = pixels[i+2] =
      parseInt(
        pixels[i] * 0.3 +
        pixels[i+1] * 0.59 +
        pixels[i+2] * 0.11
      , 10)
  #@postMessage progress: "luminance done"
  return imagedata

atkinson = (imagedata) ->
  pixels = imagedata.data
  w = imagedata.width
  for i in [0..pixels.length] by 4
    neighbours = [i+4, i+8, i+(4*w)-4, i+(4*w), i+(4*w)+4, i+(8*w)]
    mono = threshold pixels[i]
    err  = parseInt (pixels[i] - mono) / 8, 10
    pixels[i] = mono
    for one of neighbours
      pixels[neighbours[one]] += err
    pixels[i+1] = pixels[i+2] = pixels[i]
  #@postMessage progress: "atkinson done"
  return imagedata

@process = (image) -> atkinson luminance image

@addEventListener "message", (event) ->
  @postMessage image: atkinson luminance event.data

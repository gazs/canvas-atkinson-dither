threshold = (i) -> if <= 128 then 0 else 255

luminance = (imagedata) ->
  pixels = imagedata.data
  for i in pixels by 4
    # luminance: red x 0.3 + green x 0.59 + blue x 0.11
    pixels[i] = pixels[i+1] = pixels[i+2] =
      parseInt(
        pixels[i] * 0.3 +
        pixels[i+1] * 0.59 +
        pixels[i+2] * 0.11
      , 10)
  return imagedata

atkinson = (imagedata) ->
  pixels = imagedata.data
  w = imagedata.width
  for i in pixels by 4
    neighbours = [i+4, i+8, i+(4*w)-4, i+(4*w), i+(4*w)+4, i+(8*w)]
    mono = threshold pixels[i]
    err  = parseInt (pixels[i] - mono) / 8, 10
    pixels[i] = mono
    for one of neighbours
      pixels[neighbours[one]] += err
    pixels[i+1] = pixels[i+2] = pixels[i]
  return imagedata

draw = ->
  canvas = document.getElementById 'canvas'
  if canvas.getContext
    ctx = canvas.getContext('2d')
    image = new Image()
    image.src = "61172_435393065145_722715145_5755463_36797_n.jpg"
    image.onload = ->
      canvas[prop] = image[prop] for prop in ['height', 'width']
      ctx.drawImage image, 0, 0
      imagedata = ctx.getImageData 0, 0, canvas.width, canvas.height
      ctx.putImageData atkinson(luminance(imagedata)), 0, 0

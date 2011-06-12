document.addEventListener "DOMContentLoaded", ->
  canvas = document.getElementById 'canvas'

  draw = (src) ->
    canvas = document.getElementById 'canvas'
    if canvas.getContext
      ctx = canvas.getContext('2d')
      image = new Image()
      image.src = src
      image.onload = ->
        canvas[prop] = image[prop] for prop in ['height', 'width']
        ctx.drawImage image, 0, 0
        # must be run from server (or loaded from data uri), otherwise raises 'DOM Exception 18'
        imgd = ctx.getImageData(0,0,canvas.width,canvas.height);
        window.worker = new Worker "worker.js"
        worker.addEventListener "message", (event) ->
          if event.data.image
            ctx.putImageData event.data.image, 0, 0;
          if event.data.progress
            console.log event.data.progress
        worker.addEventListener "error", (event) -> alert "error"
        worker.postMessage imgd

  canvas.addEventListener "dragover", (event) =>
    event.stopPropagation()
    event.preventDefault()
  , false

  canvas.addEventListener "drop", (event) =>
    event.stopPropagation()
    event.preventDefault()
    file = event.dataTransfer.files[0]
    console.log file.type
    return false unless file.type.match('image.*')
    reader = new FileReader()
    reader.onload = (e) -> draw e.target.result
    reader.readAsDataURL file 
  , false

  draw("default.png")
, false


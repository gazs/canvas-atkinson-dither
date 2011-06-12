document.addEventListener "DOMContentLoaded", ->

  canvas = document.createElement 'canvas'
  imagewell = document.getElementById 'imagewell'

  draw = (src) ->
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
            imagewell.src = canvas.toDataURL("image/png")
          if event.data.progress
            console.log event.data.progress
        , false
        worker.addEventListener "error",((event) -> alert "error"), false
        worker.postMessage imgd

  imagewell.addEventListener "dragover", (event) =>
    event.stopPropagation()
    event.preventDefault()
  , false

  imagewell.addEventListener "drop", (event) =>
    event.stopPropagation()
    event.preventDefault()
    file = event.dataTransfer.files[0]
    console.log event.dataTransfer.files[0]
    return false unless file.type.match('image.*')
    reader = new FileReader()
    reader.onload = (e) -> draw e.target.result
    reader.readAsDataURL file 
  , false

  imagewell.addEventListener "dragstart", (event) =>
    console.log imagewell.src
    event.dataTransfer.setData("DownloadURL",imagewell.src)
    event.dataTransfer.setData("text/plain", imagewell.src)
    console.log "dragging"
  ,false
  draw("default.png")
, false


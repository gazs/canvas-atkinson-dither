document.addEventListener "DOMContentLoaded", ->

  canvas = document.createElement 'canvas'
  imagewell = document.getElementById 'imagewell'

  window.draw = (src, width=512, height=384) ->
    document.body.style.cursor = "wait"
    if canvas.getContext
      ctx = canvas.getContext('2d')
      image = new Image()
      image.src = src
      image.onload = ->
        if image.height > 512 or image.width > 384
          if image.height > image.width
            canvas.height = height
            canvas.width = (height/image.height) * image.width
          if image.width > image.height
            canvas.width = width
            canvas.height = (width/image.width) * image.height
        else 
          canvas[prop] = image[prop] for prop in ['height', 'width']
        ctx.drawImage image, 0, 0, canvas.width, canvas.height
        imgd = ctx.getImageData(0,0,canvas.width,canvas.height);
        window.worker = new Worker "worker.js"
        worker.addEventListener "message", (event) ->
          if event.data.image
            ctx.putImageData event.data.image, 0, 0;
            imagewell.src = canvas.toDataURL("image/png")
            document.body.style.cursor = ""
            document.getElementById("savetodesktop").disabled = false
            imagewell.className = ""
          if event.data.percent
            unless event.data.percent is 100
              document.getElementById("progresswindow").style.display = "block"
              document.getElementById("progresspercent").style.width = event.data.percent + "%"
              document.getElementById("progressmessage").innerHTML = event.data.message
            else
              document.getElementById("progresswindow").style.display = "none"
        , false
        worker.addEventListener "error",((event) -> alert "error"), false
        worker.postMessage imgd

  imagewell.addEventListener "dragover", (event) =>
    event.stopPropagation()
    event.preventDefault()
  , false

  imagewell.addEventListener "dragenter", (event) ->
    event.stopPropagation()
    event.preventDefault()
    imagewell.className = "hover"
  , false
  imagewell.addEventListener "dragleave", (event) ->
    event.stopPropagation()
    event.preventDefault()
    imagewell.className = "empty"
  , false

  imagewell.addEventListener "drop", (event) =>
    event.stopPropagation()
    event.preventDefault()
    file = event.dataTransfer.files[0]
    return false unless file.type.match('image.*')
    reader = new FileReader()
    reader.onload = (e) -> draw e.target.result
    reader.onerror = (e) -> alert "FileReader error"

    reader.readAsDataURL file 
    console.log "drop done"
  , false

  imagewell.addEventListener "dragstart", (event) =>
    console.log event.dataTransfer.files[0]
    event.dataTransfer.setData("text/uri-list", imagewell.src)
    event.dataTransfer.setData("text/plain", imagewell.src)
  ,false
, false


class Imagewell
  constructor: (element) ->
    @element = document.getElementById element
    @canvas = document.createElement 'canvas'
    unless @canvas.getContext
      alert "You need a browser capable of Canvas (and a lot of other things) to use this :("
      return false
    @element.addEventListener "dragover", (e) ->
      e.stopPropagation()
      e.preventDefault()
    , false
    @element.addEventListener "dragenter", (e) =>
      e.stopPropagation()
      e.preventDefault()
      @element.className = "hover"
    , false
    @element.addEventListener "dragleave", (e) =>
      e.stopPropagation()
      e.preventDefault()
      @element.className = "emtpy"
    , false
    @element.addEventListener "drop", (e) =>
      e.stopPropagation()
      e.preventDefault()
      file = e.dataTransfer.files[0]
      return false unless file.type.match('image')
      @loadAndRender(file)
    ,false
    @element.addEventListener "dragstart", (e) =>
      event.dataTransfer.setData("text/uri-list", @element.src)
      event.dataTransfer.setData("text/plain", @element.src)
    ,false
  loadAndRender: (file) =>
    reader = new FileReader()
    reader.onload = (event) =>
      @saveAndDraw event.target.result
    reader.readAsDataURL file 
  saveAndDraw: (dataurl) =>
    @originalpicture = dataurl 
    @draw @originalpicture

  draw: (src=@originalpicture, width=512, height=384) =>
    ctx = @canvas.getContext '2d'
    image = new Image()
    image.src = src
    image.onload = =>
        if image.height > 512 or image.width > 384
          if image.height > image.width
            @canvas.height = height
            @canvas.width = (height/image.height) * image.width
          if image.width > image.height
            @canvas.width = width
            @canvas.height = (width/image.width) * image.height
        else 
          @canvas[prop] = image[prop] for prop in ['height', 'width']
        ctx.drawImage image, 0, 0, @canvas.width, @canvas.height
        imgd = ctx.getImageData 0, 0, @canvas.width, @canvas.height
        worker = new Worker "worker.js"
        worker.addEventListener "message", (event) =>
          if event.data.image
            ctx.putImageData event.data.image, 0, 0
            @element.src = @canvas.toDataURL "image/png"
            @element.className = ""
            document.getElementById("savetodesktop").disabled = false # TODO: hardcoding ghraaargh
          if event.data.percent
            if event.data.percent is 100
              document.getElementById("progresswindow").style.display = "none"
            else
              document.getElementById("progresswindow").style.display = "block"
            document.getElementById("progressmessage").innerHTML = event.data.message
            document.getElementById("progresspercent").style.width = event.data.percent + "%"
        , false
        worker.addEventListener "error", ((e) -> alert "error"; console.error e), false
        worker.postMessage imgd


document.addEventListener "DOMContentLoaded", ->

  window.imagewell = new Imagewell 'imagewell'
, false


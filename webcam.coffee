window.requestAnimFrame = do ->
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  # probably overkill
  (cb) ->
    window.setTimeout cb, 1000 / 60


$ ->

  getWebcam  = ->
    deferred = $.Deferred()
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
    deferred.reject() unless navigator.getUserMedia

    navigator.getUserMedia 'video', deferred.resolve, deferred.reject
    return deferred.promise()

  getWebcam()
    .fail (err) ->
      alert "could not get webcam"

    .then (stream) ->

      source = $("canvas").get(0)
      ctx = source.getContext "2d"

      vdef = $.Deferred()

      vid = document.createElement "video"

      windowurl = window.URL || window.webkitURL
      vid.src = if windowurl then windowurl.createObjectURL(stream) else stream

      $(vid).on "loadedmetadata", ->
        ctx.canvas.width = vid.videoWidth
        ctx.canvas.height = vid.videoHeight

      $(vid).on "canplay", -> # XXX deferreds are cleaner, but piping them is... weird?
        window.vid = vid

        draw= ->
          requestAnimFrame(draw)
          
          ctx.drawImage(vid, 0, 0, ctx.canvas.width, ctx.canvas.height)
          pixels = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height)
          ctx.putImageData(process(pixels), 0, 0)

        console.log "can play"
        draw()
        
        vdef.resolve()

      vid.loop = vid.muted = true
      vid.load()
      vid.play()




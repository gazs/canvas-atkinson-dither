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
    if navigator.getUserMedia
      navigator.getUserMedia 'video', deferred.resolve, deferred.reject
    else
      deferred.reject()

    return deferred.promise()

  getWebcam()

    .pipe (stream) ->

      source = $("canvas").get(0)
      ctx = source.getContext "2d"

      deferred = $.Deferred()

      vid = document.createElement "video"

      windowurl = window.URL || window.webkitURL
      vid.src = if windowurl then windowurl.createObjectURL(stream) else stream

      $(vid).on "loadedmetadata", ->
        div = 1
        ctx.canvas.width = vid.videoWidth / div
        ctx.canvas.height = vid.videoHeight / div

      $(vid).on "canplay", -> deferred.resolve(ctx, vid)
      $(vid).on "error", -> deferred.reject()

      vid.loop = vid.muted = true
      vid.load()
      vid.play()

      return deferred.promise()

    .then (ctx, vid) ->
      draw= ->
        requestAnimFrame(draw)
        ctx.drawImage(vid, 0, 0, ctx.canvas.width, ctx.canvas.height)
        pixels = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height)
        ctx.putImageData(process(pixels), 0, 0)

      draw()
    .fail (err) ->
      alert "could not get webcam"

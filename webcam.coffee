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
      vdef = $.Deferred()

      vid = document.createElement "video"

      windowurl = window.URL || window.webkitURL
      vid.src = if windowurl then windowurl.createObjectURL(stream) else stream

      $(vid).on "canplay", -> # XXX deferreds are cleaner, but piping them is... weird?

        draw= ->
          requestAnimFrame(draw)
          ctx = $("canvas").get(0).getContext "2d"
          ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight, 0, 0, 640, 480)

        console.log "can play"
        draw()
        
        vdef.resolve()

      vid.loop = vid.muted = true
      vid.load()
      vid.play()




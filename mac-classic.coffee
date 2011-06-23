class Draggable
  constructor: (handle, @element)->
    handle.addEventListener "mousedown", @down, false
  getCssPos: (side) ->
    parseInt(getComputedStyle(@element)[side].replace("px", ""), 10)
  down: (e) =>
    @isDown = true
    document.addEventListener("mouse#{ev}", @[ev], false) for ev in ["move", "up"]
    @offsettop = @getCssPos("top") - e.clientY
    @offsetleft = @getCssPos("left") - e.clientX
  move: (e) =>
    if @isDown
      @element.style.top = e.clientY + @offsettop + "px"
      @element.style.left = e.clientX + @offsetleft + "px"
  up: (e) =>
    @isDown= false
    document.removeEventListener "mouse#{ev}", @[ev], false for ev in ["move", "up"]



init= ->
  for w in document.querySelectorAll ".window"
    titlebar = w.querySelector "header"
    new Draggable titlebar, w if titlebar

  for menuitem in document.querySelectorAll ".menu a"
    menuitem.addEventListener "click", ->
      switch @id
        when 'help' then document.getElementById("helpwindow").style.display = "block"
        when 'about' then document.getElementById("aboutwindow").style.display = "block"
        when 'export' then savetodesktop()
        when 'import' then document.getElementById("uploadfromdesktop").click()
        else alert "not implemented yet"
    , false

  for closebutton in document.querySelectorAll ".close"
    closebutton.addEventListener "click", ->
      @parentNode.parentNode.style.display = "none"
    , false

  uploadfromdesktop = ->
    draw @files[0].getAsDataURL()

  savetodesktop = ->
    imagewell = document.getElementById "imagewell"
    if imagewell.src.match "^data:image"
      document.location.href = imagewell.src.replace("image/png", "image/octet-stream")

  document.getElementById("loadfromdesktop").addEventListener 'click', (-> document.getElementById('uploadfromdesktop').click()), false
  document.getElementById("savetodesktop").addEventListener 'click', savetodesktop, false
  document.getElementById("uploadfromdesktop").addEventListener 'change', uploadfromdesktop, false

document.addEventListener 'DOMContentLoaded', init, false

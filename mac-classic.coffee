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

  actions =
    help: ->
      document.getElementById("helpwindow").style.display = "block"
    about: ->
      document.getElementById("aboutwindow").style.display = "block"
  for menuitem in document.querySelectorAll ".menu a"
    menuitem.addEventListener "click", ->
      try
        actions[this.id]()
      catch e
        alert "not implemented yet"
    , false

  for closebutton in document.querySelectorAll ".close"
    closebutton.addEventListener "click", ->
      @parentNode.parentNode.style.display = "none"
    , false

document.addEventListener 'DOMContentLoaded', init, false

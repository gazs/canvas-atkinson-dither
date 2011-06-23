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
    #draw @files[0].getAsDataURL()
    imagewell.saveAndDraw @files[0].getAsDataURL()

  savetodesktop = ->
    if imagewell.element.src.match "^data:image"
      #try
        #blob = new MozBlobBuilder()
        #blob.contentType("image/png")
        #blob.append atob imagewell.src
        #console.log blob
      #catch e
        ## BlobBuilder is so bleeding edge it hurts
      # for now we have to hack our way out of the browser
      document.location.href = imagewell.element.src.replace("image/png", "image/octet-stream")

  document.getElementById("loadfromdesktop").addEventListener 'click', (-> document.getElementById('uploadfromdesktop').click()), false
  document.getElementById("savetodesktop").addEventListener 'click', savetodesktop, false
  document.getElementById("uploadfromdesktop").addEventListener 'change', uploadfromdesktop, false
  document.getElementById("size").addEventListener "change", (e) ->
    if e.target.value is "Other..." # TODO: fujjhardkód
      selection = prompt "How big should the picture be?", "800x600"
      newOption = document.createElement "option"
      newOption.innerHTML = selection
      e.target.appendChild newOption
      newOption.selected = true
    else
      selection = e.target.value
    [height,width] = selection.split("x")
    imagewell.draw null, height, width

    console.log (e.target.value)
  ,false

document.addEventListener 'DOMContentLoaded', init, false

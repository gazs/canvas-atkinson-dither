# Atkinson dithering example using Canvas, WebWorkers and FileReader

The classic Macintosh 1-bit filter, as used by [Hyperdither][1]

Compares every pixel to 50% grey, then changes them to either black or white. The difference between the input and the output is then distributed to the neighbouring pixels [as follows][2] (X is the current pixel):

         X  1/8 1/8
    1/8 1/8 1/8
        1/8

This code uses [Drag and Drop events][5], [WebWorkers][3] and the [FileReader][4] API so you'll need a current browser to try it.

(Oh, and of course, CoffeeScript, to compile the files into JS)

[1]:https://www.tinrocket.com/content/hyperdither/
[2]:https://web.archive.org/web/20200111194326/verlagmartinkoch.at/software/dither/index.html
[3]:https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[4]:https://developer.mozilla.org/en/DOM/FileReader
[5]:http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-selecting-files-dnd

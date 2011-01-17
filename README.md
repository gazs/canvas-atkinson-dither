# Atkinson dithering canvasben

A klasszikus macintoshos egybites filter, as seen on [Hyperdither][1]

Minden pixelt 50% szürkéhez hasonlít, attól függően melyikhez van közelebb, feketére vagy fehérre színezi. Az értékkülönbséget a szomszédos pixelek között [osztja szét][2]:

         X  1/8 1/8
    1/8 1/8 1/8
        1/8

Milyen jó lenne, ha tudnék betölteni képet a canvasba fájlból is, nem csak url-ből, onnan kezdve lenne értelme is ennek az ujjgyakorlatnak. Ha nagyon ráérnék, lehetne webworkeresíteni is.


[1]:http://www.tinrocket.com/software/hyperdither/
[2]:http://verlagmartinkoch.at/software/dither/index.html

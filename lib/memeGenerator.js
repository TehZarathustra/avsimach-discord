'use strict';

const memeLib = require('nodejs-meme-generator');
 
const memeGenerator = new memeLib({
  canvasOptions: { // optional
    canvasWidth: 500,
    canvasHeight: 500
  },
  fontOptions: { // optional
    fontSize: 44,
    fontFamily: 'impact'
  }
});

function generator (url, textBottom, textTop) {
	return memeGenerator.generateMeme({
      topText: textTop || null,
      bottomText: textBottom,
      url: url
    });
}

module.exports = generator;

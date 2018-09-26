'use strict';

const memeLib = require('nodejs-meme-generator');
 
const memeGenerator = new memeLib({
  canvasOptions: { // optional
    canvasWidth: 600,
    canvasHeight: 600
  },
  fontOptions: { // optional
    fontSize: 46,
    fontFamily: 'impact',
    lineHeight: 2
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

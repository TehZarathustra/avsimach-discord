'use strict';

// const memeLib = require('nodejs-meme-generator');
 
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

const memeGenerator = {};

function generator(url, textBottom, textTop) {
	return memeGenerator.generateMeme({
      topText: textTop || null,
      bottomText: textBottom,
      url: url
    });
}

const generatorEntry = {
  memeGenerator: {
    pattern: /начальник, сделай мем/i,
    reply: (message, Discord) => {
      const [match, url, textBottom, textTop] = message.content.split('\n');

      if (!url || !textBottom) {
        message.replay('передай заявку на мем в правильном формате');
      }

      generator(url, textBottom, textTop)
        .then(buffer => {
          const attachment = new Discord.Attachment(buffer, 'meme.png');

          message.reply(`${message.author}`, attachment);
          message.delete();
        })
        .catch(error => {
          console.log('error >>>>', error);
        })
    }
  }
};

module.exports = generatorEntry;

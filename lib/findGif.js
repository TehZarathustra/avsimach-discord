const {getImgurGif} = require('./imgur');
const askForMeme = require('./askForMeme');
const SHOW_REGEX = /покажи\s(.*)$/gi;

function findGif(message) {
	message.content.match(SHOW_REGEX);
	const query = encodeURI(RegExp.$1);

	getImgurGif(message, query);
}

function findGifEntry(message) {
	askForMeme(message, 'default', findGif);
}

module.exports = {
	findGifEntry: {
		findGif: {
			pattern: /начальник, покажи|начальник покажи/i,
			reply: findGifEntry
		}
	}
};

const {getImgurGif} = require('./imgur');
const {askForMeme} = require('./askForMeme');
const {searchRaw} = require('./giphy');
const SHOW_REGEX = /покажи\s(.*)$/gi;

function findGif(message) {
	message.content.match(SHOW_REGEX);
	const query = encodeURI(RegExp.$1);

	getImgurGif(null, query)
		.then((item) => {
			if (item) {
				message.reply(item);
				throw false;
			}
		})
		.then(() => searchRaw(query))
		.then((item) => {
			if (item) {
				return message.reply(item.url);
			}

			throw 'ничего не нашел';
		})
		.catch((error) => {
			error ? message.reply(error) : null
		});
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

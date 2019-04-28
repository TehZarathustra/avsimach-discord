const {
	isPolite,
	isRude,
	rollByChance,
	cleanFromPoliteAndRude,
	getRandomByLength
} = require('./utils');

const NO_MEMES_RESPONSE = {
	mig21: [
		'талоны на миг закончились',
		'талоны на фишбед закончились',
		'талонов на балалайку больше нет',
		'вот бы был талон на миг...'
	],
	default: [
		'талоны закончились',
		'талон бы',
		'очень хочется талон',
		'нужен талон',
		'талонов больше нет'
	]
};

const memesCountInit = {
	default: {
		count: 0,
		limit: 3,
		label: 'мемы'
	},
	mig21: {
		count: 0,
		limit: 4,
		label: 'МиГ'
	}
};

let memesCount = {...memesCountInit};

let memesInterval = setInterval(() => {
	memesCount = {...memesCountInit};
}, 60000 * 65);

function askForMeme(message, memeType, memeFn) {
	const isRudeImage = 'https://i.imgur.com/80PqAGP.png';

	message.content = cleanFromPoliteAndRude(message.content);

	if (isRude(message.content)) {
		console.log('isRude >>>');

		return message.reply(isRudeImage);
	}

	if (isPolite(message.content)) {
		console.log('isPolite >>>');

		if (rollByChance(0.25)) {
			message.react('🐬');

			return _proceedMeme(message, memeType, memeFn, true);
		}
	}

	if (!_isCouponAvailable(memeType)) {
		return _noCouponsAvailable(message, memeType);
	}

	_proceedMeme(message, memeType, memeFn);
}

function _proceedMeme(message, memeType, memeFn, options = {}) {
	const {isFree} = options;

	if (!isFree) {
		_takeCoupon(memeType);
	}

	memeFn(message);
}

function _takeCoupon(memeType) {
	memesCount[memeType].count++;
}

function _isCouponAvailable(memeType) {
	const meme = memesCount[memeType];
	const {count, limit} = meme;

	return count < limit;
}

function _noCouponsAvailable(message, type) {
	const noMemeResponse = NO_MEMES_RESPONSE[type];
	const responseLength = noMemeResponse.length;

	message.reply(noMemeResponse[getRandomByLength(responseLength)]);
}

const memesLeft = {
	pattern: /начальник, сколько талонов|начальник, сколько мемов|начальник, че по талонам|начальник, че по мемам/i,
	reply: message => {
		const response = Object.values(memesCount).map((item, index) => {
			const {count, limit, label} = item;
			const memesLeft = limit - count;

			return `${memesLeft} на ${label}`;
		});

		message.reply(response.join(', '));
	}
}

module.exports = {
	askForMeme,
	memesLeft
};

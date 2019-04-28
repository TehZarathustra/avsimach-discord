const request = require('request-promise');

const options = {
    headers: {
        'Authorization': 'Client-ID ' + process.env.IMGUR_ID
    },
    json: true
};

const ALBUMS = [
	{
		pattern: /су-27|су27|su27|su-27/i,
		uri: 'https://api.imgur.com/3/album/St7hfPk/images'
	},
	{
		pattern: /су-30|су30|su30|su-30/i,
		uri: 'https://api.imgur.com/3/album/UvNCXqt/images'
	},
	{
		pattern: /миг-23|миг23|mig23|mig-23/i,
		uri: 'https://api.imgur.com/3/album/rE0eAg1/images'
	},
	{
		pattern: /f\/a-18|f18|хорнет|порнет|ф18|ф-18/i,
		uri: 'https://api.imgur.com/3/album/EMIJ8Xn/images'
	},
	{
		pattern: /f-14|f14|f-14b|f14b|томкет|tomcat|томкек|ф14|ф-14|ф14б|ф-14б/i,
		uri: 'https://api.imgur.com/3/album/E5IChy0/images'
	}
];

const MIG_ALBUMS = [
	{
		type: 'taxi',
		uri: 'https://api.imgur.com/3/album/WcTp4r0/images'
	},
	{
		type: 'roll',
		uri: 'https://api.imgur.com/3/album/JlQ7QRx/images'
	},
	{
		type: 'takeoff',
		uri: 'https://api.imgur.com/3/album/7nvhqYl/images'
	},
	{
		type: 'final1',
		uri: 'https://api.imgur.com/3/album/KDZKAiG/images'
	},
	{
		type: 'final2',
		uri: 'https://api.imgur.com/3/album/GUFLb4Y/images'
	},
	{
		type: 'lading1',
		uri: 'https://api.imgur.com/3/album/pOvg9li/images'
	},
	{
		type: 'lading2',
		uri: 'https://api.imgur.com/3/album/F0ngkOk/images'
	},
	{
		type: 'fail1',
		uri: 'https://api.imgur.com/3/album/jYGUtqe/images'
	},
	{
		type: 'fail2',
		uri: 'https://api.imgur.com/3/album/5EfBhYZ/images'
	},
	{
		type: 'final-taxi',
		uri: 'https://api.imgur.com/3/album/g9FlfSu/images'
	}
];

module.exports = {
	getImgurGif: (message, query) => {
		const cleanQuery = query.replace(/\/|&|\?/gi, '');

		const album = ALBUMS.find(album => album.pattern.test(cleanQuery));

		return album ? getGifFromAlbum(message, album) : getGifByQuery(message, cleanQuery);
	},
	getMigGif: (query = []) => {
		const randomIndex = Math.floor(Math.random() * (query.length));

		const album = MIG_ALBUMS.find(item => item.type === query[randomIndex]);

		return getGifFromAlbum(null, album);
	}
};

function getGifFromAlbum(message, album) {
	return request(Object.assign(options, {
			uri: album.uri
		}))
		.then(function (response) {
			const items = response.data
				.filter(item => item.type === 'image/gif')
				.map(item => item.gifv);

			const item = items[Math.floor(Math.random() * (items.length))];

			if (message) {
				return message.reply(item);
			}

			return item;
		})
		.catch(function (err) {
			console.log('error >>>', err);
		});
}

function getGifByQuery(message, query) {
	return request(Object.assign(options, {
			uri: `https://api.imgur.com/3/gallery/search?q=${query}&q_type=gif`
		}))
		.then(function (response) {
			const items = response.data
				.filter(item => item.type === 'image/gif')
				.map(item => item.gifv);
			const gif = items[Math.floor(Math.random() * (items.length))];

			if (message) {
				return message.reply(gif);
			}

			return gif;
		})
}

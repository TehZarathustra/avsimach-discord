const request = require('request-promise');
const {searchRaw} = require('./giphy');

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
	}
];

module.exports = {
	getGif: (message, query) => {
		const cleanQuery = query.replace(/\/|&|\?/gi, '');
		const album = ALBUMS.find(album => album.pattern.test(cleanQuery));

		album ? getGifFromAlbum(message, album) : getGifByQuery(message, query);
	}
};

function getGifFromAlbum(message, album) {
	request(Object.assign(options, {
			uri: album.uri
		}))
		.then(function (response) {
			const items = response.data
				.filter(item => item.type === 'image/gif')
				.map(item => item.gifv);

			message.reply(items[Math.floor(Math.random() * (items.length))]);
		})
		.catch(function (err) {
			console.log('error >>>', err);
		});
}

function getGifByQuery(message, query) {
	request(Object.assign(options, {
			uri: `https://api.imgur.com/3/gallery/search?q=${query}&q_type=gif`
		}))
		.then(function (response) {
			const items = response.data
				.filter(item => item.type === 'image/gif')
				.map(item => item.gifv);
			const gif = items[Math.floor(Math.random() * (items.length))];

			if (!gif) {
				searchRaw(query)
					.then(giphy => {
						const secondGif = giphy && giphy.url;

						message.reply(secondGif || 'по запросу ничего не нашел');
					})
					.catch(err => {
						console.log('giphy err >', err);
					});
			} else {
				message.reply(gif);
			}
		})
		.catch(function (err) {
			message.reply('имгур прилег. сработал фолбек на giphy...');

			searchRaw(query)
				.then(giphy => {
					const secondGif = giphy && giphy.url;

					message.reply(secondGif || 'по запросу ничего не нашел');
				})
				.catch(err => {
					console.log('giphy err >', err);
				});
		});
}

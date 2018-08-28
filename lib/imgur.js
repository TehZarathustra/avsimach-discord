const request = require('request-promise');
const {searchRaw} = require('./giphy');

const options = {
    headers: {
        'Authorization': 'Client-ID ' + process.env.IMGUR_ID
    },
    json: true
};

module.exports = {
	getAnimeGif: message => {
		request(Object.assign(options, {
				uri: 'https://api.imgur.com/3/gallery/search?q=anime&q_type=gif'
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
	},
	getGif: (message, query) => {
		const cleanQuery = query.replace(/\/|&|\?/gi, '');

		request(Object.assign(options, {
				uri: `https://api.imgur.com/3/gallery/search?q=${cleanQuery}&q_type=gif`
			}))
			.then(function (response) {
				const items = response.data
					.filter(item => item.type === 'image/gif')
					.map(item => item.gifv);
				const gif = items[Math.floor(Math.random() * (items.length))];

				console.log('got gif with query >>>', cleanQuery);

				if (!gif) {
					searchRaw(cleanQuery)
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

				searchRaw(cleanQuery)
					.then(giphy => {
						const secondGif = giphy && giphy.url;

						message.reply(secondGif || 'по запросу ничего не нашел');
					})
					.catch(err => {
						console.log('giphy err >', err);
					});
			});
	}
};

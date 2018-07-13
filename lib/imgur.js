const request = require('request-promise');

const options = {
    uri: 'https://api.imgur.com/3/gallery/search?q=anime&q_type=gif',
    headers: {
        'Authorization': 'Client-ID ' + process.env.IMGUR_ID
    },
    json: true
};

module.exports = {
	getAnimeGif: message => {
		request(options)
		    .then(function (response) {
		    	const items = response.data
		    		.filter(item => item.type === 'image/gif')
		    		.map(item => item.link);

		    	message.reply({
					file: items[Math.floor(Math.random() * (items.length))]
				});
		    })
		    .catch(function (err) {
		    	console.log('error >>>', err);
		    });
	}
};

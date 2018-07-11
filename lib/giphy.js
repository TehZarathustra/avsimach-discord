const GphApiClient = require('giphy-js-sdk-core')
const giphyClient = GphApiClient(process.env.GIPHY_TOKEN);

module.exports = {
	client: giphyClient,
	search: (message, tag) => {
		giphyClient.search('gifs', {q: tag, limit: 50})
			.then(response => {
				const gif = response.data[Math.floor(Math.random() * (response.data.length))];

				message.reply({
					file: gif.images.original.gif_url
				});
			})
			.catch(console.error);
	}
}

const {getRows} = require('./google-spreadsheet-api');

const SPREADSHEET_CONFIG = {
	id: '15IIxjenFmF9G5ctPxekjAc9_xxfYCTu_wFUZRXJiDdQ',
	range: 'Vietnam!A1:W'
};

function getFact (message) {
	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			const facts = data.map(item => {
				return {
					source: item[0],
					paragraphs: item.slice(1).join('\n\n')
				}
			});

			const {source, paragraphs} = facts[Math.floor(Math.random() * (facts.length))];
			const fact = `**Факт про Вьетнам**\n\n${paragraphs}\n\n_Источник: ${source}_`;

			message.reply(fact);
		})
		.catch(error => {
			console.log('error: ' + error);
		});
}

module.exports = {
	getFact: getFact
};

const {
	getFacts,
	getFactsSecondary,
	insertSecondaries,
	getRandomNotSeenFact
} = require('../database/controllers/facts');


function transformFactToTemplate(rawFact) {
	const {source, image, text} = rawFact;
	const paragraphs = text.join('\n\n');

	const message = {
		color: 0xFF0000,
		title: 'Факт про Вьетнам',
		// url: 'https://discord.js.org',
		// author: {
		// 	name: 'Some name',
		// 	icon_url: 'https://i.imgur.com/wSTFkRM.png',
		// 	url: 'https://discord.js.org',
		// },
		description: paragraphs,
		// thumbnail: {
		// 	url: 'https://i.imgur.com/wSTFkRM.png',
		// },
		image: {
			url: image && `${image}.png`,
		},
		// timestamp: new Date(),
		footer: {
			text: `Источник: ${source}`,
			// icon_url: 'https://i.imgur.com/wSTFkRM.png',
		},
	};

	return {embed: message};
}

function mapFactsToSecondary() {
	return Promise.all([getFacts(), getFactsSecondary()])
		.then((response) => {
			const [facts, factsSecondary] = response;
			const secondaryItemIds = factsSecondary.map(({refId}) => String(refId));

			// check if any of present facts are unmapped
			// i.e. they're not in the secondary table
			const unMappedFacts = facts.reduce((result, {_id}) => {
				if (!secondaryItemIds.includes(String(_id))) {
					result.push(_id);
				}

				return result;
			}, []);

			// if any, add to secondary table
			if (unMappedFacts.length) {
				return insertSecondaries(unMappedFacts)
					.then(getRandomNotSeenFact);
			}

			return getRandomNotSeenFact();
		})
        .catch((error) => {
            console.log('mapFactsToSecondary error', error);
        });
}

function getMongoFact(message) {
	return mapFactsToSecondary()
		.then(result => message.reply(transformFactToTemplate(result)));
}

module.exports = {
	getFact: getMongoFact
};

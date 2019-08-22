const {
	factShema,
	factSecondarySchema
} = require('../models/facts');
const {getRandomByLength} = require('../../lib/utils');

function getFacts(options = {}) {
	return factShema.find(options);
}

function getFactsSecondary(options = {}) {
	return factSecondarySchema.find(options);
}

function insertSecondaries(ids) {
	const payload = ids.map(id => ({refId: id}));

	return factSecondarySchema.insertMany(payload);
}

async function getRandomNotSeenFact() {
	const factsSecondary = await getFactsSecondary({isShown: false});
	const factsSecondaryLength = factsSecondary.length;

	// if factsSecondary.length
	// get random
	// and flag as seen
	if (factsSecondaryLength) {
		const randomFactSecondary = factsSecondary[getRandomByLength(factsSecondaryLength)];

		// async, doesn't matter if it updates later or before
		factSecondarySchema.findByIdAndUpdate(randomFactSecondary._id, {isShown: true})
			.then(item => console.log(item, 'found and updated'));

		return factShema.findById(randomFactSecondary.refId);
	}

	// if !factsSecondaryLength.length
	// get and update whole secondaries to {isShown: false}
	// then try again
	return factSecondarySchema.updateMany({isShown: true}, {isShown: false})
		.then(getRandomNotSeenFact)
		.catch(error => console.log('reset error >', error));
}

module.exports = {
	getFacts,
	getFactsSecondary,
	insertSecondaries,
	getRandomNotSeenFact
};

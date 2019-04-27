const {getFact} = require('./facts');
const {askForMeme} = require('./askForMeme');

function getFactEntry(message) {
	askForMeme(message, 'default', getFact);
}

module.exports = {
	getFactsEntry: {
		facts: {
			pattern: /начальник, расскажи про вьетнам/i,
			reply: getFactEntry
		}
	}
};

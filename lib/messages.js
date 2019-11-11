const {compareEntry} = require('./jetchart-index');
const {scheduleEntry} = require('./schedule');
const {findGifEntry} = require('./findGif');
const miscMessages = require('./miscMessages');
const {getFactsEntry} = require('./getFacts');
const {memesLeft} = require('./askForMeme');
const memeGenerator = require('./memeGenerator');
const {mig21Entry} = require('./mig21');
const {personalFileEntry} = require('./personalFile');
const vote = require('./vote');

const messages = {
	...findGifEntry,
	...getFactsEntry,
	...miscMessages,
	...compareEntry,
	...memeGenerator,
	...scheduleEntry,
	...mig21Entry,
	...personalFileEntry,
	...vote,
	memesLeft
};

module.exports = messages;

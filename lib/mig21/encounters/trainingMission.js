const landing = require('../landing');
const {rollByChance} = require('../../utils');

function trainingMission(state, message, {time, penalty, success}) {
	console.log('trainingMission >', {time, penalty, success});

	message.reply('взлет. Приступаю к тренировочному заданию...');

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				time: 20000, 
				success: success
					? success
					: {status: rollByChance(0.8 * penalty)},
				penalty
			});
		}, time || 20000);
	});
}

module.exports = trainingMission;

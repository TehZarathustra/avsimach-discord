const landing = require('../landing');
const {rollByChance} = require('../../utils');
const {getMigGif} = require('../../imgur');

function trainingMission(state, message, {time, penalty, success}) {
	console.log('trainingMission >', {time, penalty, success});

	getMigGif(['roll', 'takeoff'])
		.then(gif => {
			message.reply('взлет. Приступаю к тренировочному заданию...\n' + gif);
		});

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

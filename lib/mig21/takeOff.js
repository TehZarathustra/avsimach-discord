const {getStateItemByKey} = require('../utils');
const {getMigGif} = require('../imgur');

function takeOff(state, message) {
	const engine = getStateItemByKey(state, 'ENGINE_START');
	const canopy = getStateItemByKey(state, 'CANOPY');

	const isEngineRunning = engine.status === 'on';
	const isCanopyClosed = canopy.status === 'on';

	let penalty = 1;

	return new Promise((resolve, reject) => {
		if (!isEngineRunning) {
			return reject('двигатель не запущен');
		}

		const options = {time: 60000};

		getMigGif(['taxi'])
			.then(gif => {
				message.reply('начинаю руление...\n' + gif);
			});

		if (!isCanopyClosed) {
			penalty = 0.1;
		}

		state.inFlight = true;

		setTimeout(() => {
			const payload = Object.assign({...options, penalty}, !isCanopyClosed
				? {success: {message: 'Оторвало фонарь.', status: false}} : null
			);

			resolve(payload);
		}, 10000);
	});
}

module.exports = takeOff;

const {getStateItemByKey} = require('../utils');

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

		message.reply('начинаю руление...');

		if (!isCanopyClosed) {
			penalty = 0.5;
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

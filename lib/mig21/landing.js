const {rollByChance, getStateItemByKey} = require('../utils');
const {getMigGif} = require('../imgur');

function landing(state, message, {time, success, penalty}) {
	const successMessage = success.status
		? 'выполнено'
		: 'провалено';

	const additionalMessage = success.message;
	const weatherCondition = (() => {
		const randomWeather = Math.random();
		const randomWeatherMultiplied = randomWeather * 10;

		console.log('randomWeatherMultiplied >', randomWeatherMultiplied);

		if (randomWeatherMultiplied >= 8) {
			return {
				message: 'Погода отличная',
				weather: randomWeather
			}
		}

		if (randomWeatherMultiplied >= 6) {
			return {
				message: 'Погода удовлетворительная',
				weather: randomWeather
			}
		}

		if (randomWeatherMultiplied >= 4) {
			return {
				message: 'Облачность 700 метров, осадки',
				weather: randomWeather
			}
		}

		if (randomWeatherMultiplied >= 2) {
			return {
				message: 'Облачность 400 метров, боковой ветер',
				weather: randomWeather
			}
		}

		return {
			message: 'Облачность 150 метров, сильный боковой ветер',
			weather: randomWeather
		};
	})();

	console.log('weatherCondition >', weatherCondition);

	getMigGif(['final1', 'final2'])
		.then((gif) => {
			message.reply(`задание ${successMessage}.${additionalMessage ? ' ' + additionalMessage : ''} Захожу на посадку... ${weatherCondition.message}\n${gif}`);
		});

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const isSuccess = calculateLanding(state, {weatherPenalty: weatherCondition.weather, penalty});

			if (isSuccess) {
				getMigGif(['lading1', 'lading2'])
					.then((gif) => {
						message.reply(`Успешная посадка\n${gif}`);
					})

				return resolve(true);
			}

			getMigGif(['fail1', 'fail2'])
				.then((gif) => {
					message.reply(gif);
				})
			return resolve(false);
		}, time || 20000);
	});
}

function calculateLanding(state, {weatherPenalty, penalty} = {}) {
	const landingDeps = ['ARK', 'RAMRK', 'RSBN', 'ADI', 'HSI', 'ENGINE_START'];
	const weatherCondition = weatherPenalty || Math.random();
	const landingChance = landingDeps.reduce((result, item) => {
		const stateItem = getStateItemByKey(state, item);
		const isItemActive = stateItem.status === 'on';

		console.log('result >', result, 'stateItem.penalty >', stateItem.penalty, result * stateItem.penalty);

		if (!isItemActive) {
			return result * stateItem.penalty;
		}

		return result;
	}, 1);

	console.log('landingChance >', landingChance, 'penalty >', penalty, 'weatherPenalty >', weatherPenalty);

	console.log('landingChance * penalty >', landingChance * penalty * (weatherPenalty <= 0.3 ? weatherPenalty * 2.5 : weatherPenalty));

	return rollByChance(landingChance * penalty * (weatherPenalty <= 0.3 ? weatherPenalty * 2.5 : weatherPenalty));
}

module.exports = landing;

const {getRows} = require('./google-spreadsheet-api');

const SPREADSHEET_FIELDS_INDEXES = {
	name: 0,
	internalFuel: 3,
	gross: 5,
	maxSpeed: 7,
	ceiling: 8,
	thrustWeight: 12,
	wingLoading: 16
};

function comparePlanes() {
	const firstPlane = 'MiG-21F-13';
	const secondPlane = 'F-5E-3';

	return _getPlanes()
		.then(planes => {
			let message;
			const firstPlaneData = _getPlaneByName(planes, firstPlane);
			const secondPlaneData = _getPlaneByName(planes, secondPlane);
			const validation = _validatePlanes(
				firstPlaneData,
				secondPlaneData,
				firstPlane,
				secondPlane);

			if (!validation.isValid) {
				return validation.error;
			}

			return _generateMessage(firstPlaneData[0], secondPlaneData[0]);
		})
		.catch(error => {
			console.log('error', error);
		});
}

function _generateMessage(first, second) {
	const scoreData = [_compareSpeed(first, second),
		_compareLoading(first, second),
		_compareThrust(first, second),
		_compareWeight(first, second)];

	const score = scoreData.filter(item => item.score).length;

	let winnerMessage = '\nВывод: ';

	if (score > 2) {
		winnerMessage += `${second.name} не нужен`;
	} else if (score === 2) {
		winnerMessage += 'оба норм';
	} else if (score < 2) {
		winnerMessage += `${first.name} не нужен`;
	}

	return scoreData.map(item => item.message).join('') + winnerMessage;
}

function _compareThrust(first, second) {
	const isBetter = first.speed > second.speed;

	return {
		message: `у ${first.name} ${isBetter ? 'ТВР выше' : 'ТВР ниже'}, чем у ${second.name}\n`,
		score: isBetter ? 1 : 0
	};
}

function _compareLoading(first, second) {
	const isLess = first.wingLoading < second.wingLoading;

	return {
		message: `${first.name} ${isLess ? 'маневреннее, чем' : 'на такой маневренный, как'} ${second.name}\n`,
		score: isLess ? 1 : 0
	};
}

function _compareWeight(first, second) {
	const isLess = first.weight > second.weight;

	return {
		message: `${first.name} ${isLess ? 'легче' : 'тяжелее'}, чем ${second.name}`,
		score: isLess ? 1 : 0
	};
}

function _compareSpeed(first, second) {
	const isFaster = first.speed > second.speed;

	return {
		message: `${first.name} ${isFaster ? 'быстрее' : 'медленнее'}, чем ${second.name}\n`,
		score: isFaster ? 1 : 0
	};
}

function _validatePlanes(first, second, firstName, secondName) {
	let isValid = true;
	let error = '';

	if (!first.length) {
		error += `${firstName} нет в табличке. Попробуй добавить\n`;
		isValid = false;
	}

	if (!second.length) {
		error += `${secondName} нет в табличке. Попробуй добавить\n`;
		isValid = false;
	}

	if (first.length && !first[0].isComplete) {
		error += `По ${firstName} нет полных данных. Попробуй добавить\n`;
		isValid = false;
	}

	if (second.length && !second[0].isComplete) {
		error += `По ${secondName} нет полных данных. Попробуй добавить\n`;
		isValid = false;
	}

	return {
		isValid,
		error
	};
}

function _getPlaneByName(planes, name) {
	return planes.filter(plane => plane.name === name);
}

function _getPlanes() {
	return getRows()
		.then(data => {
			console.log('got planes >>>', data);

			return _transformPlanes(data);
		})
		.catch(error => {
			console.log('error');
		});
}

function _transformPlanes(planes) {
	const reference = SPREADSHEET_FIELDS_INDEXES;
	const replaceRegex = /,/g;

	return planes.map(plane => {
		return {
			name: plane[reference.name],
			fuel: plane[reference.internalFuel],
			weight: plane[reference.gross],
			speed: plane[reference.maxSpeed],
			ceiling: plane[reference.ceiling],
			thrust: plane[reference.thrustWeight],
			wingLoading: plane[reference.wingLoading],
			isComplete: false
		}
	}).map(plane => {
		if (plane.name
			&& plane.fuel
			&& plane.weight
			&& plane.speed
			&& plane.ceiling
			&& plane.thrust
			&& plane.wingLoading) {
			plane.fuel = plane.fuel.replace(replaceRegex, '');
			plane.weight = plane.weight.replace(replaceRegex, '');
			plane.speed = plane.speed.replace(replaceRegex, '');
			plane.ceiling = plane.ceiling.replace(replaceRegex, '');
			plane.thrust = plane.thrust.replace(replaceRegex, '');
			plane.wingLoading = plane.wingLoading.replace(replaceRegex, '');

			plane.isComplete = true;
		}

		return plane;
	});
}

module.exports = {
	comparePlanes: comparePlanes
};

const {getRows} = require('./google-spreadsheet-api');
const {compareThrust, compareTurn, compareClimb, compareWeight, compareSpeed} = require('./jetchart-comparison');

const SPREADSHEET_FIELDS_INDEXES = {
	name: 0,
	internalFuel: 3,
	gross: 5,
	maxSpeed: 7,
	ceiling: 8,
	thrustWeightDry: 12,	
	thrustWeightBurner: 13,
	wingLoading: 16,
	turnLow: 17,
	turnHigh: 18,
	climbLow: 19,
	climbHigh: 20
};

function comparePlanes(firstPlane, secondPlane) {
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
			console.log('error: ', error);
		});
}

function _generateMessage(first, second) {
	const scoreData = [
		compareSpeed(first, second),
		compareThrust(first, second),
		compareWeight(first, second),
		compareTurn(first, second),
		compareClimb(first, second)
	];

	const scoreThreshold = 0.1
	let scores = [];
	let message = '';

	scoreData.forEach(score => {
		if (score != null){
			scores.push(score.score);
			message += score.message;
			console.log('scoredata: ', score);
		}
	})

	let winnerMessage = '\n**Вывод:** ';

	const avgScore = scores.reduce((a, b) => a + b) / scores.length;
	console.log ('avgScore: ' + avgScore);

	if (avgScore > 0 + scoreThreshold) {
		winnerMessage += `${second.name} не нужен`;
	} else if (avgScore < 0 - scoreThreshold) {		
		winnerMessage += `${first.name} не нужен`;
	} else {
		winnerMessage += 'оба норм';
	}

	return message + winnerMessage;
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
	return planes.filter(plane => {
		return (plane.name === name || plane.truncateName === name);
	});
}

function _getPlanes() {
	return getRows()
		.then(data => {
			return _transformPlanes(data);
		})
		.catch(error => {
			console.log('error: ' + error);
		});
}

function _transformPlanes(planes) {
	const reference = SPREADSHEET_FIELDS_INDEXES;
	const replaceRegex = /,/g;

	return planes.map(plane => {
		return {
			name: plane[reference.name],
			truncateName: plane[reference.name] && plane[reference.name].replace(/\s/gi, ''),
			fuel: plane[reference.internalFuel],
			weight: plane[reference.gross],
			speed: plane[reference.maxSpeed],
			ceiling: plane[reference.ceiling],
			thrustDry: plane[reference.thrustWeightDry],
			thrustBurner: plane[reference.thrustWeightBurner],
			wingLoading: plane[reference.wingLoading],
			turnLow: plane[reference.turnLow],
			turnHigh: plane[reference.turnHigh],
			climbLow: plane[reference.climbLow],
			climbHigh: plane[reference.climbHigh],
			isComplete: false
		}
	}).map(plane => {
		if (plane.name
			&& plane.fuel
			&& plane.weight
			&& plane.speed
			&& plane.ceiling) {

				if (plane.fuel)
					plane.fuel = plane.fuel.replace(replaceRegex, '');
				if (plane.weight)
					plane.weight = plane.weight.replace(replaceRegex, '');
				if (plane.speed)
					plane.speed = plane.speed.replace(replaceRegex, '');
				if (plane.ceiling)
					plane.ceiling = plane.ceiling.replace(replaceRegex, '');
				if (plane.thrustDry)
					plane.thrustDry = plane.thrustDry.replace(replaceRegex, '');
				if (plane.thrustBurner)
					plane.thrustBurner = plane.thrustBurner.replace(replaceRegex, '');
				if (plane.turnLow)
					plane.turnLow = plane.turnLow.replace(replaceRegex, '');
				if (plane.turnHigh)
					plane.turnHigh = plane.turnHigh.replace(replaceRegex, '');
				if (plane.climbLow)
					plane.climbLow = plane.climbLow.replace(replaceRegex, '');
				if (plane.climbHigh)
					plane.climbHigh = plane.climbHigh.replace(replaceRegex, '');
				if (plane.wingLoading)
					plane.wingLoading = plane.wingLoading.replace(replaceRegex, '');

				plane.isComplete = true;
		}

		return plane;
	});
}

module.exports = {
	comparePlanes: comparePlanes
};

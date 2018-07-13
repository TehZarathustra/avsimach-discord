const {getRows} = require('./google-spreadsheet-api');

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
		_compareSpeed(first, second),
		_compareThrust(first, second),
		_compareWeight(first, second),
		_compareTurn(first, second),
		_compareClimb(first, second)
	];

	let scoreThreshold = 0.1
	let scores = [];
	let message = '';

	scoreData.forEach(s => {
		if (s != null){
			scores.push(s.score);
			message += s.message;
			console.log('scoredata: ');
			console.log(s);
		}
	})

	

	let winnerMessage = '\n**Вывод:** ';

	let avgScore = scores.reduce((a, b) => a + b) / scores.length;
	console.log ('avgScore: ' + avgScore);

	if (avgScore > 0 + scoreThreshold) {
		winnerMessage += `${second.name} не нужен`;
	} else if (avgScore < 0 - scoreThreshold  ) {		
		winnerMessage += `${first.name} не нужен`;
	} else {
		winnerMessage += 'оба норм';
	}

	return message + winnerMessage;
}

function _compareThrust(first, second) {
	const weight = 1.0;
	const threshold = 0.05;

	if ((!first.thrustDry && !first.thrustBurner) || (!second.thrustDry && !second.thrustBurner)){
		return null;
	}
	let firstTrust = first.thrustBurner ? first.thrustBurner : first.thrustDry;
	let secondTrust = second.thrustBurner ? second.thrustBurner : second.thrustDry;

	let ratio = firstTrust / secondTrust;
	let message = '';

	if (ratio > 1 + threshold){
		message = `у ${first.name} **ТВР выше**, чем у ${second.name}\n`;
	} else if (ratio < 1 - threshold){		
		message = `у ${first.name} **ТВР ниже**, чем у ${second.name}\n`;
	} else{		
		message = `ТВР ${first.name} **примерно равен** ТВР ${second.name}\n`;
	}

	return {
		message: message,
		score: weight * (1 - ratio) * -1
	};
}

function _compareTurn(first, second) {
	const weight = 1.25;
	const threshold = 0.05;

	if ((!first.turnLow || !second.turnLow) && (!first.turnHigh || !second.turnHigh)){
		return null;
	}

	let ratioLow = 0;
	let ratioHigh = 0;
	let totalRatio = 0;

	if (first.turnLow && second.turnLow){
		ratioLow = first.turnLow / second.turnLow;
	}
	if (first.turnHigh && second.turnHigh){
		ratioHigh = first.turnHigh / second.turnHigh;
	}

	if (ratioHigh !== 0 && ratioLow !== 0){
		totalRatio = (ratioHigh + ratioLow) / 2;
	} else if (ratioHigh !== 0){
		totalRatio = ratioHigh;
	} else if (ratioLow !== 0){
		totalRatio == ratioLow;
	}

	let message = '';

	if (totalRatio > 1 + threshold){
		message = `${first.name} **маневреннее**, чем ${second.name}\n`;
	} else if (totalRatio < 1 - threshold){		
		message = `${first.name} **не такой маневренный**, как ${second.name}\n`;
	} else{		
		message = `Маневренность ${first.name} **примерно равна** маневренности ${second.name}\n`;
	}


	return {
		message: message,
		score: weight * (1 - totalRatio) * -1
	};
}

function _compareClimb(first, second) {
	const weight = 1.25;
	const threshold = 0.05;

	if ((!first.climbLow || !second.climbLow) && (!first.climbHigh || !second.climbHigh)){
		return null;
	}

	let ratioLow = 0;
	let ratioHigh = 0;
	let totalRatio = 0;

	if (first.climbLow && second.climbLow){
		ratioLow = first.climbLow / second.climbLow;
	}
	if (first.climbHigh && second.climbHigh){
		ratioHigh = first.climbHigh / second.climbHigh;
	}

	if (ratioHigh !== 0 && ratioLow !== 0){
		totalRatio = (ratioHigh + ratioLow) / 2;
	} else if (ratioHigh !== 0){
		totalRatio = ratioHigh;
	} else if (ratioLow !== 0){
		totalRatio == ratioLow;
	}

	totalRatio = 1/totalRatio; //the lower — the better
	let message = '';

	if (totalRatio > 1 + threshold){
		message = `${first.name} **скороподъёмнее**, чем ${second.name}\n`;
	} else if (totalRatio < 1 - threshold){		
		message = `Скороподъёмность ${first.name} **хуже**, чем у ${second.name}\n`;
	} else{		
		message = `Скороподъёмность ${first.name} **примерно равна** скороподъёмности ${second.name}\n`;
	}


	return {
		message: message,
		score: weight * (1 - totalRatio) * -1
	};
}

function _compareWeight(first, second) {
	const weight = 0.05;
	const threshold = 0.1;

	if (!first.weight || !second.weight){
		return null;
	}

	let ratio = second.weight / first.weight ;
	let message = '';

	if (ratio > 1 + threshold){
		message = `${first.name} **легче**, чем ${second.name}\n`;
	} else if (ratio < 1 - threshold){		
		message = `${first.name}'**тяжелее**, чем ${second.name}\n`;
	} else{		
		message = `Вес ${first.name} **примерно равен** весу ${second.name}\n`;
	}

	return {
		message: message,
		score: weight * (1 - ratio) * -1
	};
}

function _compareSpeed(first, second) {
	const weight = 1.0;
	const threshold = 0.01;

	if (!first.speed || !second.speed){
		return null;
	}
	
	let ratio = first.speed / second.speed;
	let message = '';

	if (ratio > 1 + threshold){
		message = `${first.name} **быстрее**, чем ${second.name}\n`;
	} else if (ratio < 1 - threshold){		
		message = `${first.name}'**медленнее**, чем ${second.name}\n`;
	} else{		
		message = `Скорость ${first.name} **примерно равна** скорости ${second.name}\n`;
	}
	
	return {
		message: message,
		score: weight * (1 - ratio) * -1
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

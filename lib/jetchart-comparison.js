function compareThrust(first, second) {
	const weight = 1.0;
	const threshold = 0.05;

	if ((!first.thrustDry && !first.thrustBurner) || (!second.thrustDry && !second.thrustBurner)){
		return null;
	}
	const firstTrust = first.thrustBurner ? first.thrustBurner : first.thrustDry;
	const secondTrust = second.thrustBurner ? second.thrustBurner : second.thrustDry;

	const ratio = firstTrust / secondTrust;
	let message = '';

	if (ratio > 1 + threshold) {
		message = `у ${first.name} **ТВР выше**, чем у ${second.name}\n`;
	} else if (ratio < 1 - threshold) {		
		message = `у ${first.name} **ТВР ниже**, чем у ${second.name}\n`;
	} else {		
		message = `ТВР ${first.name} **примерно равен** ТВР ${second.name}\n`;
	}

	return {
		message: message,
		score: weight * (1 - ratio) * -1
	};
}

function compareTurn(first, second) {
	const weight = 1.25;
	const threshold = 0.05;

	if ((!first.turnLow || !second.turnLow) && (!first.turnHigh || !second.turnHigh)) {
		return null;
	}

	let ratioLow = 0;
	let ratioHigh = 0;
	let totalRatio = 0;

	if (first.turnLow && second.turnLow) {
		ratioLow = first.turnLow / second.turnLow;
	}
	if (first.turnHigh && second.turnHigh) {
		ratioHigh = first.turnHigh / second.turnHigh;
	}

	if (ratioHigh !== 0 && ratioLow !== 0) {
		totalRatio = (ratioHigh + ratioLow) / 2;
	} else if (ratioHigh !== 0) {
		totalRatio = ratioHigh;
	} else if (ratioLow !== 0) {
		totalRatio == ratioLow;
	}

	let message = '';

	if (totalRatio > 1 + threshold) {
		message = `${first.name} **маневреннее**, чем ${second.name}\n`;
	} else if (totalRatio < 1 - threshold) {		
		message = `${first.name} **не такой маневренный**, как ${second.name}\n`;
	} else {		
		message = `Маневренность ${first.name} **примерно равна** маневренности ${second.name}\n`;
	}


	return {
		message: message,
		score: weight * (1 - totalRatio) * -1
	};
}

function compareClimb(first, second) {
	const weight = 1.25;
	const threshold = 0.05;

	if ((!first.climbLow || !second.climbLow) && (!first.climbHigh || !second.climbHigh)) {
		return null;
	}

	let ratioLow = 0;
	let ratioHigh = 0;
	let totalRatio = 0;

	if (first.climbLow && second.climbLow) {
		ratioLow = first.climbLow / second.climbLow;
	}

	if (first.climbHigh && second.climbHigh) {
		ratioHigh = first.climbHigh / second.climbHigh;
	}

	if (ratioHigh !== 0 && ratioLow !== 0) {
		totalRatio = (ratioHigh + ratioLow) / 2;
	} else if (ratioHigh !== 0) {
		totalRatio = ratioHigh;
	} else if (ratioLow !== 0) {
		totalRatio == ratioLow;
	}

	totalRatio = 1 / totalRatio; //the lower — the better
	let message = '';

	if (totalRatio > 1 + threshold) {
		message = `${first.name} **скороподъёмнее**, чем ${second.name}\n`;
	} else if (totalRatio < 1 - threshold) {		
		message = `Скороподъёмность ${first.name} **хуже**, чем у ${second.name}\n`;
	} else {		
		message = `Скороподъёмность ${first.name} **примерно равна** скороподъёмности ${second.name}\n`;
	}

	return {
		message: message,
		score: weight * (1 - totalRatio) * -1
	};
}

function compareWeight(first, second) {
	const weight = 0.05;
	const threshold = 0.1;

	if (!first.weight || !second.weight) {
		return null;
	}

	let ratio = second.weight / first.weight ;
	let message = '';

	if (ratio > 1 + threshold) {
		message = `${first.name} **легче**, чем ${second.name}\n`;
	} else if (ratio < 1 - threshold) {		
		message = `${first.name} **тяжелее**, чем ${second.name}\n`;
	} else {		
		message = `Вес ${first.name} **примерно равен** весу ${second.name}\n`;
	}

	return {
		message: message,
		score: weight * (1 - ratio) * -1
	};
}

function compareSpeed(first, second) {
	const weight = 1.0;
	const threshold = 0.01;

	if (!first.speed || !second.speed) {
		return null;
	}
	
	let ratio = first.speed / second.speed;
	let message = '';

	if (ratio > 1 + threshold) {
		message = `\n${first.name} **быстрее**, чем ${second.name}\n`;
	} else if (ratio < 1 - threshold) {		
		message = `\n${first.name} **медленнее**, чем ${second.name}\n`;
	} else {		
		message = `\nСкорость ${first.name} **примерно равна** скорости ${second.name}\n`;
	}
	
	return {
		message: message,
		score: weight * (1 - ratio) * -1
	};
}

module.exports = {
	compareThrust,
	compareTurn,
	compareClimb,
	compareWeight,
	compareSpeed
};

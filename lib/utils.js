const {find} = require('lodash');

const politeRegex = /пожалуйста|будь добр|прошу|сжалься/gi;
const rudeRegex = /сук+.|бля+.|пид+.|муд+.|урод|наху+.|ху+./gi;

function rollByChance(chance) {
	const random = Math.random();

	if (random <= chance) {
		return true;
	}

	return false;
}

function getStateItemByKey(state ,key) {
	return find(state, (stateItem) => {
		return stateItem.key === key;
	});
}

function isPolite(str) {
	return politeRegex.test(str);
}

function isRude(str) {
	return rudeRegex.test(str);
}

function cleanFromPoliteAndRude(str) {
	return str.replace(politeRegex, '').replace(rudeRegex, '').replace(/,/gi, '');
}

module.exports = {
	rollByChance,
	getStateItemByKey,
	cleanFromPoliteAndRude,
	isPolite,
	isRude
};

const {find} = require('lodash');

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

module.exports = {
	rollByChance,
	getStateItemByKey
};

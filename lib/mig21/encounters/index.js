const phantom = require('./phantom');
const {rollByChance, getStateItemByKey} = require('../../utils');
const trainingMission = require('./trainingMission');
const encounterState = {};

// TODO
// 1 generate random state [weather * chance = spotted]
// spotted ? maneuering : still
// function startMission() {
// 	encounterState = {
// 		...phantom,
// 		spotted: rollByChance(phantom.spottedChance)
// 	}
// }

function startMission(state, message, payload) {
	const mission = getStateItemByKey(state, 'MISSION');

	return new Promise((resolve, reject) => {
		if (mission) {
			resolve(mission.start(state, message, payload));
		}

		resolve(trainingMission(state, message, payload));
	});
}

function takeAction() {
	// if skip and close
		// turn +1, spotted 1/6, distance - 5

	// if weapon failure
		// turn + 1, spotted 2/6

	// if weapon success && hit
		// mission success

	// if weapon success && miss
		// turn +1, spotted 4/6, fail +1, weapon state update
			// if wasLastTurn && spotted && fail > 1
				// goin home and enemy launch roll, failure
			// else
				// going home, failure

	// if last turn
		// if spotted
			// enemy roll && back to basse
		// back to basse
}

module.exports = {
	startMission
};

const ARMAMENT = {
	R3S: {
		range: {
			min: 2,
			max: 8
		},
		tolerance: 0.3,
		type: 'IR',
		deps: [
			'MISSILE_CONTROLLER',
			'PYLONS_1',
			'GUNSIGHT'
		]
	},
	R3R: {
		range: {
			min: 2,
			max: 8
		},
		tolerance: 0.35,
		type: 'radar',
		deps: [
			'MISSILE_CONTROLLER',
			'PYLONS_2',
			'GUNSIGHT'
		]
	}
};

module.exports = ARMAMENT;

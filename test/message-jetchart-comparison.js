const expect = require('chai').expect;
const {compareWeight, compareSpeed} = require('../lib/jetchart-comparison');

describe('compareWeight()', function () {
	it('should return message and score', function () {
		const first = {
			name: 'MiG-15bis',
			weight: 5044.00
		};

		const second = {
			name: 'F-86F block 35',
			weight: 6883.00
		};

		const expectedResults = {
			message: 'MiG-15bis **легче**, чем F-86F block 35\n',
			score: 0.018229579698651865
		};

		const actualResults = compareWeight(first, second);

		expect(actualResults).to.deep.equal(expectedResults);
	});

	it('should return null', function () {
		const first = {
			name: 'MiG-15bis',
			weight: null
		};

		const second = {
			name: 'F-86F block 35',
			weight: null
		};

		const expectedResults = null;

		const actualResults = compareWeight(first, second);

		expect(actualResults).to.be.equal(expectedResults);
	});
});

describe('compareSpeed()', function () {
	it('should return message and score', function () {
		const first = {
			name: 'MiG-15bis',
			speed: 1060.00
		};

		const second = {
			name: 'F-86F block 35',
			speed: 1030.00
		};

		const expectedResults = {
			message: '\nMiG-15bis **быстрее**, чем F-86 block 35\n',
			score: 0.029126213592232997
		};

		const actualResults = compareSpeed(first, second);

		expect(actualResults).to.deep.equal(expectedResults);
	});

	it('should return null', function () {
		const first = {
			name: 'MiG-15bis',
			speed: null
		};

		const second = {
			name: 'F-86F block 35',
			speed: null
		};

		const expectedResults = null;

		const actualResults = compareSpeed(first, second);

		expect(actualResults).to.be.equal(expectedResults);
	});
});

const expect = require('chai').expect;
const {compareWeight} = require('../lib/jetchart-comparison');

describe('compareWeight()', function () {
	it('should compare weight', function () {
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
});

const {getRows, writeRows} = require('./google-spreadsheet-api');

const SPREADSHEET_META_CONFIG = {
	sheetName: 'Vietnam',
	shownCell: 'N',
	startRow: 'A1'
};
const {sheetName, shownCell, startRow} = SPREADSHEET_META_CONFIG;
const SPREADSHEET_CONFIG = {
	id: '15IIxjenFmF9G5ctPxekjAc9_xxfYCTu_wFUZRXJiDdQ',
	range: `${sheetName}!${startRow}:${shownCell}`
};

const FACTS_INDEXES = {
	source: 0,
	shown: 13
};

function getFact (message) {
	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			const facts = data.map((item, index) => {
				const shown = item[FACTS_INDEXES.shown];

				return {
					source: item[FACTS_INDEXES.source],
					paragraphs: item.slice(1, shown ? item.length - 1 : item.length)
						.filter(item => item).join('\n\n'),
					shown: shown,
					index: index
				};
			});
			const notShownFacts = facts.filter(item => item.shown === undefined || item.shown === '0');

			if (!notShownFacts.length) {
				return resetVisitedFacts(facts.length)
					.then(() => getFact(message))
					.catch(err => {console.log('reset error >', err)});
			}

			const {paragraphs, source, index} = getRandomFact(notShownFacts);
			const factMessage = `**Факт про Вьетнам**\n\n${paragraphs}\n\n_Источник: ${source}_`;

			message.reply(factMessage);

			writeRows({
				id: SPREADSHEET_CONFIG.id,
				range: `${sheetName}!${shownCell}${index + 1}`
			});
		})
		.catch(error => {
			console.log('error: ' + error);
		});
}

function getRandomFact (facts) {
	const randomFactIndex = Math.floor(Math.random() * (facts.length));
	return facts[randomFactIndex];
}

function resetVisitedFacts (length) {
	return writeRows({
		id: SPREADSHEET_CONFIG.id,
		range: `${sheetName}!${shownCell}1:${length}`,
		reset: length
	});
}

module.exports = {
	getFact: getFact
};

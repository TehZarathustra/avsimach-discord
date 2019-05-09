const {getRows, writeRows} = require('./google-spreadsheet-api');
const moment = require('moment');

const SPREADSHEET_META_CONFIG = {
	sheetName: 'personal',
	startRow: 'A1'
};
const {sheetName, startRow} = SPREADSHEET_META_CONFIG;
const SPREADSHEET_CONFIG = {
	id: '15IIxjenFmF9G5ctPxekjAc9_xxfYCTu_wFUZRXJiDdQ',
	range: `${sheetName}!${startRow}`
};

let updated = false;
let updateAllInterval = setInterval(() => {
	updated = false;
}, 30000 * 65);

function getPersonalFiles() {
	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			if (!data || !data[0] || !data[0][0]) {
				return false;
			}

			return data[0][0];
		})
		.catch(error => {
			message.reply(`Что-то сломалось: ${error}`);
		});
}

function updatePersonalFiles(message) {
	if (!updated) {
		const {guild} = message;
		const personalFiles = guild.members.reduce((result, {id, _roles}) => {
			result[id] = {id, roles: _roles};

			return result;
		}, {});

		getPersonalFiles()
			.then(files => files)
			.then((files = {}) => {
				const updatedFiles = {
					...JSON.parse(files),
					...personalFiles
				};

				writeRows({
					id: SPREADSHEET_CONFIG.id,
					range: `${sheetName}!A1`,
					value: [[JSON.stringify(updatedFiles)]]
				});

				updated = true;
			});
	}
}

module.exports = {
	personalFileEntry: {
		updateAll: {
			pattern: /./i,
			reply: updatePersonalFiles
		}
	},
	getPersonalFiles
};

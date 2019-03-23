const {getRows, writeRows} = require('./google-spreadsheet-api');
const moment = require('moment');

const SPREADSHEET_META_CONFIG = {
	sheetName: 'etc',
	suetaCell: 'A2',
	recordCell: 'A4'
};
const {sheetName, suetaCell, recordCell} = SPREADSHEET_META_CONFIG;
const SPREADSHEET_CONFIG = {
	id: '15IIxjenFmF9G5ctPxekjAc9_xxfYCTu_wFUZRXJiDdQ',
	range: `${sheetName}!${suetaCell}`
};

function _proceedSuetaAction(message, type) {
	getSuetaDate()
		.then((date) => {
			let hasPrevDate = date;
			const currentDate = moment();
			const formattedDate = currentDate.format();

			setSuetaDate(formattedDate)
				.then(() => {
					if (hasPrevDate) {
						// moment(date)
					}

					message.reply(`суета зафиксирована, ${moment.format('DD/MM/YYYY')}`);
				})
		})
		.catch(error => message.reply(`Что-то сломалось: ${error}`));
}

function getSuetaDate() {
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

function setSuetaDate(value, cell = suetaCell) {
	return writeRows({
		id: SPREADSHEET_CONFIG.id,
		range: `${sheetName}!${cell}`,
		value: [[value]]
	});
}

module.exports = {
	suetaEntry: {
		setSueta: {
			pattern: /начальник, фиксируй суету|начальник, фиксирую суету/i,
			reply: message => {
				_proceedSuetaAction(message, 'write');
			}
		},
		getSueta: {
			pattern: /начальник, что по суете|начальник, че по суете|начальник, суета/i,
			reply: message => {
				getSuetaDate();
			}
		}
	}
};

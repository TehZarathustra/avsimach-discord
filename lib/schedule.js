const {getRows} = require('./google-spreadsheet-api');

const scheduleCell = 'N2';
const SPREADSHEET_CONFIG = {
	id: '1FrFAR1SuDCVJPHvBMB5Pc-etjdmC8o3Cd5jXEy3retI',
	range: scheduleCell
};

function getSchedule (message) {
	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			message.reply(`Ближайшая миска: ${data[0][0]}`);
		})
		.catch(error => {
			message.reply(`Что-то сломалось: ${error}`);
		});
}

module.exports = {
	getSchedule: getSchedule
};

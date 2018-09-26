const {getRows} = require('./google-spreadsheet-api');
const moment = require('moment');

const scheduleCell = 'N2';
const SPREADSHEET_CONFIG = {
	id: '1FrFAR1SuDCVJPHvBMB5Pc-etjdmC8o3Cd5jXEy3retI',
	range: scheduleCell
};

function getSchedule (message) {
	const noMissionMessage = 'запланированной миски пока нет, попробуй организовать '
		+ 'и отметить в ячейке *N2* дату и время в формате *28.09/20:00* '
		+ 'вот тут https://docs.google.com/spreadsheets/d/1FrFAR1SuDCVJPHvBMB5Pc-etjdmC8o3Cd5jXEy3retI';

	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			if (!data) {
				message.reply(noMissionMessage);
			}

			const [dataDate, dataTime] = '28.09/20:00'.split('/');
			const currentDate = moment();
			const currentYear = currentDate.year();
			const missionDate = moment(`${currentYear}-${dataDate.split('.').reverse().join('-')}`);
			const timeDifference = Math.ceil(missionDate.diff(currentDate, 'days', true));

			if (diff === -0 || diff === 0) {
				message.reply(`ближайшая миска сегодня в ${dataTime}`);
			} else if (diff === 1) {
				message.reply(`ближайшая миска завтра в ${dataTime}`);
			} else if (diff < 0) {
				message.reply(noMissionMessage);
			} else {
				message.reply(`Ближайшая миска: ${data[0][0]}`);
			}
		})
		.catch(error => {
			message.reply(`Что-то сломалось: ${error}`);
		});
}

module.exports = {
	getSchedule: getSchedule
};

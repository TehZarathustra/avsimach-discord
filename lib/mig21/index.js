const {findKey, map, find, filter} = require('lodash');
const {getRows, writeRows} = require('../google-spreadsheet-api');
const {rollByChance, cleanFromPoliteAndRude} = require('../utils');
const {getMigGif} = require('../imgur');
const controls = require('./controls');
const takeOff = require('./takeOff');
const landing = require('./landing');
const {startMission} = require('./encounters');
const ACTION_CONVERTER = require('./actions');
let state = {};

const SPREADSHEET_META_CONFIG = {
	sheetName: 'MiG-21',
	endCell: 'C',
	startRow: 'A1',
	missionRow: 0,
	profileRow: 2
};
const {sheetName, endCell, startRow} = SPREADSHEET_META_CONFIG;
const SPREADSHEET_CONFIG = {
	id: '15IIxjenFmF9G5ctPxekjAc9_xxfYCTu_wFUZRXJiDdQ',
	range: `${sheetName}!${startRow}:${endCell}`
};

function updateMig(message, takeOff) {
	if (!Object.values(state).length) {
		initiateState();
	}

	if (takeOff) {
		return initiateFlight(message);
	}

	const [action, ...item] = cleanFromPoliteAndRude(message.content).split(' ').splice(1);

	const gluedItem = item.filter(Boolean).join(' ');
	const matchedItemKey = findKey(state, (control) => {
		return control.labels.find(label => label === gluedItem);
	});

	console.log('item >', gluedItem, matchedItemKey);

	if (!matchedItemKey) {
		return false;
	}

	const convertedAction = ACTION_CONVERTER[action];
	const matchedItem = state[matchedItemKey];
	const shouldUseDeps = matchedItem.useDeps;
	const secondLabel = matchedItem.labels.length > 1
		&& matchedItem.labels[1];

	if (!convertedAction) {
		return false;
	}

	const actionSuccess = convertedAction.success;
	const switchAction = convertedAction.switch;
	const isOnAction = switchAction === 'on';
	const {delay} = matchedItem;

	if (isOnAction && delay > 1000) {
		message.reply(`запускаю ${gluedItem}...`);
	}

	setTimeout(() => {
		if (shouldUseDeps && !areDepsMet(matchedItem.deps)) {
			message.reply(`${secondLabel || gluedItem} ${convertedAction.fail}`);
			return true;
		}

		if (isOnAction && matchedItem.onSuccess) {
			message.reply('двигатель успешно запущен', {file: matchedItem.onSuccess.image});
		} else {
			message.reply(`${secondLabel || gluedItem} ${matchedItem.status === switchAction
				? ('уже ' + actionSuccess)
				: actionSuccess}`);
		}

		state[matchedItemKey] = {...matchedItem, status: switchAction};
	}, delay || 0);

	return true;
}

function initiateState() {
	state = map(controls, (val, key) => {
		return {...val, key};
	});
}

function initiateFlight(message) {
	if (state.inFlight) {
		return;
	}

	takeOff(state, message)
		.then((payload) => {
			console.log('takeOff return payload >>>', payload);

			updateProfile({item: 'takeOff'});

			return startMission(state, message, payload);
		})
		.then((payload) => {
			console.log('startMission return payload >>>', payload);

			if (payload.success.status) {
				updateProfile({item: 'success'});
			}

			return landing(state, message, payload);
		})
		.then((isSuccess) => {
			console.log('reseting state >>>');

			if (isSuccess) {
				updateProfile({item: 'landing'});
			}

			state.inFlight = false;

			initiateState();

			return isSuccess;
		})
		.then((isSuccess) => {
			// due to attachment load
			setTimeout(() => {
				showProfile()
					.then((profileMessage) => {
						if (isSuccess) {
							getMigGif(['final-taxi'])
								.then(gif => {
									message.reply(`${profileMessage}\n${gif}`);
								});
						} else {
							message.reply(profileMessage);
						}
					});
			}, 60000);
		})
		.catch((error) => {
			message.reply(error);
		});
}

function areDepsMet(deps) {
	return deps.reduce((result, item) => {
		const status = find(state, {key: item}).status;

		if (status === 'on') {
			result.push(1);
		}

		return result;
	}, []).length === deps.length;
}

function showMigStatus(message) {
	const stateValues = Object.values(state);

	if (!stateValues.length) {
		return message.reply('миг стоит в ангаре, еще никто к нему не подходил');
	}

	const status = Object.values(state).filter(stateItem => stateItem.status === 'on')
		.map(item => `${item.labels[0]} **ВКЛ**`).join('\n');

	if (!status) {
		return message.reply('кто-то что-то трогал, но все инструменты выключены');
	}

	message.reply('\n' + status);
}

function showProfile() {
	return getRows(SPREADSHEET_CONFIG)
		.then((data) => {
			const [takeOff, landing, success] = data[SPREADSHEET_META_CONFIG.profileRow];

			return `\nСтатистика\nвылетов ${takeOff}, посадок ${landing}, успешных заданий ${success}`;
		});
}

function updateProfile(instruction = {}) {
	const {item, value} = instruction;

	getRows(SPREADSHEET_CONFIG)
		.then((data) => {
			const [takeOff, landing, success] = data[SPREADSHEET_META_CONFIG.profileRow];
			const profileState = {takeOff, landing, success};

			profileState[item] = value || Number(profileState[item]) + 1;

			console.log('profileState >>>', profileState);

			writeRows({
				id: SPREADSHEET_CONFIG.id,
				range: `${sheetName}!A3`,
				value: [Object.values(profileState)]
			});
		})
		.catch(error => console.log('updateProfile err >', error));
}

module.exports = {updateMig, showMigStatus, updateProfile};

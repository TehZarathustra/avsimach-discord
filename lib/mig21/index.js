const {findKey, map, find} = require('lodash');
const {rollByChance} = require('../utils');
const controls = require('./controls');
const takeOff = require('./takeOff');
const landing = require('./landing');
const {startMission} = require('./encounters');
let state = {};

const ACTION_CONVERTER = {
	'включи': {
		switch: 'on',
		success: 'включен',
		fail: 'не включился'
	},
	'выключи': {
		switch: 'off',
		success: 'выключен'
	},
	'запусти': {
		switch: 'on',
		success: 'запущен',
		fail: 'не запустился'
	},
	'закрой': {
		switch: 'on',
		success: 'закрыт'
	},
	'открой': {
		switch: 'off',
		success: 'открыт'
	}
};

function updateMig(message, takeOff) {
	if (!Object.values(state).length) {
		initiateState();
	}

	if (takeOff) {
		initiateFlight(message);
	}

	const [action, ...item] = message.content.split(' ').splice(1);
	const gluedItem = item.join(' ');
	const matchedItemKey = findKey(state, (control) => {
		return control.labels.find(label => label === gluedItem);
	});

	console.log('item >', item, matchedItemKey);

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
	const {delay} = matchedItem;

	if (delay > 1000) {
		message.reply(`запускаю ${gluedItem}...`);
	}

	setTimeout(() => {
		if (shouldUseDeps && !areDepsMet(matchedItem.deps)) {
			message.reply(`${secondLabel || gluedItem} ${convertedAction.fail}`);
			return true;
		}

		if (matchedItem.onSuccess) {
			message.reply('двигатель успешно запущен', {file: matchedItem.onSuccess.image});
		} else {
			message.reply(`${secondLabel || gluedItem} ${matchedItem.status === 'on'
				? ('уже ' + actionSuccess)
				: actionSuccess}`);
		}

		state[matchedItemKey] = {...matchedItem, status: convertedAction.switch};
	}, delay || 0);

	return true;
}

function initiateState() {
	state = map(controls, (val, key) => {
		return {...val, key};
	});
}

function initiateFlight(message) {
	takeOff(state, message)
		.then((payload) => {
			console.log('takeOff return payload >>>', payload);

			return startMission(state, message, payload);
		})
		.then((payload) => {
			console.log('startMission return payload >>>', payload);

			return landing(state, message, payload);
		})
		.then(() => {
			console.log('reseting state >>>');

			return initiateState();
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

function showStatus(message) {
	const status = map(state, (val) => {
		return `${val.labels[0]} **${val.status === 'on' ? 'вкл' : 'выкл'}**`;
	}).join('\n');

	message.reply('\n' + status);
}

module.exports = {updateMig};

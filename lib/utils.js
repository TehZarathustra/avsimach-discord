const {find} = require('lodash');

const politeRegex = /пожалуйста|будь добр|прошу|сжалься/gi;
const rudeRegex = /сук+.|бля+.|пид+.|муд+.|урод|наху+.|ху+.|быстр+.|пес|псин+.|козел|соба+./gi;

function rollByChance(chance) {
	const random = Math.random();

	if (random <= chance) {
		return true;
	}

	return false;
}

function getStateItemByKey(state ,key) {
	return find(state, (stateItem) => {
		return stateItem.key === key;
	});
}

function isPolite(str) {
	return politeRegex.test(str);
}

function isRude(str) {
	return rudeRegex.test(str);
}

function cleanFromPoliteAndRude(str) {
	return str.replace(politeRegex, '').replace(rudeRegex, '').replace(/,/gi, '');
}

function getRandomByLength(length) {
	return Math.floor(Math.random() * length);
}

function getRoleIdByStringFromMessage(message, roleToFind) {
	const guild = message.guild;
	const role = guild.roles.find('name', roleToFind);

	return role && role.id;
}

function getUserByStringFromMessage(message, userToFind) {
	const guild = message.guild;
	const byId = guild.members.find(({user}) => String(userToFind).includes(user.id));
	const byName = guild.members.find(({user}) => user.username === userToFind);

	return byId || byName;
}

function getQuorumFromMessage(message) {
	const guild = message.guild;
	const quorumRoleId = getRoleIdByStringFromMessage(message, 'ochoba');
	const quorumMembers = guild.members.filter(({_roles}) => _roles.includes(quorumRoleId));

	return quorumMembers;
}

module.exports = {
	rollByChance,
	getStateItemByKey,
	getQuorumFromMessage,
	cleanFromPoliteAndRude,
	getRandomByLength,
	getRoleIdByStringFromMessage,
	getUserByStringFromMessage,
	isPolite,
	isRude
};

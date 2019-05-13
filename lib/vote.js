const {askForMeme} = require('./askForMeme');
const giveRoleRegex = /выдай\s(.*)\sдля\s(\S*)/i;
const removeRoleRegex = /забери\s(.*)\sу\s(\S*)/i;
const kickUserRegex = /кикни\s(.*$)/i;
const {
	getRoleIdByStringFromMessage,
	getUserByStringFromMessage,
	cleanFromPoliteAndRude,
	getQuorumFromMessage
} = require('./utils');

const AGREE_EMOJI = '✅';
const DISAGREE_EMOJI = '❌';
const BOSS_OF_THIS_GYM_ID = '466307524040327179';
const ZARATHUSTRA_ID = '166269980718006272';

const actions = {
	add: giveRoleRegex,
	remove: removeRoleRegex,
	kick: kickUserRegex
};

async function startBinaryVote(message, options) {
	const {
		title,
		action,
		successVoteMessage,
		quorumMultiplier,
		quorumTitle,
		filedVoteMessage,
		time,
		timeTitle
	} = options;

	const requiredQuorumSize = Math.floor(
		getQuorumFromMessage(message).array().length * quorumMultiplier
	);

	const voteMessage = await message.channel.send(`${title}\n${timeTitle}\n${quorumTitle}`);

	await voteMessage.react(AGREE_EMOJI);
	await voteMessage.react(DISAGREE_EMOJI);

	const filter = ({emoji}) => {
		return emoji.name === AGREE_EMOJI
			|| emoji.name === DISAGREE_EMOJI
	};

	voteMessage.awaitReactions(filter, {time})
		.then((collected) => {
			const agreesCount = (collected.get(AGREE_EMOJI) || {count: 1}).count;
			const disagreesCount = (collected.get(DISAGREE_EMOJI) || {count: 1}).count;
			const allVotesCount = agreesCount + disagreesCount;

			if (allVotesCount < requiredQuorumSize) {
				return message.reply(`кворум для голосования не собрался, нужно хотя бы ${requiredQuorumSize} голосов`);
			}

			if (disagreesCount >= agreesCount) {
				return message.channel.send(filedVoteMessage);
			}

			return action().then(() => message.channel.send(successVoteMessage));
		})
		.catch(console.error);
}

function initRoleVoting(message, action) {
	const command = cleanFromPoliteAndRude(message.content);
	const actionRegex = actions[action];

	let matchArguments = command.match(actionRegex);

	if (!matchArguments) {
		return message.reply('команда введена некорректно');
	}

	if (action !== 'kick') {
		matchArguments = matchArguments.splice(1);
	}

	if (matchArguments.length < 2 && action !== 'kick') {
		return message.reply('команда введена некорректно');
	}

	const [matchedRoleString, matchedUserString] = matchArguments;

	const roleToProceed = getRoleIdByStringFromMessage(message, matchedRoleString);
	const userToUpdate = getUserByStringFromMessage(message, matchedUserString);

	if (!roleToProceed && action !== 'kick') {
		return message.reply('такая роль не найдена');
	}

	if (!userToUpdate) {
		return message.reply('такой пользователь не найден');
	}

	const {username, id} = userToUpdate.user;

	if (id === BOSS_OF_THIS_GYM_ID) {
		return message.reply('https://imgur.com/TDrKCcG');
	}

	return {
		username,
		matchedRoleString,
		roleToProceed,
		userToUpdate
	};
}

function giveRole(message) {
	const {
		username,
		matchedRoleString,
		roleToProceed,
		userToUpdate
	} = initRoleVoting(message, 'add');

	if (!userToUpdate) {
		return;
	}

	askForMeme(message, 'vote', () => {
		startBinaryVote(message, {
			title: `Запущено голосование: выдавать ли **${matchedRoleString}** для **${username}**?`,
			time: 60000 * 10,
			timeTitle: '_голосование закончится через 10 минут_',
			quorumMultiplier: .45,
			quorumTitle: '_требуется хотя бы 45% голосов от очобы_',
			action: () => {
				return userToUpdate.addRole(roleToProceed);
			},
			successVoteMessage: `По итогам голосования **${username}** получил погону **${matchedRoleString}**`,
			filedVoteMessage: `Большинство проголосовало против выдачи **${matchedRoleString}** для **${username}**`
		});
	});
}

function removeRole(message) {
	const {
		username,
		matchedRoleString,
		roleToProceed,
		userToUpdate
	} = initRoleVoting(message, 'remove');

	if (!userToUpdate) {
		return;
	}

	askForMeme(message, 'vote', () => {
		startBinaryVote(message, {
			title: `Запущено голосование: забирать ли **${matchedRoleString}** у **${username}**?`,
			time: 60000 * 10,
			timeTitle: '_голосование закончится через 10 минут_',
			quorumMultiplier: .45,
			quorumTitle: '_требуется хотя бы 45% голосов от очобы_',
			action: () => {
				return userToUpdate.removeRole(roleToProceed);
			},
			successVoteMessage: `По итогам голосования **${username}** лишился погоны **${matchedRoleString}**`,
			filedVoteMessage: `Большинство проголосовало против лишения **${username}** погоны **${matchedRoleString}**`
		});
	});
}

function kickUser(message) {
	const {
		username,
		userToUpdate
	} = initRoleVoting(message, 'kick');

	if (!userToUpdate) {
		return;
	}

	askForMeme(message, 'vote', () => {
		startBinaryVote(message, {
			title: `Запущено голосование: кикать ли **${username}**?`,
			time: 60000 * 10,
			timeTitle: '_голосование закончится через 10 минут_',
			quorumMultiplier: .5,
			quorumTitle: '_требуется хотя бы 50% голосов от очобы_',
			action: () => {
				if (userToUpdate.id === ZARATHUSTRA_ID) {
					setTimeout(() => {
						message.reply('https://imgur.com/NOuN9sv');
					}, 10000);

					return message.reply('https://imgur.com/dOA4NFX');
				}

				return userToUpdate.kick();
			},
			successVoteMessage: `По итогам голосования **${username}** бы кикнут`,
			filedVoteMessage: `Большинство проголосовало против кика **${username}**`
		});
	});
}

module.exports = {
	// addRole: {
	// 	pattern: /начальник, выдай/i,
	// 	reply: giveRole
	// },
	// removeRole: {
	// 	pattern: /начальник, забери/i,
	// 	reply: removeRole
	// },
	// kickUser: {
	// 	pattern: /начальник, кикни/i,
	// 	reply: kickUser
	// }
};

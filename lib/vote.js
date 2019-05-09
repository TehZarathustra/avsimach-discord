const {askForMeme} = require('./askForMeme');
const giveRoleRegex = /выдай\s(\S*)\sдля\s(\S*)/i;
const {
	getRoleIdByStringFromMessage,
	getUserByStringFromMessage,
	getQuorumFromMessage
} = require('./utils');

const AGREE_EMOJI = '✅';
const DISAGREE_EMOJI = '❌';

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
				return message.reply(`Кворум для голосования не собрался, нужно хотя бы ${requiredQuorumSize} голосов`);
			}

			if (disagreesCount >= agreesCount) {
				return message.channel.send(filedVoteMessage);
			}

			return action().then(() => message.channel.send(successVoteMessage));
		})
		.catch(console.error);
}

function giveRole(message) {
	const giveCommand = message.content;
	const matchArguments = giveCommand.match(giveRoleRegex).splice(1);

	if (matchArguments.length < 2) {
		return message.reply('команда введена некорректно');
	}

	const [matchedRoleString, matchedUserString] = matchArguments;

	const roleToAdd = getRoleIdByStringFromMessage(message, matchedRoleString);
	const userToUpdate = getUserByStringFromMessage(message, matchedUserString);

	if (!roleToAdd) {
		return message.reply('такая роль не найдена');
	}

	if (!userToUpdate) {
		return message.reply('такой пользователь не найден');
	}

	const {username} = userToUpdate.user;

	askForMeme(message, 'vote', () => {
		startBinaryVote(message, {
			title: `Запущено голосование: выдавать ли **${matchedRoleString}** для **${username}**?`,
			time: 60000 * 10,
			timeTitle: '_голосование закончится через 10 минут_',
			quorumMultiplier: .4,
			quorumTitle: '_требуется хотя бы 40% голосов от очобы_'
			action: () => {
				return userToUpdate.addRole(roleToAdd);
			},
			successVoteMessage: `По итогам голосования **${username}** получил погону **${matchedRoleString}**`,
			filedVoteMessage: `Большинство проголосовало против выдачи **${matchedRoleString}** для **${username}**`
		});
	});
}

module.exports = {
	addRole: {
		pattern: /начальник, выдай/i,
		reply: giveRole
	}
};

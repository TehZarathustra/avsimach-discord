const {
	rollByChance
} = require('./utils');

const BOSS_ID = '466307524040327179';

module.exports = {
	infa: {
		pattern: /60\/40/gi,
		reply: message => {
			_checkInfa(message);
		}
	},
	egg: {
		pattern: /egg|пожел|пожил|еггп|баклажан|эгг|егп/gi,
		reply: message => {
			message.react('🍆');
		}
	},
	hi: {
		pattern: /хай кста|хай, кста|hi ksta|hi, ksta/gi,
		reply: message => {
			message.react('👋');
		}
	},
	bossReplay: {
		pattern: new RegExp(BOSS_ID),
		reply: message => {
			const isAppretiation = /спасибо|благодарю|дякую/i.test(message.content);

			if (isAppretiation) {
				if (rollByChance(0.7)) {
					message.react('👌');
				} else {
					message.react('❤');
				}
			}
		}
	},
	bossGreets: {
		pattern: new RegExp(BOSS_ID),
		reply: message => {
			const isGreets = /👋/i.test(message.content);

			if (isGreets) {
				if (rollByChance(0.8)) {
					message.react('👋');
				} else {
					message.react('👋');
					message.react('❤');
				}
			}
		}
	},
	delete: {
		pattern: /начальник, удали|начальник удали|начальник, удоли|начальник удоли/gi,
		reply: message => {
			const userId = message.author.id;
			const userName = message.author.username;

			const match = new RegExp(userId, 'gi');

			message.channel.fetchMessages({limit: 15})
				.then(messages => {
					const messageToDeleted = messages.filter(ms => {
						// if embed
						if (ms.author.id === BOSS_ID
								&& ms.embeds.length
								&& ms.embeds[0].author.name === userName) {
							return true;
						}

						return (ms.author.id === BOSS_ID && match.test(ms.content));
					}).array();

					if (messageToDeleted.length) {
						messageToDeleted[0].delete();
						ms.delete();
					}
				})
				.catch(() => {
					message.reply('сорре, что-то пошло не так');
				});
		}
	}
};

function _checkInfa(message) {
	message.reply('Проверяю инфу...');

	setTimeout(() => {
		message.reply('Проверил. ' + (Math.floor(Math.random() * 10) > 5
			? 'Инфа ложная'
			: 'Инфу подтверждаю'));
	}, 5000);
}

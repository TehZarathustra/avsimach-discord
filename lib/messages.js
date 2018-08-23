const {getAnimeGif, getGif} = require('./imgur');
const {comparePlanes} = require('./jetchart-index');
const {getBlueflagStatusMessage} = require('./blueflag');
const animeRegexp = require('../utils/anime-regexp');

const COMPARE_REGEX = /([M|F|S|A]\S*)\sи\s([M|F|S|A]\S*)/gi;
const SHOW_REGEX = /покажи\s(.*)$/gi;
const MEMES_LIMIT = 3;
const HOME_ID = '444034088429551619';
const BOSS_ID = '466307524040327179';

let memesCount = 0;
let memesInterval = setInterval(() => {
	memesCount = 0;
}, 60000 * 65);

const MESSAGES = {
	buddy: {
		pattern: /дружок|дружочек/gi,
		reply: message => {
			message.reply('пирожочек')
		}
	},
	chack: {
		pattern: /\/чак/gi,
		reply: message => {
			message.reply({file: 'https://cdn.discordapp.com/attachments/444034088429551619/466315013607522304/5b168d61ee2cc163d01846b8.png'})
		}
	},
	hmd: {
		pattern: /\/nashlem|\/нашлем/gi,
		reply: message => {
			message.reply({file: 'https://i.imgur.com/7FHoSIG.png'})
		}
	},
	findGif: {
		pattern: /начальник, покажи|начальник покажи/gi,
		reply: message => {
			if (memesCount >= MEMES_LIMIT) {
				message.reply('талоны на мемы закончились, ждите новых');

				console.log('memesCount >', memesCount, 'MEMES_LIMIT >', MEMES_LIMIT);

				return;
			}

			memesCount++;

			if (MEMES_LIMIT - memesCount === 1) {
				message.guild.channels.get(HOME_ID).send('остался один талон на один мем');
			}

			message.content.match(SHOW_REGEX);

			const query = RegExp.$1;

			getGif(message, query);
		}
	},
	memesLeft: {
		pattern: /начальник, сколько талонов|начальник, сколько мемов/gi,
		reply: message => {
			const memesLeft = MEMES_LIMIT - memesCount;
			let ticketString;
			let ticketsLeftString = 'осталось';

			if (memesLeft === 0) {
				ticketString = 'талонов';
			} else if (memesLeft === 1) {
				ticketsLeftString = 'остался';
				ticketString = 'талон';
			} else {
				ticketString = 'талона';
			}

			message.reply(`${ticketsLeftString} ${memesLeft} ${ticketString} на мемы`);
		}
	},
	infa: {
		pattern: /60\/40/gi,
		reply: message => {
			_checkInfa(message)
		}
	},
	egg: {
		pattern: /egg|пожел|пожил|еггп|баклажан|эгг|егп/gi,
		reply: message => {
			message.react('🍆');
		}
	},
	compare: {
		pattern: /начальник, сравни|начальник сравни/gi,
		reply: message => {
			message.content.match(COMPARE_REGEX);

			const firstPlane = RegExp.$1;
			const secondPlane = RegExp.$2;

			if (!firstPlane || !secondPlane) {
				message.reply('чет ничего не сматчилось, попробуй еще');

				return;
			}

			comparePlanes(firstPlane, secondPlane)
				.then(compareMessage => {
					message.reply(compareMessage);
				})
				.catch(error => {
					console.log(error);

					message.reply('что-то сломалось');
				});
		}
	},
	delete: {
		pattern: /начальник, удали|начальник удали|начальник, удоли|начальник удоли/gi,
		reply: message => {
			const userId = message.author.id;
			const match = new RegExp(userId, 'gi');

			message.channel.fetchMessages({limit: 15})
				.then(messages => {
					const messageToDeleted = messages.filter(ms => {
						return (ms.author.id === BOSS_ID && match.test(ms.content));
					}).array();

					if (messageToDeleted.length) {
						messageToDeleted[0].delete();
					}
				})
				.catch(() => {
					message.reply('сорре, что-то пошло не так');
				});
		}
	},
	blueflag: {
		pattern: /начальник, че по блюфлагу|начальник, че по блюпуку/gi,
		reply: message => {
			const guild = message.guild;
			const redStar = guild.emojis.find('name', 'red_star');
			const blueStar = guild.emojis.find('name', 'blue');

			getBlueflagStatusMessage(redStar, blueStar)
				.then(statusMessage => {
					message.reply(statusMessage);
				})
				.catch(() => {
					message.reply('сорре, что-то пошло не так');
				});
		}
	}
};

function _checkInfa(message) {
	const channel = message.guild.channels.get(HOME_ID);

	message.reply('Проверяю инфу...');

	setTimeout(() => {
		channel.send('Проверил. ' + (Math.floor(Math.random() * 10) > 5
			? 'Инфа ложная'
			: 'Инфу подтверждаю'));
	}, 5000);
}

module.exports = MESSAGES;

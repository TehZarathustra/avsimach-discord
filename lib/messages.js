const {getGif} = require('./imgur');
const {comparePlanes} = require('./jetchart-index');
const {getSchedule} = require('./schedule');
const {getFact} = require('./facts');
const {getBlueflagStatusMessage} = require('./blueflag');
const memeGenerator = require('./memeGenerator');
const animeRegexp = require('../utils/anime-regexp');
const updateMig = require('./mig21');

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
			if (_checkForMemesAndReply(message)) return;

			memesCount++;

			message.content.match(SHOW_REGEX);
			const query = RegExp.$1;

			getGif(message, query);
		}
	},
	facts: {
		pattern: /начальник, расскажи про вьетнам/gi,
		reply: message => {
			if (_checkForMemesAndReply(message)) return;

			getFact(message).then(() => {memesCount++;});
		}
	},
	memesLeft: {
		pattern: /начальник, сколько талонов|начальник, сколько мемов|начальник, че по талонам|начальник, че по мемам/gi,
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
	hi: {
		pattern: /хай кста|хай, кста|hi ksta|hi, ksta/gi,
		reply: message => {
			message.react('👋');
		}
	},
	compare: {
		pattern: /начальник, сравни|начальник сравни/gi,
		reply: message => {
			message.content.match(COMPARE_REGEX);

			const firstPlane = RegExp.$1;
			const secondPlane = RegExp.$2;

			if (_checkForMemesAndReply(message)) return;

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
			message.reply('ждем ответа от сервура...');

			getBlueflagStatusMessage(redStar, blueStar, guild.emojis)
				.then(statusMessage => {
					message.reply(statusMessage);
				})
				.catch(() => {
					message.reply('сорре, ответа не дождались');
				});
		}
	},
	memeGenerator: {
		pattern: /начальник, сделай мем/gi,
		reply: (message, Discord) => {
			const [match, url, textBottom, textTop] = message.content.split('\n');

			if (!url || !textBottom) {
				message.replay('передай заявку на мем в правильном формате');
			}

			memeGenerator(url, textBottom, textTop)
				.then(buffer => {
					const attachment = new Discord.Attachment(buffer, 'meme.png');

					message.reply(`${message.author}`, attachment);
					message.delete();
				})
				.catch(error => {
					console.log('error >>>>', error);
				})
		}
	},
	when: {
		pattern: /начальник, когда миска/gi,
		reply: message => {
			getSchedule(message);
		}
	},
	mig21: {
		pattern: /начальник, включи|начальник, выключи|начальник, запусти|начальник, открой|начальник, закрой/i,
		reply: message => {
			if (_checkForMemesAndReply(message)) return;

			memesCount++;

			updateMig(message);
		}
	}
};

function _checkForMemesAndReply(message) {
	if (memesCount >= MEMES_LIMIT) {
		message.reply('талоны на мемы закончились, ждите новых');

		return true;
	}

	return false;
}

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

const {comparePlanes} = require('./jetchart-index');
const {getSchedule} = require('./schedule');
const {getFact} = require('./facts');
const {suetaEntry} = require('./suetaSign');
const {findGifEntry} = require('./findGif');
const {getBlueflagStatusMessage} = require('./blueflag');
const memeGenerator = require('./memeGenerator');
const {
	isPolite,
	isRude,
	rollByChance,
	cleanFromPoliteAndRude,
	getRandomByLength
} = require('./utils');
const {updateMig, showMigStatus, updateProfile} = require('./mig21');

const COMPARE_REGEX = /([M|F|S|A]\S*)\sи\s([M|F|S|A]\S*)/gi;
const MEMES_LIMIT = 3;
const MIG_LIMIT = 4;
const HOME_ID = '444034088429551619';
const BOSS_ID = '466307524040327179';

const messages = {
	...findGifEntry,
	facts: {
		pattern: /начальник, расскажи про вьетнам/gi,
		reply: message => {
			const factCallback = getFact.bind(null, message);

			proceedMemes(message, {}, factCallback);
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

			message.reply(`${ticketsLeftString} ${memesLeft} ${ticketString} на мемы, на МиГ ${MIG_LIMIT - migMemesCount}`);
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
	bossReplay: {
		pattern: new RegExp(BOSS_ID),
		reply: message => {
			const isAppretiation = /спасибо|благодарю/i.test(message.content);

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
			const migCallback = updateMig.bind(null, message);

			proceedMemes(message, {mig: true, shouldWait: true}, migCallback);
		}
	},
	mig21takeoff: {
		pattern: /начальник, взлет/i,
		reply: message => {
			const migCallback = updateMig.bind(null, message, true);

			proceedMemes(message, {mig: true, shouldWait: true}, migCallback);
		}
	},
	checkMig21: {
		pattern: /начальник, что по мигу|начальник, че по мигу|начальник, статус мига/i,
		reply: message => {
			showMigStatus(message);
		}
	},
	// ...suetaEntry
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

module.exports = messages;

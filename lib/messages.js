const {compareEntry} = require('./jetchart-index');
const {getSchedule} = require('./schedule');
const {suetaEntry} = require('./suetaSign');
const {findGifEntry} = require('./findGif');
const miscMessages = require('./miscMessages');
const {getFactsEntry} = require('./getFacts');
const {memesLeft} = require('./askForMeme');
const {getBlueflagStatusMessage} = require('./blueflag');
const memeGenerator = require('./memeGenerator');
const {updateMig, showMigStatus, updateProfile} = require('./mig21');

const messages = {
	...findGifEntry,
	...getFactsEntry,
	...miscMessages,
	...compareEntry,
	memesLeft,
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

module.exports = messages;

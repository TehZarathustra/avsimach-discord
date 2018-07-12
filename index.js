const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const Discord = require('discord.js');
const bot = new Discord.Client();
const {search} = require('./lib/giphy');
const {comparePlanes} = require('./lib/jetchart-index');

app.get('/', function (req, res) {
	res.send('avsimach discord bot');
});

// debug
comparePlanes();
// debug

const HAWKS_ID = '198147312244097024';
const HOME_ID = '444034088429551619';
const WORDS = {
	buddy: {
		pattern: /дружок|дружочек/gi,
		reply: 'пирожочек'
	},
	chack: {
		pattern: /чак/gi,
		reply: {
			file: 'https://cdn.discordapp.com/attachments/444034088429551619/466315013607522304/5b168d61ee2cc163d01846b8.png'
		}
	}
};

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	Object.keys(WORDS).forEach(key => {
		const word = WORDS[key];

		if (word.pattern.test(message.content)) {
			message.reply(word.reply);
		}
	});

	if (/anime|аниме|анимe|aниме|aнимe|онеме|oнеме|oнeмe|@ниме|@нимe/gi.test(message.content)) {
		if (Boolean(Math.floor(Math.random() * 2))) {
			search(message, 'anime');
		}
	}

	if (/60\/40/gi.test(message.content)) {
		checkInfa(message);
	}

	if (message.content === 'debug') {
		// getPlanes()
	}
});

bot.on('guildMemberAdd', member => {
	const guild = member.guild;
	const channel = guild.channels.get(HOME_ID);

	if (member.user.id === HAWKS_ID) {
		member.addRoles(getHawksRoles(member))
			.then(() => {
				channel.send('Слушай, во, я знаю как, браток! Хочешь я на одной ноге постою, а ты мне погону отдашь? Как цапля, хочешь?', {
					file: 'https://coubsecure-s.akamaihd.net/get/b16/p/coub/simple/cw_timeline_pic/31e7cd621e0/dff6fc9898d6fc00818aa/med_1409276124_1382483368_image.jpg'
				});
			})
			.catch(console.error);
	} else {
		channel.send('Дружок-пирожок, тобой выбрана неправильная дверь – клуб кожевенного ремесла два блока вниз', {
			file: 'https://media.giphy.com/media/Xtg56rTKsvSXgZnAnc/giphy.gif'
		});

		member.addRole(guild.roles.find('name', 'observer'));
	}
});

function getHawksRoles(message) {
	const roles = message.guild.roles;

	return [
		roles.find('name', 'суетливый').id,
		roles.find('name', 'ochoba').id,
		roles.find('name', 'anime').id,
		roles.find('name', 'ветеран раснарас').id,
		roles.find('name', 'коричневые штаны').id
	];
}

function checkInfa(message) {
	const channel = message.guild.channels.get(HOME_ID);

	message.reply('Проверяю инфу...');

	setTimeout(() => {
		channel.send('Проверил. ' + (Math.floor(Math.random() * 10) > 5
			? 'Инфа ложная'
			: 'Инфу подтверждаю'));
	}, 5000);
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

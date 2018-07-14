const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const Discord = require('discord.js');
const bot = new Discord.Client();

const messages = require('./lib/messages');

app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: true}));
app.get('/', function (req, res) {
	res.send('avsimach discord bot');
});

const HAWKS_ID = '198147312244097024';
const HOME_ID = '444034088429551619';

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	Object.keys(messages).forEach(key => {
		const word = messages[key];

		if (word.pattern.test(message.content)) {
			word.reply(message);
		}
	});
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

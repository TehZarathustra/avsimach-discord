const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const Discord = require('discord.js');
const bot = new Discord.Client();

const messages = require('./lib/messages');
const {getPersonalFiles} = require('./lib/personalFile');

app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: true}));
app.get('/', function (req, res) {
	res.send('avsimach discord bot');
});

app.post('/miska', function (req, res) {
	res.send(`POST request to the homepage\nBody: ${JSON.stringify(req.body)}`);
});

const HOME_ID = '444034088429551619';

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	// const author = message.author;
	// const {username} = author;

	// if (username !== 'Zarathustra') {
	// 	return;
	// }

	Object.keys(messages).forEach(key => {
		const word = messages[key];

		if (word.pattern.test(message.content)) {
			word.reply(message, Discord);
		}
	});
});

bot.on('guildMemberAdd', (member) => {
	const memberId = member.id;
	const {username} = member.user;
	const guild = member.guild;
	const channel = guild.channels.get(HOME_ID);
	const suetaRole = guild.roles.find('name', 'суетливый').id;

	getPersonalFiles()
		.then((files = {}) => {
			const existingUser = Object.values(JSON.parse(files))
				.find(({id}) => id == memberId);

			console.log('got personal files', {
				memberId,
				username,
				channel,
				suetaRole
			});

			if (existingUser) {
				member.addRoles([...existingUser.roles, suetaRole])
					.then(() => {
						channel.send(`**${username}** получает назад все свои погоны плюс суетливого за лив`);
					})
					.catch(error => console.log(error));

				return;
			}

			member.addRole(guild.roles.find('name', 'observer'));
		})
		.catch(error => console.log(error));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

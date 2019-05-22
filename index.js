const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.DEVELOPMENT;
const KARAS_ID = 356283233207320577;

// establish discordjs client
const Discord = require('discord.js');
const bot = new Discord.Client();

// establish database connection
// const {establishDatabaseConnection} = require('./database');
// establishDatabaseConnection();

// configure express app
app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: true}));

// get api required libs
const messages = require('./lib/messages');
const {getPersonalFiles} = require('./lib/personalFile');

// declare expressjs routes
app.get('/', function (req, res) {
	res.send('avsimach discord bot');
});

app.post('/miska', function (req, res) {
	res.send(`POST request to the homepage\nBody: ${JSON.stringify(req.body)}`);
});

// listen to discordjs events
const HOME_ID = '444034088429551619';
const RETRY_ROLE_LIMIT = 5;
let retries = 0;

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	const author = message.author;
	const {username} = author;

	if (isDevelopment && username !== 'Zarathustra') {
		return;
	}

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

	if (KARAS_ID == memberId) {
		channel.send('🐟 тревога');

		return member.ban('🐟')
			.then(() => console.log(`параноидальный стейт погубил ${member.displayName}`))
			.catch(console.error);
	}

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
				addRoles(member, [...existingUser.roles, suetaRole], username, channel);

				return;
			}

			member.addRole(guild.roles.find('name', 'observer'));
		})
		.catch(error => console.log(error));
});

function addRoles(member, roles, username, channel) {
	member.addRoles(roles)
		.then(() => {
			channel.send(`**${username}** получает назад все свои погоны плюс суетливого за лив`);
		})
		.catch((error) => {
			console.log('addRoles error >', error);

			if (retries < RETRY_ROLE_LIMIT) {
				addRoles(...arguments);
				retries++;
			}
		});
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

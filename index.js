const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	if (message.content === 'дружочек') {
		message.reply('пирожочек');
	}
});

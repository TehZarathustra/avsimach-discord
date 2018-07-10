const Discord = require('discord.js');
const bot = new Discord.Client();
const WORDS = {
	buddy: /[Дд]ружок|[Дд]ружочек/g,
	chack: /[Чч]ак/g,
	anime: /[Аа]ниме/g,
	early: /[Гг]де/g
};

bot.login(process.env.BOT_TOKEN);

bot.on('message', message => {
	if (WORDS.buddy.test(message.content)) {
		message.reply('пирожочек');
	}

	if (WORDS.chack.test(message.content)) {
		message.reply('https://cdn.discordapp.com/attachments/444034088429551619/466315013607522304/5b168d61ee2cc163d01846b8.png');
	}

	if (WORDS.anime.test(message.content)) {
		message.reply('китайские порномультики – это свинство');
	}

	if (WORDS.early.test(message.content)) {
		message.reply('ранний доступ');
	}
});

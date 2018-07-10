const Discord = require('discord.js');
const bot = new Discord.Client();
const WORDS = {
	buddy: {
		pattern: /дружок|дружочек/gi,
		reply: 'пирожочек'
	},
	chack: {
		pattern: /чак/gi,
		reply: 'https://cdn.discordapp.com/attachments/444034088429551619/466315013607522304/5b168d61ee2cc163d01846b8.png'
	},
	anime: {
		pattern: /аниме/gi,
		reply: 'китайские порномультики – это свинство'
	},
	early: {
		pattern: /где/gi,
		reply: 'ранний доступ'
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
});

bot.on('guildMemberAdd', member => {
	const role = member.guild.roles.find('name', 'суетливый');
	const guild = member.guild;
	console.log('member >>>', member, 'role >>>', role);

	// 198147312244097024
	member.addRole(role).catch(console.error);
	// guild.defaultChannel.sendMessage.channel.send(JSON.stringify(role));
});

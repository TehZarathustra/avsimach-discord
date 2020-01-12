const SOSISKA_CHANNEL_ID = '625339485814521876';

function sosiskaCheck(MessageReaction, discord, bot) {
	const {emoji, message, users} = MessageReaction;
	const {name} = emoji;
	const {author, content, channel, guild} = message;
	const {username} = author;

	const sunctionedBy = users.first();

	if (name === '🌭'
		&& channel.name === 'home'
		&& !author.bot
		&& sunctionedBy.roles.find('name', '🌭')) {

		const channel = guild.channels.get(SOSISKA_CHANNEL_ID);

		const template = {
			title: '🌭',
			description: `${author.username}\n${content}`,
			author: {
				name: sunctionedBy.username,
				icon_url: sunctionedBy.avatarURL
			},
			footer: {
				text: 'Сообщение перенесено из #home'
			}
		};

		message.delete();

		channel.send({embed: template});
	}
}

module.exports = {
	sosiskaCheck
};

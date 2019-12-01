const {
	insertAnnouncments,
	getAnnouncments
} = require('../database/controllers/announcement');
const IMAGE_URL = 'https://cdn.discordapp.com/attachments/444126073144344577/444126551500521472/HQ.png';
const AGREE_EMOJI = '✅';
const DISAGREE_EMOJI = '❌';

function createAnnounce(message) {
	const [match, title, date, time, info] = message.content.split('\n');
	let entryId;

	if (title && date && time) {
		insertAnnouncments({title, date, time, info})
			.then((response) => {
				const {_id} = response;

				entryId = _id;

				return response;
			})
			.then((response) => {
				return getTemplate(response, message);
			})
			.then((template) => {
				const announcement = message.channel.send(template)
					.then(m => {
						m.react(AGREE_EMOJI);
						m.react(DISAGREE_EMOJI);

					});
			})
	} else {
		message.reply('Проверь формат')
	}
}

function getTemplate(data, message) {
	const {
		title,
		date,
		time,
		info,
		pilots,
		landlubbers
	} = data;

	const {author} = message;

	const template = {
		title: `${title}`,
		description: info,
		fields: [
			{
				inline: true,
				name: 'Когда',
				value: date
			},
			{
				inline: true,
				name: 'Во сколько',
				value: `${time} (по мск)`
			},
			// {
			// 	inline: true,
			// 	name: 'Кто идет',
			// 	value: pilots.join(', ')
			// },
			// {
			// 	inline: true,
			// 	name: 'Кто сосет',
			// 	value: landlubbers.join(', ')
			// }
		],
		image: {
			url: IMAGE_URL,
		},
		author: {
			name: author.username,
			icon_url: author.avatarURL
		},
		footer: {
			text: 'Всем отметится, иначе бан'
		}
	};

	message.delete();

	return {embed: template};
}

module.exports = {
	announceEntry: {
		create: {
			pattern: /Начальник, сделай анонс/i,
			reply: message => createAnnounce(message)
		}
	}
};

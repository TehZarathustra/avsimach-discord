const redemptionSequence = [
	'https://i.imgur.com/dOA4NFX.gif',
	'https://i.imgur.com/NOuN9sv.gifv',
	'https://i.imgur.com/iF5Iri0.gifv',
	'https://i.imgur.com/G26WdVL.gifv'
];

let isRedemtionInitiated = false;

function initiateRedemption(message) {
	if (isRedemtionInitiated) {
		return;
	}

	isRedemtionInitiated = true;

	let i = 0;

	const redemptionInterval = setInterval(() => {
		message.reply(redemptionSequence[i++]);

		if (i === redemptionSequence.length) {
			i = 0;
			finalPhase(message);
			clearInterval(redemptionInterval);

			return;
		}
	}, 30000);
}

function finalPhase(message) {
	const roles = message.guild.roles;
	const role = roles.find('name', 'суетливый').id;

	message.member.addRole(role);
	message.reply('для тебя автоматически можно искупить плашку успешной посадкой мига');
}

module.exports = initiateRedemption;

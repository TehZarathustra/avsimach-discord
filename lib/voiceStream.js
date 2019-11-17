const ytdl = require('ytdl-core');

let connection;

function joinChannel (message, discord, client) {
	console.log('message.member >', message.member.voiceChannelID);

	const channel = client.channels.get(message.member.voiceChannelID);

	if (!channel) {
		return;
	}

	channel.join()
  .then((connection) => {
  	console.log('connection >', connection);

  	// connection.play(ytdl(
  	// 	'https://www.youtube.com/watch?v=ZlAU_w7-Xp8',
  	// { filter: 'audioonly' }));
  })
  .catch(console.error);

	// console.log('in >>>>');

}

function leaveChannel (message, discord, client) {
	const channel = client.channels.get('444034089071149059');

	channel.leave();
} 

function streamAudio () {
	// joinChannel.then((connection) => {
		// connection.play(ytdl(
  // 'https://www.youtube.com/watch?v=la5ezYUsMms',
  // { filter: 'audioonly' }));
	// });

		connection.then((cn) => {
			console.log('then >>>>', cn);

			console.log('connection >', connection);

			const dispatcher = connection.play('../assets/test.mp3');

			dispatcher.pause();
			dispatcher.resume();

			dispatcher.setVolume(0.5); // half the volume

			dispatcher.on('debug', (info) => {
			console.log('dsinfo >', info);
			})
		}).catch((error) => {
			console.lor('err >>>', error);
		})

}

module.exports = {
	joinChannel: {
		pattern: /начальник, прием/i,
		reply: joinChannel
	},
	leaveChannel: {
		pattern: /начальник, конец связи/i,
		reply: leaveChannel
	},
	streamAudio: {
		pattern: /начальник, подруби/i,
		reply: streamAudio
	}
};

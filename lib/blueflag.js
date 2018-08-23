module.exports = {
    getBlueflagStatusMessage
};

const io = require('socket.io-client');
const BUDDYSPIKE_URL = 'http://gadget.buddyspike.net';
const GUILD_EMOJI_DICT = {
    'Mi-8MT': 'mi',
    'Ka-50': 'attack',
    'MiG-21Bis': 'mig21',
    'F-15C': 'f15',
    'AV8BNA': 'av8b',
    'TF-51D': 'recon',
    'Yak-52': 'recon',
    'Su-27': 'su27',
    'FA-18C_hornet': 'f18'
}

function getStatus() {
    return new Promise((resolve, reject) => {
        const socket = io(BUDDYSPIKE_URL);

        socket.on('error', () => {
            reject('socket error');
        });

        socket.on('dcs server status emited', msg => {
            resolve(msg);
            socket.close();
        });
    })
}

function getPlayers() {
    return new Promise((resolve, reject) => {
        const socket = io(BUDDYSPIKE_URL);

        socket.on('error', () => {
            reject('socket error');
        });

        socket.on('jsonpilots emited', msg => {
            resolve(JSON.parse(msg));
            socket.close();
        });
    });
}

function getStatusAndPlayers() {
    return Promise.all([getStatus(), getPlayers()])
        .then(data => data)
        .catch(() => {
            console.log('getStatusAndPlayers error');
        });
}

function getPlayersPlane(players, guildEmojis) {
    return players.map(player => {
        if (player.radiounittype.length) {
            const jet = player.radiounittype.replace(/^\nIn: /, '');
            let emojiJet;

            if (GUILD_EMOJI_DICT[jet]) {
                emojiJet = guildEmojis.find('name', emojiDict[jet]);
            }

            return emojiJet || jet;
        } else {
            return 'n/a';
        }
    });
}

function getBlueflagStatusMessage(redStar, blueStar, guildEmojis) {
    return getStatusAndPlayers()
        .then(data => {
            const [status, players] = data;

            const isOnline = status.data;
            const redPlayers = getPlayersPlane(players.filter(player => player.side === 1), guildEmojis);
            const bluePlayers = getPlayersPlane(players.filter(player => player.side === 2), guildEmojis);

            if (players.length) {
                return '\nБлюфлаг **онлайн**\n'
                    + `всего игроков: **${players.length}**\n`
                    + `**${redPlayers.length}** ${redStar} (${redPlayers.join(', ')})\n`
                    + `**${redPlayers.length}** ${blueStar} (${bluePlayers.join(', ')})`;
            } else {
                return 'Блюфлаг оффлайн';
            }
        })
        .catch(error => {
            console.log('getStatusMessage error', error);
        });
}

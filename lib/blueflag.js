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
    'Su-27': 'su27',
    'FA-18C_hornet': 'f18',
    'M-2000C': 'm2000',
    'Su-25T': 'su25',
    'Su-25': 'su25',
    'UH-1H': 'mi',
    'SA342L': 'attack',
    'F-5E-3': 'f5',
    'AJS37': 'ja37',
    'A-10C': 'a10c',
    'A-10A': 'a10c',
    'MiG-29A': 'mig29'
};

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

        socket.emit('map_start', 'BLIX', 'caucasus', 'modern');

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
                emojiJet = guildEmojis.find('name', GUILD_EMOJI_DICT[jet]);
            }

            return emojiJet || jet;
        } else {
            return false;
        }
    }).sort().filter(plane => plane);
}

function getBlueflagStatusMessage(redStar, blueStar, guildEmojis) {
    return getPlayers()
        .then(players => {
            const redPlayers = getPlayersPlane(players.filter(player => player.side === 1), guildEmojis);
            const bluePlayers = getPlayersPlane(players.filter(player => player.side === 2), guildEmojis);

            if (players.length) {
                return '\nБлюфлаг **онлайн**\n'
                    + `всего игроков: **${players.length}**\n`
                    + `**${redPlayers.length}** ${redStar} (${redPlayers.join(', ')})\n`
                    + `**${bluePlayers.length}** ${blueStar} (${bluePlayers.join(', ')})`;
            } else {
                return 'Блюфлаг оффлайн';
            }
        })
        .catch(error => {
            console.log('getStatusMessage error', error);
        });
}

// blueflag: {
//         pattern: /начальник, че по блюфлагу|начальник, че по блюпуку/gi,
//         reply: message => {
//             const guild = message.guild;
//             const redStar = guild.emojis.find('name', 'red_star');
//             const blueStar = guild.emojis.find('name', 'blue');
//             message.reply('ждем ответа от сервура...');

//             getBlueflagStatusMessage(redStar, blueStar, guild.emojis)
//                 .then(statusMessage => {
//                     message.reply(statusMessage);
//                 })
//                 .catch(() => {
//                     message.reply('сорре, ответа не дождались');
//                 });
//         }
//     },

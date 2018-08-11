module.exports = {
    getBlueflagStatusMessage
};

function getStatus() {
    return new Promise((resolve, reject) => {
        const socket = require('socket.io-client')('http://gadget.buddyspike.net');

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
        const socket = require('socket.io-client')('http://gadget.buddyspike.net');

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

function getStatusMessage() {
    return getStatusAndPlayers()
        .then(data => {
            const [status, players] = data;

            const isOnline = status.data;
            const redPlayers = players.filter(player => player.side === 1);
            const bluePlayers = players.filter(player => player.side === 2);

            if (status.data) {
                return 'Блюфлаг **онлайн**\n'
                    + `Всего ${players.length} игроков\n`
                    + `:red_star: **${redPlayers.length}**\n`
                    + `:blue: **${bluePlayers.length}**`;
            } else {
                return 'Блюфлаг оффлайн';
            }
        })
        .catch(() => {
            console.log('getStatusMessage error');
        });
}

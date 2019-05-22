const mongoose = require('mongoose');
const {DB_USER, DB_PASSOWRD} = process.env;
const url = `mongodb://${DB_USER}:${DB_PASSOWRD}@ds127376.mlab.com:27376/avsimach`;

function establishDatabaseConnection() {
	mongoose.connect(url, {useNewUrlParser: true});

	const databaseConnection = mongoose.connection;

	databaseConnection.on('error', error => console.error(error));
	databaseConnection.once('open', () => {
		console.log('established database connection!');
	});
}

module.exports = {
	establishDatabaseConnection
};

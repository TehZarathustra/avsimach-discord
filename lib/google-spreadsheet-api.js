const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = './lib/credentials.json';

module.exports = {
	getRows: config => {
		return new Promise((resolve, reject) => {
			authorize({client_secret: process.env.CLIENT_SECRET,
				client_id: process.env.CLIENT_ID,
				redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
			}, listRows, resolve, reject, config);
		});
	}
}

/**
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, resolve, reject, config) {
	const {client_secret, client_id, redirect_uris} = credentials;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	oAuth2Client.setCredentials({
		access_token: process.env.ACCESS_TOKEN,
		token_type: 'Bearer',
		refresh_token: process.env.REFRESH_TOKEN,
		expiry_date: 1531405292902
	});

	callback(oAuth2Client, resolve, reject, config);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	console.log('Authorize this app by visiting this url:', authUrl);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();

		oAuth2Client.getToken(code, (err, token) => {
			if (err) return callback(err);
			oAuth2Client.setCredentials(token);

			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) console.error(err);

				console.log('Token stored to', TOKEN_PATH);
			});

			callback(oAuth2Client);
		});
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 * @param {resolve} resolve
 * @param {reject} reject
 * @param {object} config
 */
function listRows(auth, resolve, reject, config) {
	const sheets = google.sheets({version: 'v4', auth});
	const {id, range} = config;

	return sheets.spreadsheets.values.get({
		spreadsheetId: id,
		range: range,
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);

		const rows = res.data.values;

		if (rows) {
			resolve(rows);
		} else {
			console.log('No data found.');

			resolve(null)
		}
	});
}

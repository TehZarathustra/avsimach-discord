const {
	announceShema
} = require('../models/announcement');

function getAnnouncments(options = {}) {
	return announceShema.find(options);
}

function insertAnnouncments(payload = {}) {
	return announceShema.create(payload);
}

module.exports = {
	getAnnouncments,
	insertAnnouncments
};

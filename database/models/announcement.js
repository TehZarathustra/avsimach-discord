const mongoose  = require('mongoose');

const announceShema = new mongoose.Schema({
	title: String,
	date: String,
	time: String,
	info: String,
	messageId: Number,
	pilots: Array,
	landlubbers: Array
}, {timestamps: {createdAt: 'created_at'}});

module.exports = {
	announceShema: mongoose.model('Announcments', announceShema)
};

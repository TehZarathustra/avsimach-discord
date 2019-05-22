const mongoose  = require('mongoose');

const factShema = new mongoose.Schema({
	source: String,
	image: String,
	text: Array
});

const factSecondarySchema = new mongoose.Schema({
	refId: mongoose.Schema.Types.ObjectId,
	isShown: {type: Boolean, default: false}
});

module.exports = {
	factShema: mongoose.model('Fact', factShema),
	factSecondarySchema: mongoose.model('FactSecondary', factSecondarySchema)
};

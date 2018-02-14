module.exports = function () {
	var db = require('./../libs/connect-db')();
	var Schema = require('mongoose').Schema;

	return db.model('notificacoes', Schema({
		descricao: String,
		visto: { type: Boolean, default: false },
		date: { type: Date, default: Date.now },
		status: { type: Boolean, default: true }
	}));
}

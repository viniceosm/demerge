module.exports = function(){
	var db = require('./../libs/connect-db')();
	var Schema = require('mongoose').Schema;

	var usuario = Schema({
		nome: String,
		senha: String,
		seguindo: [{ type: Schema.Types.ObjectId, ref: 'usuario' }],
		notificacoes: [String],
		imagemPerfil: { type: String, default: '/img/userDefault.svg' },
		date: { type: Date, default: Date.now },
		status: { type: Boolean, default: true }
	});
	return db.model('usuario', usuario);
}

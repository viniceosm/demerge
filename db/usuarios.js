var db = require('./../connect-db');
db.connect();

const funcoes = {
	listar: function(callback){
		db.query('SELECT * FROM usuarios')
		.on('result', function(usuarios){
			callback(usuarios);
		});
	},
	cadastrar: function(data, callback){
		var sql = 'INSERT INTO usuarios (nome, senha) VALUES ?';

		var values = [
			[data.nome, data.senha]
		];

		db.query(sql, [values], function (err, result) {
			if (err) throw err;
			callback(true);
		});
	},
	logar: function(data, callback){
		var sql = `SELECT nome, senha FROM usuarios
					WHERE nome='${data.nome}'
						AND senha='${data.senha}'`;
		db.query(sql, function(err, usuarios){
			callback(usuarios);
		});
	}
}

module.exports = funcoes;

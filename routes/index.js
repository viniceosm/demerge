var express = require('express');
var router = express.Router();

var usuarioConectado;

const cUsuarios = require('./../db/usuarios');

router.get('/', function(req, res){
	res.render('index');
});

router.get('/cadastro', function(req, res){
	res.render('cadastro', {nome: usuarioConectado.nome});
});

router.get('/home', function(req, res){
	res.render('home', {nome: usuarioConectado.nome});
});

router.post('/logar', function(req, res){
	var campos = req.body;
	cUsuarios.logar({nome:campos.nome, senha:campos.senha}, function(usuarios){
		if(usuarios.length==1){
			usuarioConectado = usuarios[0];
			res.redirect('/home');
		}else{
			res.redirect('/');
		}
	});
});

router.post('/cadastrar', function(req, res){
	var campos = req.body;
	cUsuarios.cadastrar({nome:campos.nome, senha:campos.senha}, function(){
		res.redirect('/');
	});
});

module.exports = {
	router
};

const express = require('express');
var router = express.Router();

const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const KEY = 'nome-do-cuck';
const SECRET = 'deTantoUsarReferenciaEuVireiReferenciaxD';
const cookie = cookieParser(SECRET);
var store = new sessions.MemoryStore();
var varGlobal = require('./../libs/varGlobal');
var funcoes = require('./../funcoes/funcoes');

var sessionMiddleware = sessions({
	secret: SECRET,
	name: KEY,
	resave: true,
	saveUninitialized: true,
	store: store
});

router.use(cookie);
router.use(sessionMiddleware);

const cUsuarios = require('./../controller/usuarios');
const cPosts = require('./../controller/posts');

router.get('/', function(req, res){
	var session = req.session;
	if (!session.exist) {
		res.redirect('/login');
	} else {
		var session = req.session;
		cUsuarios.pesquisarPorId(session._id, (usuario) => {
			cPosts.pesquisarPorSeguidores(usuario, (posts) => {
				for (post of posts){
					post['isCurte'] = funcoes.isCurteById(post.curtiu, session._id);
				}
				res.render('home', {
					title: varGlobal.tituloPagina,
					usuario,
					posts
				});
			});
		});
	}
});

router.get('/login', function (req, res) {
	res.render('index', { title: varGlobal.tituloPagina});
});

router.get('/cadastro', function(req, res){
	res.render('cadastro', { title: varGlobal.tituloPagina });
});

router.post('/logar', function(req, res){
	var campos = req.body;
	cUsuarios.logar({nome:campos.nome, senha:campos.senha}, function(valido, usuario){
		if (valido) {
			session = req.session;
			session.exist = true;
			session._id = usuario._id;
			res.redirect('/logando');
		} else {
			res.redirect('/');
		}
	});
});

router.get('/logando', function (req, res) {
	var session = req.session;
	if (session.exist) {
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
});

router.get('/sair', function (req, res) {
	req.session.destroy(function () {
		res.redirect('/login');
	});
});

router.post('/cadastrar', function(req, res){
	var campos = req.body;
	cUsuarios.criar({nome:campos.nome, senha:campos.senha}, function(){
		res.redirect('/');
	});
});

module.exports = {
	router,
	sessionMiddleware
};

var express = require('express');
var model = require('./../models/usuarios')();
var funcoes = require('./../funcoes/funcoes');

const pesquisar = function (query, callback) {
	model.find(query, {})
		.populate('seguindo')
		.exec(function (err, usuarios) {
			if (err) throw err;
			callback(usuarios);
		});
};
const logar = function(query, callback) {
	model.find(query, {}, function (err, usuarios) {
		if (err) throw err;
		if (usuarios.length == 1) {
			callback(true, usuarios[0]);
		} else {
			callback(false);
		}
	});
};
const criar = function(fields, callback) {
	model.create(fields, function (err, usuario) {
		if (err) throw err;
		callback(usuario);
	});
};
const pesquisarPorId = function(query, callback) {
	model.findById(query, function (err, usuario) {
		if (err) throw err;
		callback(usuario);
	});
};
const pesquisarPorNome = function(query, callback) {
	model.findOne({ nome: query }, function (err, usuario) {
		if (err) throw err;
		callback(usuario);
	});
}
const seguir = function(idUsuario, idSeguir, callback) {
	model.findById(idUsuario, function (err, usuario) {
		if (err) throw err;
		
		pesquisarPorId(idUsuario, (usuarioConectado)=>{
			usuario.seguindo = funcoes.toggleSeguir(usuarioConectado.seguindo, idSeguir, usuario.seguindo);

			usuario.save(function (err, usuarioAlterado) {
				let isSegue = funcoes.isSegueById(usuarioAlterado.seguindo, idSeguir);
				callback(isSegue);
			});
		});
	});
}

const adicionarNoticacao = function (idUsuario, msg, callback) {
	model.findById(idUsuario, function (err, usuario) {
		if (err) throw err;

		usuario.notificacoes.unshift(msg);

		usuario.save(function (err, usuarioAlterado) {
			callback();
		});
	});
};

const buscarSeguidores = function(idUsuario, callback) {
	pesquisar({ seguindo: { $elemMatch: { $eq: idUsuario } } }, callback);
};

const alteraFotoPerfil = (idUsuario, body, callback) => {
	model.findById(idUsuario, function (err, usuario) {
		if (err) throw err;

		usuario.imagemPerfil = body.imagem;

		usuario.save(function (err, usuarioAlterado) {
			callback(usuarioAlterado.imagemPerfil);
		});
	});
}

const confirmaEmail = (codigo, callback) => {
	model.findOne({ codigoConfirmacaoEmail: codigo }, function (err, usuario) {
		if (err) throw err;

		usuario.emailConfirmado = true;

		usuario.save(function (err, usuarioAlterado) {
			callback(usuarioAlterado.emailConfirmado);
		});
	});
};

const crud = {
	pesquisar,
	logar,
	criar,
	pesquisarPorId,
	pesquisarPorNome,
	seguir,
	adicionarNoticacao,
	buscarSeguidores,
	alteraFotoPerfil,
	confirmaEmail
};

module.exports = crud;

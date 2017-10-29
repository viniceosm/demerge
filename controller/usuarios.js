var express = require('express');
var model = require('./../models/usuarios')();

const crud = {
	pesquisar: function (query, callback) {
		model.find(query, {})
		.populate('seguindo')
		.exec(function (err, usuarios) {
			if (err) {
				throw err;
			}
			callback(usuarios);
		});
	},
	logar: function(query, callback){
		model.find(query, {}, function(err, usuarios){
			if(err){
				throw err;
			}
			if (usuarios.length==1){
				callback(true, usuarios[0]);
			}else{
				callback(false);
			}
		});
	},
	criar: function(fields, callback){
		model.create(fields, function(err, usuario){
			if(err){
				throw err;
			}
			callback();
		});
	},
	pesquisarPorId: function(query, callback){
		model.findById(query, function(err, usuario){
			if(err) throw err;
			callback(usuario);
		});
	},
	seguir: function(idUsuario, idSeguir, callback){
		model.findById(idUsuario, function (err, usuario) {
			if (err) {
				throw err;
			}
			usuario.seguindo.push(idSeguir);
			usuario.save(function () {
				callback();
			});
		});
	}
};

module.exports = crud;

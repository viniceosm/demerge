var express = require('express');
var model = require('./../models/notificacoes')();
var funcoes = require('./../funcoes/funcoes');

const pesquisar = function (query, callback) {
	model.find(query, {}, { sort: { date: -1 } })
		.exec(function (err, comentarios) {
			if (err) throw err;

			callback(comentarios);
		});
};
const criar = function (fields, callback) {
	model.create(fields, function (err, comentario) {
		if (err) throw err;

		callback(comentario);
	});
};
const pesquisarPorId = function (id, callback) {
	model.findById(id)
		.exec(function (err, comentario) {
			if (err) throw err;

			callback(comentario);
		});
};

const crud = {
	pesquisar,
	criar,
	pesquisarPorId
};

module.exports = crud;

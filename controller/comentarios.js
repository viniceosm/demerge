var express = require('express');
var model = require('./../models/comentarios')();
var funcoes = require('./../funcoes/funcoes');

const pesquisar = function (query, callback) {
    model.find(query, {}, { sort: { date: -1 } })
        .populate('dono')
        .exec(function (err, comentarios) {
            if (err) throw err;

            callback(comentarios);
        });
};
const criar = function (fields, callback) {
    model.create(fields, function (err, comentario) {
        if (err) throw err;

        comentario.populate('dono', 'nome', function(err, comentario) {
            callback(comentario);
        });

    });
};
const pesquisarPorId = function (id, callback) {
    model.findById(id)
        .populate('dono')
        .exec(function (err, comentario) {
            if (err) throw err;

            callback(comentario);
        });
};
const pesquisarPorUsuario = function (query, callback) {
    pesquisar({ dono: query }, (comentarios) => {
        callback(comentarios);
    });
}

const crud = {
    pesquisar,
    criar,
    pesquisarPorId,
    pesquisarPorUsuario
};

module.exports = crud;

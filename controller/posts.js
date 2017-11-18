var express = require('express');
var model = require('./../models/posts')();
var funcoes = require('./../funcoes/funcoes');

const cUsuarios = require('./../controller/usuarios');

const pesquisar = function (query, callback) {
    model.find(query, {}, {sort:{date: -1}} )
        .populate('dono')
        .exec(function (err, posts) {
            if (err) throw err;
            callback(posts);
        });
};
const criar = function (fields, callback) {
    model.create(fields, function (err, post) {
        if (err) throw err;
        callback();
    });
};
const pesquisarPorId = function (query, callback) {
    model.findById(query, function (err, post) {
        if (err) throw err;
        callback(post);
    });
};
const pesquisarPorUsuario = function (query, callback) {
    model.findOne({ dono: query }, function (err, post) {
        if (err) throw err;
        callback(post);
    });
}

const pesquisarPorSeguidores = function (usuario, callback) {
    if ((typeof usuario.seguindo != 'undefined') && usuario.seguindo.length>0){
        var or = [];
        for (seguindo of usuario.seguindo) {
            or.push({ dono: seguindo });
        };

        var query = {};
        if (or.length > 0) {
            query = { $or: or };
        }
        
        pesquisar(query, (posts) => {
            callback(posts);
        });
    }else{
        callback([]);
    }
}

const curtir = function (idUsuario, idPost, callback){
    model.findById(idPost, function (err, post) {
        if (err) throw err;

        post.curtiu = funcoes.toggleCurtir(post.curtiu, idUsuario, post.curtiu);

        post.save(function (err, postAlterado) {
            let isCurte = funcoes.isCurteById(postAlterado.curtiu, idUsuario);
            callback(isCurte, postAlterado.curtiu.length);
        });
    });
}

const crud = {
    pesquisar,
    criar,
    pesquisarPorId,
    pesquisarPorUsuario,
    pesquisarPorSeguidores,
    curtir
};

module.exports = crud;

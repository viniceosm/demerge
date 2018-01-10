var express = require('express');
var model = require('./../models/posts')();
var funcoes = require('./../funcoes/funcoes');

const cUsuarios = require('./../controller/usuarios');
const cComentarios = require('./../controller/comentarios');

const pesquisar = function (query, callback) {
    model.find(query, {}, {sort:{date: -1}} )
        .populate('dono')
        .populate({
            path: 'comentario',
            populate: { path: 'dono' }
        })
        // .populate('curtiu')
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
const pesquisarPorId = function(id, callback) {
    model.findById(id)
        .populate('dono')
        .populate({
            path: 'comentario',
            populate: { path: 'dono' }
        })
        .exec(function (err, post) {
            //Se o erro for de conversão de id ele não irá emitir erro, na view irá mostrar que o post não foi encontrado
            if (err && !(err.name == 'CastError' && err.kind == 'ObjectId' && err.path == '_id')) throw err;

            callback(post);
        });
};
const pesquisarPorUsuario = function (query, callback) {
    pesquisar({ dono: query }, (posts) => {
        callback(posts);
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

const comentar = (idPost, fields, callback) => {
    cComentarios.criar(fields, (comentario) => {
        pesquisarPorId(idPost, (post) => {
            post.comentario.push(comentario._id);

            post.save(function (err, postAlterado) {
                callback(comentario);
            });
        });
    });
};

const crud = {
    pesquisar,
    criar,
    pesquisarPorId,
    pesquisarPorUsuario,
    pesquisarPorSeguidores,
    curtir,
    comentar
};

module.exports = crud;

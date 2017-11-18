const express = require('express');
var router = express.Router();

var varGlobal = require('./../libs/varGlobal');
var funcoes = require('./../funcoes/funcoes');

const cUsuarios = require('./../controller/usuarios');

router.get('/@:nome', function (req, res) {
    var session = req.session;
    if (!session.exist) {
        res.redirect('/login');
    } else {
        usuarioPerfil = [];
        usuarioPerfil['nome'] = req.params.nome;

        cUsuarios.pesquisarPorId(session._id, (usuario) => {
            let isSegue = funcoes.isSegue(usuario.seguindo, usuarioPerfil.nome);

            res.render('usuario/index', {
                title: varGlobal.tituloPagina,
                usuarioPerfil,
                usuario,
                isSegue
            });
        });
    }
});

router.get('/procurar/:nome?', function (req, res) {
    var session = req.session;
    if (!session.exist) {
        res.redirect('/login');
    } else {
        cUsuarios.pesquisarPorId(session._id, (usuario) => {
            if (req.params.nome){
                var query = { nome: { $regex: new RegExp(req.params.nome+'.*', "i") }  };
            }else{
                var query = {};
            }

            cUsuarios.pesquisar(query, (usuariosEncontrado) => {
                console.log('usuariosEncontrado: ', usuariosEncontrado);
                res.render('usuario/procurar', {
                    title: varGlobal.tituloPagina,
                    usuariosEncontrado,
                    usuario
                });
            });
        });
    }
});

module.exports = {
    router
};
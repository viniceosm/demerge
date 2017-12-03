const express = require('express');
var router = express.Router();

var varGlobal = require('./../libs/varGlobal');
var funcoes = require('./../funcoes/funcoes');

const cUsuarios = require('./../controller/usuarios');
const cPosts = require('./../controller/posts');

router.get('/:nome', function (req, res) {
    var session = req.session;
    if (!session.exist) {
        res.redirect('/login');
    } else {
        usuarioPerfil = [];

        //Pesquisar informações do usuário conectado
        cUsuarios.pesquisarPorId(session._id, (usuario) => {
            //Pesquisar informações do usuário pesquisado
            cUsuarios.pesquisarPorNome(req.params.nome, (usuarioVisitado) => {
                //Pesquisa posts
                cPosts.pesquisarPorUsuario(usuarioVisitado._id, (posts) => {
                    usuarioPerfil = usuarioVisitado;
                    let isSegue = funcoes.isSegueById(usuario.seguindo, usuarioPerfil._id);

                    for (post of posts) {
                        post['isCurte'] = funcoes.isCurteById(post.curtiu, session._id);
                    }

                    res.render('usuario/index', {
                        title: varGlobal.tituloPagina,
                        usuarioPerfil,
                        usuario,
                        isSegue,
                        posts
                    });
                });
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
                var query = { nome: { $regex: new RegExp('^' + req.params.nome + '.*', "i") }  };
            }else{
                var query = {};
            }

            cUsuarios.pesquisar(query, (usuariosEncontrado) => {
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

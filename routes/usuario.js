const express = require('express');
var router = express.Router();
const multiparty = require('multiparty');

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
                //Busca seguidores do usuário pesquisado
                cUsuarios.buscarSeguidores(usuarioVisitado._id, (seguidores) => {
                    //Pesquisa posts
                    cPosts.pesquisarPorUsuario(usuarioVisitado._id, (posts) => {
                        usuarioPerfil = usuarioVisitado;
                        usuarioPerfil['seguidores'] = seguidores;

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

router.post('/alteraFoto', function (req, res) {
    var form = new multiparty.Form();
    var session = req.session;

    form.parse(req, function (err, body, files) {
        body.imagem = funcoes.salvaImagem(files['fileFoto-0'][0]);

        cUsuarios.alteraFotoPerfil(session._id, body, (imagemPerfil) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                body: 'sucesso',
                imagemPerfil: imagemPerfil
            }));
        });

    });
});

module.exports = {
    router
};

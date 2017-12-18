const express = require('express');
var router = express.Router();
const multiparty = require('multiparty');

var varGlobal = require('./../libs/varGlobal');
var funcoes = require('./../funcoes/funcoes');

const cPosts = require('./../controller/posts');
const cUsuarios = require('./../controller/usuarios');

router.get('/:id', function(req, res) {
    var session = req.session;
    if (!session.exist) {
        res.redirect('/login');
    } else {
        //Pesquisar informações do usuário conectado
        cUsuarios.pesquisarPorId(session._id, (usuario) => {
            //Pesquisar post pesquisado
            cPosts.pesquisarPorId(req.params.id, (post) => {
                if (post !== undefined && post !== null) {
                    post['isCurte'] = funcoes.isCurteById(post.curtiu, session._id);
                }

                res.render('post/index', {
                    title: varGlobal.tituloPagina,
                    usuario,
                    post
                });
            });
        });
    }
});

router.post('/novo', function (req, res) {
    var form = new multiparty.Form();
    var session = req.session;

    form.parse(req, function (err, body, files) {
        body.descricao = body.descricao[0];
        body.dono = session._id;
        body.imagem = funcoes.salvaImagem(files['fileFoto-0'][0]);
        
        cPosts.criar(body, ()=>{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                body: 'sucesso'
            }));
        });

    });
});

module.exports = {
    router
};

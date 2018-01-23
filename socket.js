let io;

module.exports = function (_io) {
    io = _io;

    io.sockets.on('connection', function (socket) {
        const cUsuarios = require('./controller/usuarios');
        const cPosts = require('./controller/posts');

        //index
        socket.on('cadastroUsuario', function(obj) {
            cUsuarios.pesquisarPorNome(obj.nome, (usuario) => {
                let validaCaractereEspecial = (/^[a-zA-Z0-9_.-]*$/.test(obj.nome));
                
                if (!validaCaractereEspecial) {
                    socket.emit('erroCadastrarUsuario', 'Os nomes de usuário só podem usar letras, números, sublinhados e pontos.');
                }else if (usuario == undefined) {
                    cUsuarios.criar({
                        nome: obj.nome,
                        nomeCompleto: obj.nomeCompleto,
                        senha: obj.senha
                    }, function() {
                        socket.emit('retornoCadastroUsuario');
                    });
                } else {
                    socket.emit('erroCadastrarUsuario', 'Este usuário já existe.');
                }
            });
        });

        //Usuario
        socket.on('seguir', function (idSeguir) {
            cUsuarios.seguir(socket.request.session._id, idSeguir, (isSegue) => {
                cUsuarios.pesquisarPorId(socket.request.session._id, (usuarioQueSeguiu) => {
                    let msgHTML = `<span class="aNotificacao" href-notificacao="/u/${usuarioQueSeguiu.nome}">
                                        ${usuarioQueSeguiu.nome}
                                    </span> te seguiu.`;

                    cUsuarios.adicionarNoticacao(idSeguir, msgHTML, () => {
                        io.sockets.emit('retornoSeguir', isSegue);
                    });
                });
            });
        });

        //Post
        socket.on('curtirPost', function (idPost) {
            cPosts.curtir(socket.request.session._id, idPost, (isCurte, qCurtiu) => {
                cPosts.pesquisarPorId(idPost, (post) => {
                    cUsuarios.pesquisarPorId(socket.request.session._id, (usuario) => {
                        let msgHTML = `<span class="aNotificacao" href-notificacao="/u/${usuario.nome}">
                                            ${usuario.nome}
                                        </span> curtiu sua foto.`;

                        cUsuarios.adicionarNoticacao(post.dono, msgHTML, () => {
                            io.sockets.emit('retornoCurtir', { isCurte, idPost, qCurtiu });
                        });
                    });
                });
            });
        });

        socket.on('comentarPost', (obj) => {
            let fields = {
                descricao: obj.msg,
                dono: socket.request.session._id
            };
            cPosts.comentar(obj.id, fields, (comentario) => {
                io.sockets.emit('retornoComentarPost', { idPost: obj.id, comentario });
            });
        });
    });
};
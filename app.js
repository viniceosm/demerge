const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const compressor = require('node-minify');
const PORT = 3000;

// Using Google Closure Compiler
compressor.minify({
	compressor: 'gcc',
	input: __dirname + '/public/js/master.js',
	output: __dirname + '/public/js/master.min.js',
	callback: function (err, min) { }
});
compressor.minify({
	compressor: 'csso',
	input: __dirname + '/public/css/master.css',
	output: __dirname + '/public/css/master.min.css',
	options: {
		restructureOff: true // turns structure minimization off
	},
	callback: function (err, min) { }
});

server.listen(PORT, function() {
	console.log(`Server rodando na porta ${PORT}!`);
});

var notes = [];
var isInitNotes = false;
var socketCount = 0;

app.set('view engine', 'jade');
app.set('views', './app/views');
app.set('view options', { layout: false });
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/font', express.static(__dirname + '/public/font'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routesIndex = require('./routes/index');
const routesUsuario = require('./routes/usuario');
const routesPost = require('./routes/post');

app.use('/', routesIndex.router);
app.use('/u', routesUsuario.router);
app.use('/p', routesPost.router);

app.get('*', function (req, res) {
	res.render('notFound');
});

io.use(function (socket, next) {
	routesIndex.sessionMiddleware(socket.request, socket.request.res, next);
});

io.sockets.on('connection', function (socket) {
	const cUsuarios = require('./controller/usuarios');
	const cPosts = require('./controller/posts');
	
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
						io.sockets.emit('retornoCurtir', { isCurte, idPost, qCurtiu});
					});
				});
			});
		});
	});
});
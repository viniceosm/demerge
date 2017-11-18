const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const PORT = 3000;

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
		cUsuarios.seguir(socket.request.session._id, idSeguir, (isSegue)=>{
			io.sockets.emit('retornoSeguir', isSegue);
		});
	});
	
	//Post
	socket.on('curtirPost', function (idPost) {
		cPosts.curtir(socket.request.session._id, idPost, (isCurte, qCurtiu)=>{
			io.sockets.emit('retornoCurtir', { isCurte, idPost, qCurtiu});
		});
	});
});
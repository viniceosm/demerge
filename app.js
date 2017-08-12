const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const PORT = 3000;

server.listen(PORT, function() {
	console.log(`Server rodando na porta ${PORT}!`);
});

var notes = [];
var isInitNotes = false;
var socketCount = 0;

app.set('view engine', 'ejs');
app.set('views', './app/views')
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes.router);

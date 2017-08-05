const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const mysql = require('mysql');
const bodyParser = require('body-parser');

server.listen(3000, function() {
	console.log('Run server!');
});

var notes = []
var isInitNotes = false
var socketCount = 0

var	db = mysql.createConnection({
	host: 'demerge.000webhostapp.com',
	user: 'id2476922_admin1',
	password: 'demerge',
	database: 'id2476922_demerge'
});
db.connect();

app.set('view engine', 'ejs');
app.set('views', './app/views')
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', function(req, res){
	res.render('index');
});

io.sockets.on('connection', function(socket){
	// Socket has connected, increase socket count
	socketCount++;
	// Let all sockets know how many are connected
	io.sockets.emit('users connected', socketCount);

	socket.on('disconnect', function() {
		// Decrease the socket count on a disconnect, emit
		socketCount--;
		io.sockets.emit('users connected', socketCount);
	})

	socket.on('new note', function(data){
		// New note added, push to all sockets and insert into db
		notes.push(data)
		io.sockets.emit('new note', data)
		// Use node's db injection format to filter incoming data
		console.log('email: '+data.email+ ' nome:'+data.nome+' idade: '+data.idade);
		var sql = 'INSERT INTO cliente (email, nome) VALUES ?';
		console.log('testando------------------------------')

		var values = [
			//['email2', 'nome2']
			[data.email, data.nome]
		];

		db.query(sql, [values], function (err, result) {
			if (err) throw err;
			console.log("Number of records inserted: " + result.affectedRows);
		});
	})

	socket.on('login', function(data){

	});

	// Check to see if initial query/notes are set
	if (! isInitNotes) {
		// Initial app start, run db query
		db.query('SELECT * FROM cliente')
			.on('result', function(data){
				// Push results onto the notes array
				notes.push(data);
			})
			.on('end', function(){
				// Only emit notes after query has been completed
				socket.emit('initial notes', notes);
			});
		isInitNotes = true;
	} else {
		// Initial notes already exist, send out
		socket.emit('initial notes', notes);
	}
});

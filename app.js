var app = require('./config/express')();

var http = require('http').Server(app);

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

http.listen(3000, function() {
	console.log('Run server!');
});

var io = require('socket.io').listen(http);

var notes = []
var isInitNotes = false
var socketCount = 0
 



//var connection = require('express-myconnection');
var	db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydbnode'
});

db.connect();


io.sockets.on('connection', function(socket){
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)
 
    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
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

    socket.on('login'), function(data){
        
    }
 	
    // Check to see if initial query/notes are set
    if (! isInitNotes) {
        // Initial app start, run db query
        db.query('SELECT * FROM cliente')
            .on('result', function(data){
                // Push results onto the notes array
                notes.push(data)
            })
            .on('end', function(){
                // Only emit notes after query has been completed
                socket.emit('initial notes', notes)
            })
 
        isInitNotes = true
    } else {
        // Initial notes already exist, send out
        socket.emit('initial notes', notes)
    }
    
})

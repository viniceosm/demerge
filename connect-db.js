const mysql = require('mysql');

var	db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydbnode'
});

module.exports = db;

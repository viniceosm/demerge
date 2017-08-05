var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

//var connection = require('express-myconnection');
/*
var	connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydbnode'
});

connection.connect();
*/
module.exports = function(){
	var app = express();

	/*app.use(connection(mysql, {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'mydbnode'
	},'request'));
	*/
	app.set('view engine', 'ejs');
	app.set('views', './app/views')
	app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());


	app.get('/api/login', function(request, response){
		response.format({
			html: function() {
				response.render('login');
			}
		});
	});

	app.get('/teste', function(req, resp){

		function pesquisa(callback) {
			var test;
			connection.query('SELECT * FROM cliente', function(error, rows, fields){
				if(!!error){
					console.log('error');
				}else{
					console.log('sucesso');
					//resp.json(rows);
					//test = rows[0].nome;
					test = rows[0].idade;
				}
				callback(test);
			});
		}

		resp.format({
			html: function() {
				pesquisa(function(test) {	
					console.log(test + 'aaaa');
					resp.render('login' , {name: test});
				});
			}	
		});	
	});

	app.get('/formu', function(req, resp){

		resp.format({
			html: function(){
				resp.render('teste');
			}
		});
	});

	app.get('/boot', function(req, resp){

		resp.format({
			html: function(){
				resp.render('boot');
			}
		});
	});

	app.get('', function(req, resp){

		resp.format({
			html: function(){
				resp.render('sock');
			}
		});
	});
	return app;
}

var mongoose = require("mongoose");

var db;

module.exports = function(){
	if(!db){
		const PASSWORD = 'insta';
		const DATABASE = 'demerge';
		mongoose.Promise = global.Promise;
		db = mongoose.connect('mongodb://127.0.0.1:27017/demerge');
	}
	return db;
}

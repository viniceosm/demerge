var mongoose = require("mongoose");

var db;

module.exports = function(){
	if(!db){
		const PASSWORD = 'insta';
		const DATABASE = 'demerge';
		mongoose.Promise = global.Promise;
		db = mongoose.connect('mongodb://127.0.0.1:27017/demerge');
		// db = mongoose.connect(`mongodb://raffa:${PASSWORD}@raffamepaga-shard-00-00-npq09.mongodb.net:27017,raffamepaga-shard-00-01-npq09.mongodb.net:27017,raffamepaga-shard-00-02-npq09.mongodb.net:27017/${DATABASE}?ssl=true&replicaSet=raffamepaga-shard-0&authSource=admin`);
	}
	return db;
}

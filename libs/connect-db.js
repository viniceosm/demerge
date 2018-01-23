var mongoose = require("mongoose");

var db;

module.exports = function(){
	if(!db){
		const PASSWORD = 'demergetrap';
		const DATABASE = 'demerge';
		mongoose.Promise = global.Promise;
		db = mongoose.connect(`mongodb://demerge:${PASSWORD}@demerge-shard-00-00-f8plz.mongodb.net:27017,demerge-shard-00-01-f8plz.mongodb.net:27017,demerge-shard-00-02-f8plz.mongodb.net:27017/${DATABASE}?ssl=true&replicaSet=demerge-shard-0&authSource=admin`);
		// db = mongoose.connect(`mongodb://127.0.0.1:27017/${DATABASE}`);
	}
	return db;
}

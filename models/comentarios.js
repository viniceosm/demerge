module.exports = function () {
    var db = require('./../libs/connect-db')();
    var Schema = require('mongoose').Schema;

    var model = Schema({
        descricao: String,
        dono: { type: Schema.Types.ObjectId, ref: 'usuario' },
        date: { type: Date, default: Date.now },
        status: { type: Boolean, default: true }
    });
    return db.model('comentarios', model);
}

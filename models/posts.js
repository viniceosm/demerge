module.exports = function () {
    var db = require('./../libs/connect-db')();
    var Schema = require('mongoose').Schema;

    var model = Schema({
        descricao: String,
        imagem: String,
        dono: { type: Schema.Types.ObjectId, ref: 'usuario' },
        curtiu: [{ type: Schema.Types.ObjectId, ref: 'usuario' }],
        comentario: [{ type: Schema.Types.ObjectId, ref: 'comentarios' }],
        date: { type: Date, default: Date.now },
        status: { type: Boolean, default: true }
    });
    return db.model('posts', model);
}

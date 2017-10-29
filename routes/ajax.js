const express = require('express');
var router = express.Router();

var varGlobal = require('./../libs/varGlobal');
var funcoes = require('./../funcoes/funcoes');

const cUsuarios = require('./../controller/usuarios');

router.get('seguir', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({seguido: 'eeee'}));
});

module.exports = {
    router
};

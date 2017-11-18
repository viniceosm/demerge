const fs = require('fs');
const path = require('path');

const toggleSeguir = (arr, el, attrModel) => {
    return toggleFunction(arr, el, attrModel, !isSegueById(arr, el));
}

const toggleCurtir = (arr, el, attrModel) => {
    return toggleFunction(arr, el, attrModel, !isCurteById(arr, el));
}

//attrModel é o atributo de uma coleção do mongo
const toggleFunction = (arr, el, attrModel, condicao) => {
    if (condicao){
        attrModel.push(el);
    } else {
        let index = procuraIndexSeguindo(arr, el);
        attrModel.splice(index, 1);
    }
    return attrModel;
}

const isCurteById = (aCurte, postTest) => {
    return isElementoEmArray(aCurte, postTest.toString());
}

const isSegueById = (aSeguindo, seguidorTest) => {
    return isElementoEmArray(aSeguindo, seguidorTest.toString());
}

//retorna true se achar el no arr
const isElementoEmArray = (arr, el) => {
    return arr.some(v => v == el);
}

const procuraIndexSeguindo = (aSeguindo, seguidorTest) => {
    var indexSeguindo = aSeguindo.findIndex(v => v == seguidorTest.toString());
    return indexSeguindo;
}

const gravaArquivoVariosCaminhos = (caminhos, data) => {
    caminhos.forEach((caminho) => {
        fs.writeFile(caminho, data, function (err) {
            if (err) throw err;
        });
    });
}

const salvaImagem = (imagem) => {
    var nameNew = (new Date().toISOString()) + '-' + imagem.originalFilename;
    
    if (imagem.originalFilename != '') {
        fs.readFile(imagem.path, (err, data) => {
            if (err) throw err;

            var pathNew = [];
            pathNew[0] = __dirname + '/../public/img/post/' + nameNew;

            gravaArquivoVariosCaminhos(pathNew, data);
        });
    }
    return nameNew;
}

const funcoes = {
    toggleSeguir,
    isSegueById,
    toggleCurtir,
    isCurteById,
    procuraIndexSeguindo,
    gravaArquivoVariosCaminhos,
    salvaImagem
};

module.exports = funcoes;
const funcoes = {
    isSegue: (aSeguindo, seguidorTest) =>{
        let seguindoNome = [];

        if (aSeguindo) {
            for (seguindo of aSeguindo) {
                seguindoNome.push(seguindo.nome);
            }
        }

        var isSegue = seguindoNome.some(v => v === seguidorTest);

        return isSegue;
    }
};

module.exports = funcoes;
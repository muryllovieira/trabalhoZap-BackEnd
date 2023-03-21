const express = require('express')
// Dependencia para gerenciar as permissões da API
const cors = require('cors')
// Dependencia para gerenciar o corpo das requisições da API
const bodyParser = require('body-parser')

// Import do arquivo no modulo (funções)
const contatos = require('./modulo/contatos.js')

// Cria um objeto com as caracteristicas do express
const app = express()

app.use((request, response, next) => {
    // API publica - fica disponivel para utilização de qualquer aplicação
    // API privada - somente o IP informado poderá consumir dados da API
    // Define se a API será publica ou privada
    response.header('Access-Control-Allow-Origin', '*')

    // Permite definir quais metodos poderão ser utilizados nas requisições da API
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Envia para o cors() as regras de permissões
    app.use(cors())

    next()

})

//EndPoint para listar os dados do estado filtrando pela sigla do estado
app.get('/v1/whatsapp/telefone/:telefoneContato', cors(), async function (request, response, next) {

    let statusCode;
    let dadosContato = {};

    //Recebe a sigla do estado que sera enviada pela url da requisição
    let telefone = request.params.telefoneContato

    if (telefone == '' || telefone == undefined || isNaN(telefone)) {
        statusCode = 400;
        dadosContato.message = 'Não foi possivel processar, pois os dados de entrada (telefoneContato) que foi enviado não corrensponde ao que foi exigido. Confira o valor, pois não pode ser vazio, precisa ser caracteres e ter 2 dígitos.';
    } else {
        //Chama a função para retornar os dados do estado
        let contato = contatos.getContato(telefone)

        if (contato) {
            statusCode = (200)
            dadosContato = contato
        } else {
            statusCode = 404
        }
    }
    //Retorna o codigo e o JSON
    response.status(statusCode)
    response.json(dadosContato)
});
app.listen(8080, function () {
    console.log('Servidor aguardando requisições na porta 8080.');
})
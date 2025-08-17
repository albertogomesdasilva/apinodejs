// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
// Chamar a função express
const router = express.Router();

// Incluir a conexão com banco de dados
const db = require("../db/models");


// Listar Situações

// Endereço para acessar a api através de aplicação externa: http://localhost:8080/situations
router.get("/situations", async(req, res) => {
    // Listar todas as situações cadastradas no banco de dados
    const situations = await db.Situations.findAll({
        attibutes: ['id', 'nameSituation', 'createdAt', 'updatedAt'],
        order:[
            ['id', 'DESC']
        ]
    })

    if (situations) {
        return res.json({
            error: false,
            message: "Todas as situações foram listadas com sucesso!",
            situations
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar as Situações!"
        });
    }
});

// Fim Listar Situações

// Criar a rota listar COM PAGINAÇÃO
 http://localhost:8080/userspage
router.get("/situationspage", async(req, res) => {
  // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page = 1 } = req.query;
    //console.log(page);

    // Limite de registros em cada página
    // const limit = 40;
    const limit = 3;

    // Variável com o número da última página
    var lastPage = 1;

    // Contar a quantidade de registro no banco de dados
    const situationsUser = await db.Situations.count();

    // Acessa o IF quando encontrar registro no banco de dados
    if (situationsUser !== 0) {

        // Calcular a última página
        lastPage = Math.ceil(situationsUser / limit);
        //console.log(lastPage);
    } else {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhuma situação encontrada!"
        });
    }

    //console.log((page * limit) - limit); // 2 * 2 = 4
    // Recuperar todos os usuário do banco de dados
    const situations = await db.Situations.findAll({

        // Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation', 'createdAt', 'updatedAt'],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['id', 'DESC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (situations) {
        // Retornar objeto como resposta
        return res.json({
            error: false,
            situations
        });
    } else {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhuma Situação encontrada!"
        });
    }
});

// Listar - Buscar uma Situação pelo ID
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/situation/7
router.get("/situation/:id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { id } = req.params;

    const situation = await db.Situations.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'nameSituation', 'createdAt', 'updatedAt'],

    })

    if(situation){
        return res.json({
            error: false,
            message: "Situação encontrada com sucesso!",
            situation
        });
   }else{
    return res.status(400).json({
        error: true,
        message: "Erro ao encontrar a Situação!"
        })
   }
})



// Fim Listar uma Situação pelo ID

// Criar a rota cadastrar
router.post("/situations", async (req, res) => {
    // Receber os dados enviados no corpo da requisição
    const data = req.body;

    try {
        // 1. Verificar se a "nameSituation" já está cadastrada
        const existingSituation = await db.Situations.findOne({
            where: { nameSituation: data.nameSituation }
        });

        if (existingSituation) {
            return res.status(409).json({
                error: true,
                message: "Erro: O nome da situação já está cadastrado!"
            });
        }

        // 2. Cadastrar a nova situação se não houver duplicidade
        const newSituation = await db.Situations.create(data);

        // 3. Retornar a resposta de sucesso
        return res.status(201).json({
            error: false,
            message: "Situação cadastrada com sucesso!",
            dataSituation: newSituation
        });

    } catch (error) {
        // 4. Capturar e lidar com erros gerais
        console.error("Erro ao cadastrar situação:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao cadastrar situação."
        });
    }
});


// Criar a rota editar
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/situation
// // A aplicação externa deve indicar que está enviado os dados em formato de objeto Content-Type: application/json
// Dados em formato de objeto
/*{
    "id": 7,
    "nameSituation": "Ativo",
}
    ### NÃO PRECISO ENVIAR O ID NA QUERY, VAI NO BODY JSON
*/
router.put("/situation/", async (req, res) => {
    // Receber os dados enviados no corpo da requisição
    const data = req.body;
    const { id, nameSituation } = data;

    try {
        // 1. Verificar se o novo nome já está em uso por outra situação
        const existingSituation = await db.Situations.findOne({
            where: { nameSituation: nameSituation }
        });

        if (existingSituation && existingSituation.id !== id) {
            return res.status(409).json({
                error: true,
                message: "Erro: O nome da situação já está em uso por outra situação!"
            });
        }

        // 2. Editar a situação no banco de dados
        const result = await db.Situations.update(data, {
            where: { id: id }
        });

        // 3. Verificar se a edição foi bem-sucedida
        if (result[0] === 1) {
            return res.json({
                error: false,
                message: "Situação editada com sucesso!",
                data: data
            });
        } else {
            return res.status(404).json({
                error: true,
                message: "Erro: Situação não encontrada ou dados não alterados."
            });
        }

    } catch (error) {
        // 4. Capturar e lidar com erros gerais
        console.error("Erro ao editar situação:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao editar situação."
        });
    }
});


// Criar a rota apagar

 // Endereço para acessar a API através de aplicação externa: http://localhost:8080/user/3
router.delete("/situation/:id", async(req, res) => {
    // Receber o parâmetro enviado na URL
    const { id } = req.params;

    try {
        // Implementar a regra para apagar o registro do banco de dados
        const result = await db.Situations.destroy({ where: { id: id } });

        // A função destroy retorna o número de linhas afetadas.
        // Se 1 linha foi apagada, a operação foi bem-sucedida.
        if (result === 1) {
            return res.json({
                error: false,
                message: `A Situação de ID: ${id} apagado com sucesso!`
            });
        } else {
            // Se 0 linhas foram apagadas, o usuário com o ID fornecido não foi encontrado.
            return res.status(404).json({
                error: true,
                message: `A Situação de ID: ${id} não foi encontrada!`
            });
        }
    } catch (error) {
        // Capturar erros gerais durante a execução da operação
        console.error("Erro ao apagar usuário:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao apagar usuário."
        });
    }
});



// Exportar a instrução que está dentro da constante router
module.exports = router;
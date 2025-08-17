// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
// Chamar a função express
const router = express.Router();

// Incluir a conexão com banco de dados
const db = require("../db/models");

// Criptografar senha
const bcrypt = require('bcrypt');

// Criar a rota listar
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/users
router.get("/users", async(req, res) => {
    // Listar todos os usuários do banco de dados
    const users = await db.Users.findAll({
        attibutes: ['id', 'name', 'email', 'situationId'],
        order:[
            ['id', 'ASC']
        ],
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }]

    })

    if (users) {
        return res.json({
            error: false,
            message: "Usuários listados com sucesso!",
            users
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar usuários!"
        });
    }
});

// Criar a rota listar COM PAGINAÇÃO
 http://localhost:8080/userspage
router.get("/userspage", async(req, res) => {
  // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page = 1 } = req.query;
    //console.log(page);

    // Limite de registros em cada página
    // const limit = 40;
    const limit = 3;

    // Variável com o número da última página
    var lastPage = 1;

    // Contar a quantidade de registro no banco de dados
    const countUser = await db.Users.count();

    // Acessa o IF quando encontrar registro no banco de dados
    if (countUser !== 0) {

        // Calcular a última página
        lastPage = Math.ceil(countUser / limit);
        //console.log(lastPage);
    } else {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhum usuário encontrado!"
        });
    }

    //console.log((page * limit) - limit); // 2 * 2 = 4
    // Recuperar todos os usuário do banco de dados
    const users = await db.Users.findAll({

        // Indicar quais colunas recuperar
        attributes: ['id', 'name', 'email', 'situationId'],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['id', 'DESC']],

        // Buscar dados na tabela secundária
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (users) {
        // Retornar objeto como resposta
        return res.json({
            error: false,
            users
        });
    } else {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhum usuário encontrado!"
        });
    }
});
// Criar a rota visualizar um usuário pelo ID
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/users/7?sit=2
router.get("/users/:id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    // http://localhost:8080/users/7
    const { id } = req.params;

    const user = await db.Users.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'name', 'email', 'situationId', 'createdAt', 'updatedAt'],
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }]
    })

    if(user){
        return res.json({
            error: false,
            message: "Usuário encontrado com sucesso!",
            user
        });
   }else{
    return res.status(400).json({
        error: true,
        message: "Erro ao encontrar usuário!"
        })
   }
})


// Criar a rota cadastrar
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/users
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Cesar",
    "email": "cesar@celke.com.br",
    "situatjionId": "Assunto",
}
*/
router.post("/users", async (req, res) => {
    // Receber os dados enviados no corpo da requisição
    const data = req.body;

    try {
        // 1. Verificar se o e-mail já está cadastrado
        const existingUser = await db.Users.findOne({
            where: { email: data.email }
        });

        if (existingUser) {
            return res.status(409).json({ // 409 Conflict é o status ideal para esse tipo de erro
                error: true,
                message: "Erro: O e-mail já está cadastrado!"
            });
        }

        // 2. Criptografar a senha
        data.password = await bcrypt.hash(String(data.password), 8);

        // 3. Cadastrar o novo usuário
        const newUser = await db.Users.create(data);

        // 4. Retornar a resposta de sucesso
        return res.status(201).json({ // 201 Created é o status ideal para sucesso na criação
            error: false,
            dataUser: newUser,
            message: "Usuário cadastrado com sucesso!"
        });

    } catch (error) {
        // 5. Capturar erros e enviar resposta
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao cadastrar usuário."
        });
    }
});
    // Retornar objeto como resposta

// Criar a rota editar
// Endereço para acessar a api através de aplicação externa: http://localhost:8080/users/7
// A aplicação externa deve indicar que está enviado os dados em formato de objeto Content-Type: application/json
// Dados em formato de objeto
/*{
    "id": 7,
    "name": "Cesar",
    "email": "cesar@celke.com.br",
    "situationId": 1
}
    ### NÃO PRECISO ENVIAR O ID NA QUERY, VAI NO BODY JSON
*/
// Rota para editar um usuário
// Endereço: PUT http://localhost:8080/user
router.put("/user", async (req, res) => {
    const data = req.body;
    const { id, email, password } = data;

    try {
        // 1. Criptografar a nova senha, se ela foi alterada
        if (password) {
            data.password = await bcrypt.hash(String(password), 8);
        }

        // 2. Verificar se o novo e-mail já está em uso por outro usuário
        const existingUser = await db.Users.findOne({
            where: { email: email }
        });

        if (existingUser && existingUser.id !== id) {
            return res.status(409).json({
                error: true,
                message: "Erro: O e-mail já está em uso por outro usuário!"
            });
        }

        // 3. Editar o usuário no banco de dados
        const result = await db.Users.update(data, {
            where: { id: id }
        });

        // 4. Verificar se a edição foi bem-sucedida
        if (result[0] === 1) {
            return res.json({
                error: false,
                message: "Usuário editado com sucesso!",
                data: data
            });
        } else {
            return res.status(404).json({
                error: true,
                message: "Erro: Usuário não encontrado ou dados não alterados."
            });
        }

    } catch (error) {
        // 5. Capturar e lidar com erros
        console.error("Erro ao editar usuário:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao editar usuário."
        });
    }
});

// Criar a rota apagar

 // Endereço para acessar a API através de aplicação externa: http://localhost:8080/user/3
router.delete("/user/:id", async(req, res) => {
    // Receber o parâmetro enviado na URL
    const { id } = req.params;

    try {
        // Implementar a regra para apagar o registro do banco de dados
        const result = await db.Users.destroy({ where: { id: id } });

        // A função destroy retorna o número de linhas afetadas.
        // Se 1 linha foi apagada, a operação foi bem-sucedida.
        if (result === 1) {
            return res.json({
                error: false,
                message: `Usuário de ID: ${id} apagado com sucesso!`
            });
        } else {
            // Se 0 linhas foram apagadas, o usuário com o ID fornecido não foi encontrado.
            return res.status(404).json({
                error: true,
                message: "Usuário não encontrado."
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
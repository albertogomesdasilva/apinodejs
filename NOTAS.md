
// Rota para cadastrar uma nova situação
// Endereço: POST http://localhost:8080/situations
router.post("/situations", async (req, res) => {
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

        // 2. Cadastrar a nova situação
        const newSituation = await db.Situations.create(data);

        // 3. Retornar a resposta de sucesso
        return res.status(201).json({
            error: false,
            message: "Situação cadastrada com sucesso!",
            dataSituation: newSituation
        });

    } catch (error) {
        // 4. Capturar e lidar com erros
        console.error("Erro ao cadastrar situação:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao cadastrar situação."
        });
    }
});

// Rota para editar uma situação
// Endereço: PUT http://localhost:8080/situation
router.put("/situation", async (req, res) => {
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
        // 4. Capturar e lidar com erros
        console.error("Erro ao editar situação:", error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao editar situação."
        });
    }
});
//** fim

# npm init

# npm install --save express

# npm install -g nodemon

# npm install --save sequelize
https://sequelize.org/docs/v6/getting-started/
Installing
Sequelize is available via npm (or yarn).

npm install --save sequelize

You'll also have to manually install the driver for your database of choice:

# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database

https://sequelize.org/docs/v7/cli/

# npm install --save body-parser

# npm install --save cors

# npm install --save dotenv

### app.js
const express = require ('express')

const app = express()

//MIDDLEWARE QUE PERMITE COM QUE A APLICAÇÃO RECEBA DADOS EM FORMATO DE OBJETO (json)
app.use(express.json());

//ROTAS
app.get("/",(req, res) => {
    res.send("Olá Mundo!")
})

app.get("/users/:id", (req, res) => {
    const id = req.params.id
    const { sit } = req.query
    // res.send(`Visualizar -  ID do usuário: ${id} `)
    // ou pode receber como resposta um objeto
    return res.json({
        id:id,
        sit: sit,
        name: "Alberto Gomes",
        email: "alberto@gmail.com"
    })
})

// POST USERS
app.post("/users", (req, res) => {
    var user = req.body
    console.log("Dados Cadastrados com Sucesso!", user)
    return res.json(user)
})

// Rota para ALTERAR USUÁRIO
app.put("/users/:id", (req, res) => {
    // Desestruturação do corpo da requisição para pegar os dados
    const { name, email, password } = req.body;
    const { id } = req.params; // Lembre-se de pegar o ID dos parâmetros da URL, não do corpo

    // Aqui você faria a lógica de atualização no banco de dados
    // Por exemplo: updateUserInDatabase(id, { name, email, password });

    // Exemplo de log no console
    console.log(`O usuário com o ID: ${id} foi alterado com sucesso!`);

    // A resposta deve ser um único objeto JSON
    // Incluímos a mensagem de sucesso e os dados atualizados no mesmo objeto
    return res.json({
        message: "Usuário alterado com sucesso!",
        updatedUser: {
            id: id,
            name: name,
            email: email,
            password: password // Em uma aplicação real, não retorne a senha
        }
    });
});

// DELETAR USUÁRIO ENVIANDO SOMENTE O ID

app.delete("/users/:id", (req, res) => {
    var id = req.params.id
    var message = "O ID: " + id + " foi apagado com sucesso!"
    return res.json({
        message,
        id
    })

})



app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080 / http://192.168.100.5:8080")
})



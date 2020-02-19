// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({extended: true}))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const conexao = new Pool({
    host: "localhost",
    user: "postgres",
    password: "brboot",
    database: "doe",
    port: 5432,
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

/* lista de doadores: array/vetor
// conexão com a banco de dados feito esse pedaço de código não é mais necessário 
const donors = [
    {
        name: "Aparecida Nunes Soares",
        blood: "AB+"
    },
    {
        name: "Pedro Alvares de Cabral",
        blood: "A-"
    },
    {
        name: "Antonio Nunes",
        blood: "B+"
    },
    {
        name: "Alvarenga Soares Brito",
        blood: "O+"
    },
]*/

// configurar a apresentação da página
server.get("/", function(req, res){

    conexao.query("SELECT * FROM doador ORDER BY id DESC LIMIT 8", function(err, result){
        if (err) return res.send("Erro no banco de dados.")
       
        const donors = result.rows
        return res.render("index.html", { donors })
    })    
})

server.post("/", function(req, res) {
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    /* coloco valores dentro do array
    // conexão com a banco de dados feito esse pedaço de código não é mais necessário
    donors.push({
        name: name,
        blood: blood,
    })*/

    if (name == "" || email == "" || blood == ""){
        
        return res.send("Todos os campos devem ser preenchidos!")        
        
    }

    // salvando no banco de dados
    const query = 'INSERT INTO doador ("blood", "email", "name") VALUES ($1, $2, $3)'

    const values = [blood, email, name] 

    conexao.query(query, values, function(err){

        // fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        /*if (err) {
            console.log(err)
              return res.send("erro no banco de dados." + err)
            }*/

        // fluxo ideal
        return res.redirect("/")
    })    
})


// ligar o servidor e permitir o acesso a porta 3000
server.listen(3000, function() {
    console.log("Servidor INICIADO.")
})
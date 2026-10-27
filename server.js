import pool from "./db.js"
import cors from "cors"
import express from "express"
import bcrypt from "bcryptjs"


const PORT = 3000
const app = express()


app.use(express.json())
app.use(cors())
app.use(express.static('./public'))

//===================================================================================================
//===================================================================================================



app.post('/clientes/register', async (req, res) =>{
    const {nome, cpf, telefone, senha} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)
    const hashedCPF = await bcrypt.hash(cpf, salt)


    const queryText = 'INSERT INTO clientes (nome, cpf, telefone, senha) VALUES ($1, $2, $3, $4) RETURNING *'
    const novoClientes = await pool.query(queryText, [nome, hashedCPF, telefone, hashedPassword])

    res.json("criado com sucesso")
})







app.post('/barbeiros/register', async (req, res) =>{
    const {nome, cpf, telefone, senha} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)
    const hashedCPF = await bcrypt.hash(cpf, salt)

    const queryText = 'INSERT INTO barbeiros (nome, cpf, telefone, senha) VALUES ($1, $2, $3, $4) RETURNING *'
    const novoBarbeiro = await pool.query(queryText, [nome, hashedCPF, telefone, hashedPassword])
    res.json(novoBarbeiro)
})

//===================================================================================================
//===================================================================================================
app.post('/clientes/login', async (req, res) =>{
    const {nome, cpf, telefone, senha} = req.body
    const queryText = 'SELECT * FROM clientes WHERE nome = $1 AND telefone = $2'
    const user = await pool.query(queryText, [nome, telefone])
    const isPasswordValid = await bcrypt.compare(senha, user.senha)

    if(!isPasswordValid){
        console.log('Credenciais incorretas')
    }

    res.json('Logado com sucesso')
})

app.post('/barbeiros/login', async (req, res) =>{
    const {nome, cpf, telefone, senha} = req.body
    const queryText = 'SELECT * FROM barbeiros WHERE nome = $1 AND telefone = $2 RETURNING *'
    const user = await pool.query(queryText, [nome, telefone])
    const isPasswordValid = await bcrypt.compare(senha, user.senha)

    if(!isPasswordValid){
        console.log('Credenciais incorretas')
    }

    res.json('Logado com sucesso')
})



app.listen(PORT, () =>{
    console.log("Servidor rodando na porta 3000")
})
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const Produto = require('./models/Produto')

const PORT = 3000
const hostname = 'localhost'
/* ------------ Configuração express --------------- */
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

/* ------------ Configuração express-handlebars ---- */
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
/* ------------------------------------------------- */

app.post('/apagar', async (req,res)=>{
    const nome = req.body.nome
    // console.log(nome)
    let msg = 'Produto não encontrado na base de dados para exclusão!'
    let msg2 = 'Produto excluído da base de dados!'
    const dado_nome = await Produto.findOne({raw:true, where: {nome:nome}})
    console.log(dado_nome)
    console.log(dado_nome.id)
    if(dado_nome != null){
        Produto.destroy({where: {id: dado_nome.id}})
        res.render('apaga', {msg2})
    }else{
        res.render('apaga', {msg})
    }
})

app.get('/apagar', (req,res)=>{
    res.render('apaga')
})

app.post('/atualizar', async (req,res)=>{
    const nome = req.body.nome
    const qtde_produto = Number(req.body.qtde_produto)
    const preco_prod = Number(req.body.preco_prod)
    console.log(nome,qtde_produto,preco_prod)
    let msg = 'Tipo de dados inválidos, digite novamente'
    let msg2 = 'Dados cadastrados!'
    let msg3 = 'Produto não encontrado na base de dados para atualizar'

    const dado_nome = await Produto.findOne({raw:true, where: {nome:nome}})
    // console.log(dado_nome)

    if(dado_nome != null){
        const dados = {
            nome: nome,
            qtde_produto: qtde_produto,
            preco_prod: preco_prod
        }
        if((typeof nome ==='string')&&(typeof qtde_produto ==='number')&&(typeof preco_prod ==='number')){
            await Produto.update(dados, {where: {nome:nome}})
            console.log(msg2)
            res.render('atualiza', {msg2})
        }else{
            console.log(msg)
            res.render('atualiza', {msg})
        }
    }else{
        console.log(msg)
        res.render('atualiza', {msg3})
    }
    // res.redirect('/atualizar')
})

app.get('/atualizar', (req,res)=>{
    res.render('atualiza')
})

app.post('/cadastrar', (req,res)=>{
    const nome = req.body.nome
    const qtde_produto = Number(req.body.qtde_produto)
    const preco_prod = Number(req.body.preco_prod)
    console.log(nome,qtde_produto,preco_prod)
    let msg = 'Tipo de dados inválidos, digite novamente'
    let msg2 = 'Dados cadastrados!'
    if((typeof nome ==='string')&&(typeof qtde_produto ==='number')&&(typeof preco_prod ==='number')){
        Produto.create({nome,qtde_produto,preco_prod})
        console.log(msg2)
        res.render('cadastra', {msg2})
    }else{
        console.log(msg)
        res.render('cadastra', {msg})
    }
})

app.get('/cadastrar', (req,res)=>{
    res.render('cadastra')
})

app.post('/consultar', async (req,res)=>{
    const nome = req.body.nome
    // console.log(nome)
    const dados = await Produto.findOne({raw:true, where: {nome:nome}})
    // console.log(dados)
    let msg = 'Digite o nome de um produto'
    let msg2 = 'Produto não encontrado'
    if(nome == ''){
        console.log(msg)
        res.render('consulta', {msg})
    }else if(dados === null){
        console.log(msg2) 
        res.render('consulta', {msg2})       
    }else{
        console.log(dados)
        res.render('consulta', {valores: dados})
    } 
})

app.get('/consultar', (req,res)=>{
    res.render('consulta')
})

app.get('/listar', async (req,res)=>{
    const dados = await Produto.findAll({raw:true})
    console.log(dados)
    res.render('lista', {valores: dados})
})

app.get('/', (req,res)=>{
    res.render('home')
})
/* ------------------------------------------------- */
conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados!')
})

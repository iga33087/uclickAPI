const express = require('express')
const cors = require('cors')
const requestIp = require('request-ip');
const bodyParser = require('body-parser')
const app = express()
const  lib = require('./lib/index.js')
const port = process.env.PORT || 81;
app.use(cors());
app.use(bodyParser.json({limit : '2100000kb'}));

app.all('/*', function(req, res, next){
  console.log('all')
  next()
})

app.get('/', async function (req, res) {
  res.send("v1")
})

app.post('/login', async function (req, res) {
  console.log(req.body)
  let data=await lib.login(req.body)
  res.send(data)
})

app.get('/testToken', async function (req, res) {
  console.log('/testToken')
  let data=await lib.testToken(req)
  res.send(data)
})

app.post('/userInfoByToken', async function (req, res) {
  console.log(req.headers.token)
  let data=await lib.userInfoByToken(req.headers.token)
  res.send(data)
})

app.get('/Project', async function (req, res) {
  console.log(requestIp.getClientIp(req))
  let data=await lib.getProject()
  res.send(data)
})

app.get('/ProjectById', async function (req, res) {
  let data=await lib.getProjectById(req.query)
  res.send(data)
})

app.post('/Project', async function (req, res) {
  let data=""
  if(!await lib.userInfoByToken(req.headers.token)) data={success:false} 
  else data=await lib.postProject(req.body)
  console.log(111,data)
  res.send(data)
})

app.put('/Project', async function (req, res) {
  let data=await lib.putProject(req.body)
  res.send(data)
})

app.delete('/Project', async function (req, res) {
  let data=await lib.deleteProject(req.query)
  res.send(data)
})

app.get('/Mail', async function (req, res) {
  let data=await lib.getMail()
  res.send(data)
})

app.get('/MailById', async function (req, res) {
  let data=await lib.getMailById(req.query)
  res.send(data)
})

app.post('/Mail', async function (req, res) {
  let data=await lib.postMail(req.body)
  res.send(data)
})

app.delete('/Mail', async function (req, res) {
  console.log(req.query)
  let data=await lib.deleteMail(req.query)
  res.send(data)
})

app.get('/Article', async function (req, res) {
  let data=await lib.getArticle(req.query)
  res.send(data)
})

app.get('/ArticleByObj', async function (req, res) {
  let data=await lib.getArticleByObj(req.query)
  res.send(data)
})

app.get('/ArticleById', async function (req, res) {
  let data=await lib.getArticleById(req.query)
  res.send(data)
})

app.post('/Article', async function (req, res) {
  let data=await lib.postArticle(req.body)
  res.send(data)
})

app.put('/Article', async function (req, res) {
  let data=await lib.putArticle(req.body)
  res.send(data)
})

app.delete('/Article', async function (req, res) {
  let data=await lib.deleteArticle(req.query)
  res.send(data)
})

app.get('/Tag',async function (req, res) {
  let data=await lib.getTag()
  res.send(data)
})

app.get('/TagById', async function (req, res) {
  let data=await lib.getTagById(req.query)
  res.send(data)
})


app.post('/Tag',async function (req, res) {
  let data=await lib.postByObj('tag',req.body)
  res.send(data)
})

app.put('/Tag',async function (req, res) {
  let data=await lib.putByObj('tag',req.body,req.body.id)
  res.send(data)
})

app.delete('/Tag',async function (req, res) {
  let data=await lib.deleteByObj('tag',req.query)
  res.send(data)
})

app.post('/Object',async function (req, res) {
  let data=await lib.postByObj('article',req.body)
  res.send(data)
})

app.put('/Object',async function (req, res) {
  let data=await lib.putByObj('article',req.body,req.body.id)
  res.send(data)
})

app.get('/limt',async function (req, res) {
  let data=await lib.limt(req.query)
  res.send(data)
})

app.listen(port,()=> {
  console.log(port)
})
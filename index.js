const express = require('express')
const cors = require('cors')
const requestIp = require('request-ip');
const bodyParser = require('body-parser')
const app = express()
const  lib = require('./lib/index.js')

app.use(cors());
app.use(bodyParser.json())

app.all('/*', function(req, res, next){
  //console.log('all',req)
  next()
})

app.post('/login', async function (req, res) {
  console.log(req.body)
  let data=await lib.login(req.body)
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
  let data=await lib.postProject(req.body)
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
  let data=await lib.getArticle()
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

app.listen(3000)
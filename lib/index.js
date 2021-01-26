const Database = require('sqlite-async')
const moment = require('moment')
const jwt = require('jsonwebtoken');
//const exp = Math.floor(new Date.getTime() / 1000)+(60*60)*1
const secret = 'cdv515sv1d56bggnhh59fdb156'

module.exports = {
  login:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT name,account FROM user WHERE account="'+req.account+'" AND password="'+req.password+'"', (err, row)=> {
      arr.push(row)
    });
    if(arr.length) {
      let token = jwt.sign({data:arr[0],exp: Math.floor(Date.now() / 1000) + (60 * 60)}, secret);
      return {token,data:arr[0],success:true}
    }
    else {
      return {success:false}
    }
  },
  userInfoByToken:async function(x) {
    console.log("userInfoByToken")
    if(x) {
      let decoded = jwt.verify(x, secret);
      console.log(decoded)
      return decoded
    }
    else {
      return ''
    }
  },
  getProject:async function() {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM project', (err, row)=> {
      arr.push(row)
    });
    return arr
  },
  getProjectById:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM project WHERE id = "'+req.id+'"', (err, row)=> {
      arr.push(row)
    });
    return arr[0]
  },
  postProject:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("INSERT INTO project (title,url,time) VALUES ('"+req.title+"','"+req.url+"','"+moment(new Date()).format('YYYY-MM-DD HH:mm:ss')+"')", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  putProject:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("UPDATE project SET title= '"+req.title+"', url= '"+req.url+"' WHERE id = '"+req.id+"'", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  deleteProject:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("DELETE FROM project WHERE id='"+req.id+"'", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  getMail:async function() {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM mail', (err, row)=> {
      arr.push(row)
    });
    return arr
  },
  getMailById:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM mail WHERE id = "'+req.id+'"', (err, row)=> {
      arr.push(row)
    });
    return arr[0]
  },
  postMail:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("INSERT INTO mail (name,phone,email,company,content,projectId,time) VALUES ('"+req.name+"','"+req.phone+"','"+req.email+"','"+req.company+"','"+req.content+"','"+req.projectId+"','"+moment(new Date()).format('YYYY-MM-DD HH:mm:ss')+"')", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  putMail:async function() {

  },
  deleteMail:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("DELETE FROM mail WHERE id='"+req.id+"'", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  getArticle:async function() {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM article', (err, row)=> {
      console.log(row.id + ": " + row.title);
      arr.push(row)
    });
    return arr
  },
  getArticleById:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM article WHERE id = "'+req.id+'"', (err, row)=> {
      arr.push(row)
    });
    return arr[0]
  },
  postArticle:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("INSERT INTO article (title,content,projectId,type,img,author,time) VALUES ('"+req.title+"','"+req.content+"','"+req.projectId+"','"+req.type+"','"+req.img+"','"+req.author+"','"+moment(new Date()).format('YYYY-MM-DD HH:mm:ss')+"')", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  putArticle:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("UPDATE article SET title= '"+req.title+"', content= '"+req.content+"', type='"+req.type+"', projectId='"+req.projectId+"',img='"+req.img+"',author='"+req.author+"'  WHERE id = '"+req.id+"'", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  deleteArticle:async function(req) {
    let db=await Database.open('./data/database.db')
    await db.run("DELETE FROM article WHERE id='"+req.id+"'", (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
}
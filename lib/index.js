const Database = require('sqlite-async')
const moment = require('moment')
const jwt = require('jsonwebtoken');
//const exp = Math.floor(new Date.getTime() / 1000)+(60*60)*1
const secret = 'cdv515sv1d56bggnhh59fdb156'
const pageCount = 3

module.exports = {
  getLimt(sql,page=1) {
    let res=sql+' LIMIT '+(page-1)*pageCount+','+pageCount
    return res
  },
  getSearch(key,arr,sql) {
    let res
    let string="("
    let sqlArr=sql.split("WHERE")
    for(let item of arr) {
      string+=item+" LIKE '%"+key+"%' OR "
    }
    string=string.substr(0, string.length-3)+')AND'
    return sqlArr[0]+" WHERE "+string+sqlArr[1]
  },
  async getPageCount(sql) {
    let num=0
    let db=await Database.open('./data/database.db')
    await db.each(sql, (err, row)=> {
      num++
    });
    num=Math.ceil(num/pageCount)
    return num
  },
  selectExport:function(table,obj) {
    let res="SELECT * FROM "+table+" WHERE "
    let arr=Object.keys(obj)
    let forNum=0
    for(let item of arr) {
      if(item=='page'||item=='key') continue;
      if(obj[item]) {
        if(item=='time') res+=item+" LIKE '%"+obj[item]+"%' AND "
        else res+=item+" LIKE '"+obj[item]+"' AND "
      }
      else {
        res+=item+" LIKE '%' AND "
      }
      forNum++
    }
    if(forNum) {
      res=res.substr(0, res.length-5)
    }
    return res
  },
  updataExport:function(table,obj,id) {
    let res="UPDATE "+table+" SET "
    let arr=Object.keys(obj)
    for(let item of arr) {
      //if(item==="id") continue;
      res+=item+" = '"+obj[item]+"',"
    }
    res=res.substr(0, res.length-1);
    res+="WHERE id = "+id
    return res
  },
  intoExport:function(table,obj) {
    obj['time']=moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let res="INSERT INTO "+table+" ("
    let arr=Object.keys(obj)
    for(let item of arr) {
      res+=item+","
    }
    res=res.substr(0, res.length-1)+") VALUES ("
    for(let item of arr) {
      res+="'"+obj[item]+"',"
    }
    res=res.substr(0, res.length-1)+")"
    return res
  },
  deleteExport:function(table,id) {
    let res="DELETE FROM "+table+" WHERE id='"+id+"'"
    return res
  },
  login:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT name,account FROM user WHERE account="'+req.account+'" AND password="'+req.password+'"', (err, row)=> {
      arr.push(row)
    });
    if(arr.length) {
      let token = jwt.sign({data:arr[0],exp: Math.floor(Date.now() / 1000) + (60*60)}, secret);
      return {token,data:arr[0],success:true}
    }
    else {
      return {success:false}
    }
  },
  testToken:function(req) {
    console.log(req.query.token)
    let decoded=""
    try {
      decoded = jwt.verify(req.query.token, secret);
    } catch (error) {
      return error
    }
    return decoded
  },
  userInfoByToken:async function(x) {
    let res=""
    console.log("userInfoByToken")
    if(x) {
      try {
        let decoded = jwt.verify(x, secret);
        res=decoded
      } catch (error) {
        res=''
      }
      console.log(res)
      return res
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
  getArticle:async function(req) {
    if(!req.projectId) req.projectId='%'
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM article WHERE projectId LIKE "'+req.projectId+'"', (err, row)=> {
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
  postByObj:async function(table,req) {
    let db=await Database.open('./data/database.db')
    let string=this.intoExport(table,req)
    //console.log(string)
    await db.run(string, (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  putByObj:async function(table,req,id) {
    let db=await Database.open('./data/database.db')
    let string=this.updataExport(table,req,id)
    //console.log(string)
    await db.run(string, (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  deleteByObj:async function(table,req) {
    let db=await Database.open('./data/database.db')
    let string=this.deleteExport(table,req.id)
    await db.run(string, (err, row)=> {
      console.log(row)
    });
    return {success:true}
  },
  getTag:async function() {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM tag', (err, row)=> {
      arr.push(row)
    });
    return arr
  },
  getTagById:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM tag WHERE id = "'+req.id+'"', (err, row)=> {
      arr.push(row)
    });
    return arr[0]
  },
  getArticleByObj:async function(req) {
    let arr=[]
    let db=await Database.open('./data/database.db')
    let string=this.selectExport('article',req)
    string=this.getSearch(req.key,['title','content'],string)
    let sqlString=this.getLimt(string,req.page)
    console.log(sqlString)
    let pageCountNum=await this.getPageCount(string)
    console.log(pageCountNum)
    await db.each(sqlString, (err, row)=> {
        console.log(row.id + ": " + row.title);
        arr.push(row)     
    });
    return {data:arr,pageCount:pageCountNum}
  },
  async limt(req) {
    if(!req.projectId) req.projectId='%'
    if(!req.page) req.page=1
    let arr=[]
    let db=await Database.open('./data/database.db')
    await db.each('SELECT * FROM article LIMIT '+(req.page-1)*pageCount+','+pageCount, (err, row)=> {
      console.log(row.id + ": " + row.title);
      arr.push(row)
    });
    return arr
  }
}
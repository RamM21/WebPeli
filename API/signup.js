const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const fs = require("fs")

//Create connection to database
const con = mysql.createPool({
    host     : process.env.databaseHost,
    user     : process.env.user,
    password : process.env.password,
    port     : '3306',
    database : process.env.database,
    ssl:{ca:fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
})

exports.handler = async function(event,context){
    //Parse incoming body
    var body = JSON.parse(event.body)
    //Check for existing email and userName
    const array = await checkInput(con,body.email,body.userName)
    if(array.result.length>0){
        return {"successful":false}
    }
    else{
        //Hash password
        var password = await bcrypt.hash(body.password,10)
        //Add user to database
        return new Promise(function(resolve,reject){
            con.query("insert into users values(null,?,?,?)",[body.email,body.userName,password],function(err,result){
                if(err){
                    reject({"successful":false})
                }
                else{
                    resolve({"successful":true})
                }
            })
        })
    }
}
//Get results of email or username
function checkInput(con,email,userName){
    return new Promise(function(resolve,reject){
        con.query("select * from users where email=? or userName=?",[email,userName],function(err,result){
            if(err){
                reject({err})
            }else{
                resolve({result})
            }
        })
    })
}
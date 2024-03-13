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
    //Get user data from database with userId
    const user = await getUser(con,body.userId)
    var array = {}
    //Check for already existing email and username
    if(body.userName.length>0 || body.email.length>0){
       array = await checkNames(con,body.email,body.userName)
    }else{
        array={result:[]}
    }
    if(user.result.length>0 && array.result.length==0){
        //Change email, userName and password if given in body
        if(body.email.length>0){
            user.result[0].email=body.email
        }
        if(body.userName.length>0){
            user.result[0].userName=body.userName
        }
        if(body.password.length>0){
            user.result[0].password = await bcrypt.hash(body.password,10)
        }
        //Update user data to database in userId
        return new Promise(function(resolve,reject){
            con.query("update users set email=?,userName=?,password=? where userId=?",[user.result[0].email,user.result[0].userName,user.result[0].password,body.userId],function(err,result){
                if(err){
                    reject ({"successful":false})
                }
                else{
                    resolve ({"successful":true})
                }
            })
        })
    }
    else{
        return {"successful":false}
    }
}
//Get user data with userId
function getUser(con,userId){
    return new Promise(function(resolve,reject){
        con.query("select * from users where userId=?",[userId],function(err,result){
            if(err){
                reject ({err})
            }
            else{
                resolve ({result})
            }
        })
    })
}
//Get results with email or username
function checkNames(con,email,userName){
    return new Promise(function(resolve,reject){
        con.query("select * from users where email=? or userName=?",[email,userName],function(err,result){
            if(err){
                reject ({err})
            }
            else{
                resolve ({result})
            }
        })
    })
}
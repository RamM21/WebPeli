const mysql = require('mysql')
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
    //Check if user has earlier score
    const score = await getScore(con,body.userId)
    if(score.result.length>0){
        //Update users new score to database
        if(body.userName.length>0 && body.score.length>0){
            return new Promise(function(resolve,reject){
                con.query("update score set score=?, userName=? where Users_userId=?",[body.score,body.userName,body.userId],function(err,result){
                    if(err){
                        reject ({err})
                    }
                    else{
                        resolve({"successful":true})
                    }
                })
            })
        }
        else{
            return {"successful":false}
        }
    }else{
        if(body.userName.length>0 && body.score.length>0){
            //Add users new score to database
            return new Promise(function(resolve,reject){
                con.query("insert into Score values (null,?,?,?)",[body.score,body.userName,body.userId],function(err,result){
                    if(err){
                        reject ({err})
                    }
                    else{
                        resolve({"successful":true})
                    }
                })
            })
        }
        else{
            return {"successful":false}
        }
    }
}
//Get data with userId
function getScore(con,userId){
    return new Promise(function(resolve,reject){
            con.query("select * from score where Users_userId=?",[userId],function(err,result){
                if(err){
                    reject ({err})
                }
                else{
                    resolve({result})
                }
            })
        })
}
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
    //Check if user with email exists
    const array = await checkEmail(con,body.email)
    if(array.result.length>0){
        //Check that password matches with one in database
        const res = await bcrypt.compare(body.password,array.result[0].password)
        if(res){
            //Return userId and userName
            return {"successful":true,"userId":array.result[0].userId,"userName":array.result[0].userName}
        }
        else{
            return {"successful":false}
        }
    }
    else{
        return {"successful":false}
    }
}
//Get results with given email
function checkEmail(con,email){
    return new Promise(function(resolve,reject){
        con.query("select * from users where email=?",[email],function(err,result){
            if(err){
                reject({err})
            }
            else{
                resolve({result})
            }
        })
    })
}
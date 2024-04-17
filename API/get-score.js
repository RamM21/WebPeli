const mysql = require('mysql');
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

exports.handler=(event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;
    //Get scores from highest to lowest
    con.query('select score,userName from score order by score desc',function(err,result){
        if (err) throw err;
        callback(null, result)
    })
}
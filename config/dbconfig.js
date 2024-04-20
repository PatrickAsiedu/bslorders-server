const mysql = require('mysql2');
require('dotenv').config();


//create mysql connection
const db_connection =  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_name,
    port: process.env.DB_port

})

db_connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('Connection to DB successfull with id ' + db_connection.threadId);
  });




module.exports = db_connection;
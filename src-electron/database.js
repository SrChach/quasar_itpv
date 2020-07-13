const mysql = require('promise-mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'electrondb',
  user: 'root',
  password: 'Somepassword',
  port: 3306
})

function getConnection () {
  return connection
}

module.exports = { connection, getConnection }

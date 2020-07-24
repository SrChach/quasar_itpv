const mysql = require('promise-mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'itpv',
  user: 'root',
  password: 'cobusiness1348',
  port: 3336
})

function getConnection () {
  return connection
}

module.exports = { connection, getConnection }

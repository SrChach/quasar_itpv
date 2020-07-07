const mysql = require('promise-mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nacho1...',
  database: 'electrondb'
})

function getConnection () {
  return connection
}

module.exports = { getConnection }

const mysql = require('promise-mysql')

function createConnection () {
  try {
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'itpv',
      user: 'root',
      password: 'cobusiness1348',
      port: 3336
    })
    return connection
  } catch (error) {
    return undefined
  }
}

const connection = createConnection()

function getConnection () {
  if (connection === undefined)
    throw 'No se pudo conectar a la base de datos. Checa que ITPV esté corriendo en este momento y reinicia esta aplicacion'
  return connection
}

module.exports = { connection, getConnection }

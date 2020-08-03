/** Database */
const { getConnection } = require('./database.js')

/** Utilities */
const SHA1 = require('crypto-js/sha1')
const Hex = require('crypto-js/enc-hex')
const { getUpdateConditions } = require('./utils.js')

let conn = null

/** SELECT example */
const getProducts = async () => {
  if (conn === null)
    conn = await getConnection()
  const result = await conn.query('SELECT * FROM products')
  return result
}

const checkAdminUser = async (pass = '') => {
  if (conn === null)
    conn = await getConnection()
    const encryped = SHA1(pass).toString(Hex).toUpperCase()
    const res = await conn.query(`SELECT APPPASSWORD FROM people WHERE ID = 0 AND ( APPPASSWORD='sha1:${encryped}' OR APPPASSWORD IS NULL )`)

    if (res.length == 1) {
      let pass = res[0].APPPASSWORD
      return (pass === null) ? SHA1('temporal').toString(Hex).toUpperCase() : pass.replace('sha1:', '')
    }
    return null
}

/** Old app */
const insertProduct = async (product) => {
  if (conn === null)
    conn = await getConnection()
  const result = await conn.query('INSERT INTO products set ?', product)
  return result
}

const updateProduct = async (product, idObject) => {
  if (conn === null)
    conn = await getConnection()
  try {
    const result = await conn.query(`UPDATE products SET ? WHERE ?`, [product, idObject])
    return result
  } catch (error) {
    console.log(error)
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

const insertTicket = async (datos, resourceId) => {
  if (conn === null)
    conn = await getConnection()
  const result = await conn.query('UPDATE resources SET resources.CONTENT=' + datos + ' WHERE resources.ID="' + resourceId + '"')
  return result
}

module.exports = { getProducts, insertProduct, checkAdminUser, insertTicket, updateProduct }

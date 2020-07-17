const { getConnection } = require('./database.js')
const SHA1 = require('crypto-js/sha1')
const Hex = require('crypto-js/enc-hex')

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
    const res = await conn.query(`SELECT * FROM people WHERE ID = 0 AND APPPASSWORD='sha1:${encryped}'`)
    return res
}

/** Old app */
const insertProduct = async (product) => {
  if (conn === null)
    conn = await getConnection()
  product.price = parseFloat(product.price)
  const result = await conn.query('INSERT INTO product set ?', product)
  return result
}

module.exports = { getProducts, insertProduct, checkAdminUser }

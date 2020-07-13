const { getConnection } = require('./database.js')

let conn = null

/** SELECT example */
const getProducts = async () => {
  if (conn === null)
    conn = await getConnection()
  const result = await conn.query('SELECT * FROM products')
  return result
}

const insertProduct = async (product) => {
  if (conn === null)
    conn = await getConnection()
  product.price = parseFloat(product.price)
  const result = await conn.query('INSERT INTO product set ?', product)
  return result
}

module.exports = { getProducts, insertProduct }

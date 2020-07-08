const { getConnection } = require('./database.js')

/** SELECT example */
const getProducts = async () => {
  const conn = await getConnection()
  const result = await conn.query('SELECT * FROM product')
  return result
}

const insertProduct = async (product) => {
  const conn = await getConnection()
  product.price = parseFloat(product.price)
  const result = await conn.query('INSERT INTO product set ?', product)
  return result
}

module.exports = { getProducts, insertProduct }

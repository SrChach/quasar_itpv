/** Database */
const { getConnection } = require('./database.js')

/** Utilities */
const SHA1 = require('crypto-js/sha1')
const Hex = require('crypto-js/enc-hex')

let conn = null


const getProducts = async (search = '.*') => {
  if (conn === null)
    conn = await getConnection()
  try {
    const result = await conn.query(`
      SELECT p.*, sc.UNITS, sl.STOCKSECURITY, sl.STOCKMAXIMUM, c.NAME as CATEGORIA
        FROM
            products p
          LEFT JOIN
            (
              SELECT PRODUCT, UNITS FROM stockcurrent WHERE LOCATION = 0
            ) sc ON p.ID = sc.PRODUCT
          LEFT JOIN
            (
              SELECT PRODUCT, STOCKSECURITY, STOCKMAXIMUM FROM stocklevel WHERE LOCATION = 0
            ) sl ON p.ID = sl.PRODUCT
          LEFT JOIN categories c ON c.ID = p.CATEGORY
        WHERE
          p.NAME REGEXP ? OR p.CODE REGEXP ? OR p.REFERENCE REGEXP ?
        ORDER BY CATEGORIA, NAME
    `, [search, search, search])
    return result
  } catch (error) {
    return []
  }
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
  const result = await conn.query('INSERT INTO products SET ?', product)
  return result
}

const updateProduct = async (product, idObject) => {
  if (conn === null)
    conn = await getConnection()
  try {
    const result = await conn.query(`UPDATE products SET ? WHERE ?`, [product, idObject])
    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

const insertTicket = async (datos, resourceId) => {
  if (conn === null)
    conn = await getConnection()
  const result = await conn.query('UPDATE resources SET resources.CONTENT=' + datos + ' WHERE resources.ID="' + resourceId + '"')
  return result
}

const updateStockCurrent = async (productId, units) => {
  if (conn === null) conn = await getConnection()
  const check = await conn.query('SELECT * FROM stockcurrent WHERE PRODUCT = ? AND LOCATION = 0', [productId])
  try {
    let result = null
    if (check.length > 0)
      result = await conn.query('UPDATE stockcurrent SET UNITS = ? WHERE PRODUCT = ? AND LOCATION = 0', [units, productId])
    else
      result = await conn.query('INSERT INTO stockcurrent SET ?', { LOCATION: 0, PRODUCT: productId, UNITS: units })

    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

const updateStockLevel = async (productId, min, max) => {
  if (conn === null) conn = await getConnection()
  const check = await conn.query(`
    SELECT ( SELECT COUNT(*) as num FROM stocklevel WHERE PRODUCT = ? AND LOCATION = 0 ) AS num,
        COALESCE(MAX(ID), 0) + 1 AS insertId
      FROM stocklevel
  `, [productId])
  const { num, insertId } = check[0]
  try {
    let result = null
    if (num > 0)
      result = await conn.query('UPDATE stocklevel SET STOCKSECURITY = ?, STOCKMAXIMUM = ? WHERE PRODUCT = ? AND LOCATION = 0', [min, max, productId])
    else
      result = await conn.query('INSERT INTO stocklevel SET ?', { ID: insertId, LOCATION: 0, PRODUCT: productId, STOCKSECURITY: min, STOCKMAXIMUM: max })

    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

module.exports = { getProducts, insertProduct, checkAdminUser, insertTicket, updateProduct, updateStockCurrent, updateStockLevel }

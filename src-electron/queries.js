/** Database */
const { getConnection } = require('./database.js')

/** Utilities */
const SHA1 = require('crypto-js/sha1')
const Hex = require('crypto-js/enc-hex')

let conn = null


/** Manage error and success with same interface */
function errorMessage (error) {
  return { data: null, error: String(error) }
};

function successMessage (data) {
  return { data: data, error: null }
}

const checkDBConnection = async () => {
  try {
    if (conn === null) { conn = await getConnection() }
    await conn.query('SELECT 1+1 AS result')
    return true
  } catch (error) {
      return false
  }
}

const getTotalPages = async (itemsPerPage = 5, search = '.*') => {
  try {
    if (conn === null) { conn = await getConnection() }
    const countQuery = `
      SELECT CEILING(COUNT(*) / ?) AS totalPages
        FROM products p
        WHERE
          p.NAME REGEXP ?
          OR p.CODE REGEXP ?
          OR p.REFERENCE REGEXP ?
          OR p.CATEGORY IN (
            SELECT ID FROM categories WHERE NAME REGEXP ?
          )
    `
    const result = await conn.query(countQuery, [itemsPerPage, search, search, search, search])
    return successMessage(result[0])
  } catch (error) {
    return errorMessage(error)
  }
}

const getProducts = async (search = '.*', offset = 0, itemsPerPage = 5) => {
  try {
    if (conn === null) { conn = await getConnection() }
    const limit = `LIMIT ${offset}, ${itemsPerPage}`
    const productsQuery = `
      SELECT p.*, sc.UNITS, sl.STOCKSECURITY, sl.STOCKMAXIMUM, c.NAME as CATEGORIA
        FROM
            (
              SELECT * FROM products
                WHERE
                  NAME REGEXP ?
                  OR CODE REGEXP ?
                  OR REFERENCE REGEXP ?
                  OR CATEGORY IN (
                    SELECT ID FROM categories WHERE NAME REGEXP ?
                  )
                ${limit}
            ) p
          LEFT JOIN
            (
              SELECT PRODUCT, UNITS FROM stockcurrent WHERE LOCATION = 0
            ) sc ON p.ID = sc.PRODUCT
          LEFT JOIN
            (
              SELECT PRODUCT, STOCKSECURITY, STOCKMAXIMUM FROM stocklevel WHERE LOCATION = 0
            ) sl ON p.ID = sl.PRODUCT
          LEFT JOIN categories c ON c.ID = p.CATEGORY
        ORDER BY CATEGORIA, NAME
    `
    const result = await conn.query(productsQuery, [search, search, search, search])
    return successMessage(result)
  } catch (error) {
    return errorMessage(error)
  }
}

const checkAdminUser = async (pass = '') => {
  try {
    if (conn === null) { conn = await getConnection() }
    const encryped = SHA1(pass).toString(Hex).toUpperCase()
    const res = await conn.query(`SELECT
        APPPASSWORD, NAME
      FROM people
      WHERE
        ID = 0
        AND ( APPPASSWORD='sha1:${encryped}' OR APPPASSWORD IS NULL OR APPPASSWORD='empty:' OR APPPASSWORD='' OR APPPASSWORD='sha1:' )
    `)

    // eslint-disable-next-line eqeqeq
    if (res.length == 1) {
      let password = res[0].APPPASSWORD
      password = (password === null) ? SHA1(password).toString(Hex).toUpperCase() : password.replace('sha1:', '')
      return successMessage({ password, name: res[0].NAME })
    }
    return errorMessage('Password incorrecto. Checalo en la aplicación de ITPV')
  } catch (error) {
    return errorMessage(`Error. Cheque que ITPV esté corriendo y reinicie esta aplicacion. Codigo: ${error.errno}`)
  }
}

const insertProduct = async (product, fromExcel = false, arrayId) => {
  if (fromExcel === true) {
    // eslint-disable-next-line no-sequences,no-unused-expressions
    product.CATEGORY = '000',
    product.ISCOM = 0,
    product.PRECIO_DLL = 0,
    product.DISCOUNT = 0
  }
  try {
    if (conn === null) { conn = await getConnection() }
    const result = await conn.query('INSERT INTO products SET ?', product)
    return { affectedRows: result.affectedRows, other: result }
  } catch (error) {
    const obj = { error: error.sqlMessage, affectedRows: 0 }
    if (fromExcel === true && arrayId !== undefined) obj.arrayId = arrayId
    return obj
  }
}

// Solo retornará los elementos que fallaron
const insertProducts = async (products = [], fromExcel = false) => {
  const results = []
  for (let i = 0; i < products.length; i++) {
    const productId = products[i].ID

    let units = products[i].UNITS
    let min = products[i].STOCKSECURITY
    let max = products[i].STOCKMAXIMUM

    units = (typeof units === 'number' && !Number.isNaN(units)) ? units : null
    min = (typeof min === 'number' && !Number.isNaN(min)) ? min : null
    max = (typeof max === 'number' && !Number.isNaN(max)) ? max : null

    delete products[i].UNITS
    delete products[i].STOCKSECURITY
    delete products[i].STOCKMAXIMUM

    const singleRes = await insertProduct(products[i], fromExcel, i)
    if (singleRes.affectedRows < 1) {
      results.push(singleRes)
    } else {
      /** Para llegar aquí, tuvo que haber insertado ya el producto
       *  NOTA: Si se quieren imprimir los resultados de updatestockcurrent y updatestocklevel,
       *    se les tiene que poner 'await' enfrente
       */
      if (units !== null) updateStockCurrent(productId, units)
      if (min !== null || max !== null) updateStockLevel(productId, min, max)
      updateProductsCat(productId)
    }
  }

  return results
}

const insertCustomer = async (customer, fromExcel = false, arrayId) => {
  try {
    if (conn === null) { conn = await getConnection() }
    const result = await conn.query('INSERT INTO customers SET ?', customer)
    return { affectedRows: result.affectedRows, other: result }
  } catch (error) {
    const obj = { error: error.sqlMessage, affectedRows: 0 }
    if (fromExcel === true && arrayId !== undefined) obj.arrayId = arrayId
    return obj
  }
}

const insertCustomers = async (customers = [], fromExcel = false) => {
  const results = []
  for (let i = 0; i < customers.length; i++) {
    const singleRes = await insertCustomer(customers[i], fromExcel, i)
    if (singleRes.affectedRows < 1) {
      results.push(singleRes)
    }
  }

  return results
}

const updateProduct = async (product, idObject) => {
  try {
    if (conn === null) { conn = await getConnection() }
    const result = await conn.query('UPDATE products SET ? WHERE ?', [product, idObject])
    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}
// FER
const ejecutarScript = async (sql) => {
  try {
    if (conn === null) { conn = await getConnection() }
    const result = await conn.query(sql)
    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

const insertTicket = async (datos, resourceId) => {
  if (conn === null) { conn = await getConnection() }
  const result = await conn.query('UPDATE resources SET resources.CONTENT=' + datos + ' WHERE resources.ID="' + resourceId + '"')
  return result
}

const updateStockCurrent = async (productId, units) => {
  if (conn === null) conn = await getConnection()
  const check = await conn.query('SELECT * FROM stockcurrent WHERE PRODUCT = ? AND LOCATION = 0', [productId])
  try {
    let result = null
    if (check.length > 0) {
      result = await conn.query('UPDATE stockcurrent SET UNITS = ? WHERE PRODUCT = ? AND LOCATION = 0', [units, productId])
    } else {
      result = await conn.query('INSERT INTO stockcurrent SET ?', { LOCATION: 0, PRODUCT: productId, UNITS: units })
    }

    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

const updateProductsCat = async (productId) => {
  if (conn === null) conn = await getConnection()
  const check = await conn.query('SELECT * FROM products_cat WHERE PRODUCT = ?', [productId])
  try {
    let result = null
    if (check.length > 0) {
      result = await conn.query('UPDATE products_cat SET PRODUCT = ? WHERE PRODUCT = ?', [productId, productId])
    } else {
      result = await conn.query('INSERT INTO products_cat SET ?', { PRODUCT: productId })
    }

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
    if (num > 0) { result = await conn.query('UPDATE stocklevel SET STOCKSECURITY = ?, STOCKMAXIMUM = ? WHERE PRODUCT = ? AND LOCATION = 0', [min, max, productId]) } else { result = await conn.query('INSERT INTO stocklevel SET ?', { ID: insertId, LOCATION: 0, PRODUCT: productId, STOCKSECURITY: min, STOCKMAXIMUM: max }) }

    return result
  } catch (error) {
    return { error: error.sqlMessage, affectedRows: 0 }
  }
}

module.exports = {
  checkDBConnection,
  getProducts,
  getTotalPages,
  insertProduct,
  checkAdminUser,
  insertTicket,
  updateProduct,
  updateStockCurrent,
  updateStockLevel,
  insertProducts,
  insertCustomers,
  ejecutarScript
}

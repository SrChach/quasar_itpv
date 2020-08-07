/** utils */
const { utils, writeFile } = require('xlsx')

/** Header is in this form
 * match: (function)
 * databaseName: (String)
 * default: (any, optional),
 * changes: (function, optional),
 * validator: (function, optional),
 * col: (String)
*/

const makeValidationHeader = (header = [], config = []) => {
  const validationHeader = header.map(headField => {
    const res = config.find(el => el.match(headField) === true)
    if (res === undefined) return undefined
    return {
      name: res.databaseName,
      default: (res.default) ? res.default : null,
      isValid: (res.validator) ? res.validator : val => true,
      changes: (res.changes) ? res.changes : val => val
    }
  })
  return validationHeader
}

const cleanExcelData = (products = [], config = []) => {
  products = JSON.parse(JSON.stringify(products))
  if (!Array.isArray(products)) return []
  if (products.length < 1) return []

  // Obtenemos primer fila
  const validationHeader = makeValidationHeader(products[0], config)
  products.shift()
  const filtered = products.map(prod => {
    const currentRow = prod.reduce((acum, valorActual, index) => {
      const headField = validationHeader[index]
      if (headField === undefined) return acum

      if (valorActual === null || valorActual === undefined) valorActual = headField.default
      valorActual = headField.changes(valorActual)
      if (!headField.isValid(valorActual)) acum.___invalid = true

      acum[headField.name] = valorActual
      return acum
    }, {})

    return currentRow
  })
  return filtered
}

const reverseChanges = (products = [], config = []) => {
  const reversed = products.map(prod => {
    const simplified = {}
    for (const field in prod) {
      if (field !== '___invalid') {
        const el = config.find(c => c.databaseName === field)
        if (el !== undefined && el.col !== undefined) simplified[el.col] = prod[field]
      }
    }
    return simplified
  })
  return reversed
}

const saveExcel = (data, target, sheetName = 'test') => {
  try {
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, sheetName)

    writeFile(wb, target, { type: 'file' })
    return { message: `Excel guardado en ${target}` }
  } catch (error) {
    return { error: error, message: 'Oops! Algo falló al crear el Excel' }
  }
}

module.exports = { cleanExcelData, reverseChanges, saveExcel }

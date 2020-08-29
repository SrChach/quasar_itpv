/** utils */
const { utils, writeFile } = require('xlsx')
const { existsSync } = require('fs')

/** Header is in this form
 * match: (function)
 * databaseName: (String)
 * default: (any, optional),
 * changes: (function, optional),
 * validator: (function, optional),
 * col: (String)
*/

const isEmpty = (obj) => {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false
  }
  return true
}

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

const cleanExcelData = (inputData = [], config = []) => {
  inputData = JSON.parse(JSON.stringify(inputData))
  if (!Array.isArray(inputData)) return []
  if (inputData.length < 1) return []

  // Obtenemos primer fila
  const validationHeader = makeValidationHeader(inputData[0], config)
  inputData.shift()
  const filtered = inputData.map(inputRow => {
    const currentRow = inputRow.reduce((acum, valorActual, index) => {
      const headField = validationHeader[index]
      if (headField === undefined) return acum

      if (valorActual === null || valorActual === undefined) valorActual = headField.default
      valorActual = headField.changes(valorActual)
      if (!headField.isValid(valorActual)) acum.___invalid = true

      acum[headField.name] = valorActual
      return acum
    }, {})

    return currentRow
  }).filter(v => !isEmpty(v))

  return filtered
}

const toOriginalFormat = (processedArray = [], config = []) => {
  let missingFields = null
  const formattedBack = processedArray.map(row => {
    const original = {}
    for (const field in row) {
      if (field !== '___invalid') {
        const el = config.find(c => c.databaseName === field)
        if (el !== undefined && el.col !== undefined) original[el.col] = row[field]
      }
    }
    if (missingFields === null) {
      missingFields = config.reduce((acum, current) => {
        const inObject = Object.prototype.hasOwnProperty.call(original, current.col)
        if (!inObject) acum.push(current.col)
        return acum
      }, [])
    }
    missingFields.forEach(field => { original[field] = '' })
    return original
  })
  return formattedBack
}

const saveExcel = (data, target, sheetName = 'test') => {
  try {
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()

    if (existsSync(target)) {
      return {
        error: 'duplicated',
        message: `Ya existe el archivo ${target}. Cambielo o muevalo para poder descargar el nuevo`
      }
    }

    utils.book_append_sheet(wb, ws, sheetName)

    writeFile(wb, target, { type: 'file' })
    return { message: `Excel guardado en: \n ${target}` }
  } catch (error) {
    return { error: error, message: 'Oops! Algo falló al crear el Excel' }
  }
}

module.exports = { cleanExcelData, toOriginalFormat, saveExcel }

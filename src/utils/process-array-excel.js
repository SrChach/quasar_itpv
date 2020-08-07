// [
//   {
//     match: val => /^sku$/i.test(val),
//     databaseName: 'SKU',
//     default: 0,
//     changes: val => val === 9 ? 'si' : 'no',
//     validator: val => val === 'si'
//   } // Add type conversion
// ]
// match: (function), databaseName: (String), default: (any, optional), changes: (function, optional), validator: (function, optional)

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

export default cleanExcelData

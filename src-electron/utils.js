function getUpdateConditions (obj) {
  let updateFields = ''
  let comma = ''

  for (const key in obj) {
    updateFields += `${comma} :${key} = ?`
    comma = ','
  }
  return updateFields
}

module.exports = { getUpdateConditions }
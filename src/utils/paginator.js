const calculateOffsets = (itemsPerPage = 5, totalPages = 0, currentPage = 1) => {
  const offset = (currentPage - 1) * itemsPerPage
  const lastOffset = (totalPages - 1) * itemsPerPage

  let previousOffset = ((currentPage - 1) - 1) * itemsPerPage
  let nextOffset = ((currentPage + 1) - 1) * itemsPerPage
  if (previousOffset < 0) previousOffset = 0
  if (nextOffset > lastOffset) nextOffset = lastOffset

  const lastPage = (lastOffset / itemsPerPage) + 1

  return { offset, lastOffset, previousOffset, nextOffset, lastPage }
}

module.exports = { calculateOffsets }

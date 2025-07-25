async function query({
  fields = [],
  source = () => [],
  filter,
  order = null,
  groupBy
}) {
  const data = await source()

  // Validate fields
  if (fields.length) {
    for (const entry of data) {
      for (const field of fields) {
        if (!Object.prototype.hasOwnProperty.call(entry, field)) {
          throw new Error('Incorrect params')
        }
      }
    }
  }

  // Validate order
  if (order !== null && typeof order !== 'function') {
    throw new Error('Incorrect params')
  }

  // Validate groupBy if provided
  if (groupBy !== undefined) {
    if (typeof groupBy !== 'string') {
      throw new Error('Incorrect params')
    }
    for (const entry of data) {
      if (!Object.prototype.hasOwnProperty.call(entry, groupBy)) {
        throw new Error('Incorrect params')
      }
    }
  }

  // Apply filter
  let filteredData = data
  if (typeof filter === 'function') {
    filteredData = data.filter(filter)
  }

  // Project fields
  const projectedData = filteredData.map(entry => {
    if (!fields.length) return { ...entry }
    const obj = {}
    for (const field of fields) {
      obj[field] = entry[field]
    }
    return obj
  })

  // Apply sorting
  if (order) {
    projectedData.sort(order)
  }

  // Grouping logic can be added here if needed

  return projectedData
}
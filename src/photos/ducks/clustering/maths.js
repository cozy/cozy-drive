export const toRadians = degrees => {
  return (degrees * Math.PI) / 180
}

export const diffPairWise = values => {
  const d = values.map((d, i, arr) => arr[i + 1] - arr[i])
  d.pop()
  return d
}

export const standardDeviation = (values, avg) => {
  if (!avg) {
    avg = mean(values)
  }

  const squareDiffs = values.map(value => {
    const diff = value - avg
    return diff * diff
  })

  const avgSquareDiff = mean(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

export const mean = values => {
  const sum = values.reduce((sum, value) => {
    return sum + value
  }, 0)
  return sum / values.length
}

export const quantile = (array, percentile) => {
  const sortedArray = array.sort((a, b) => a - b)
  if (!percentile) {
    percentile = 100
  }

  const index = (percentile / 100) * (sortedArray.length - 1)
  if (Math.floor(index) === index) {
    return sortedArray[index]
  } else {
    const i = Math.floor(index)
    const fraction = index - i
    return sortedArray[i] + (sortedArray[i + 1] - sortedArray[i]) * fraction
  }
}

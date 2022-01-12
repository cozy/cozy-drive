export const toRadians = degrees => {
  return (degrees * Math.PI) / 180
}

export const diffPairWise = values => {
  const diffs = values.map((d, i, arr) => arr[i + 1] - arr[i])
  diffs.pop()
  return diffs
}

export const standardDeviation = (values, avg) => {
  let average = avg
  if (!avg) {
    average = mean(values)
  }

  const squareDiffs = values.map(value => {
    const diff = value - average
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

export const quantile = (array, percentile = 100) => {
  const sortedArray = array.sort((a, b) => a - b)

  const index = (percentile / 100) * (sortedArray.length - 1)
  if (Math.floor(index) === index) {
    return sortedArray[index]
  } else {
    const i = Math.floor(index)
    const fraction = index - i
    return sortedArray[i] + (sortedArray[i + 1] - sortedArray[i]) * fraction
  }
}

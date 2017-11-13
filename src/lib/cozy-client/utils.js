export const mapValues = (object, transform) => {
  let result = {}
  for (const key in object) {
    result[key] = transform(object[key], key)
  }
  return result
}

export const filterValues = (object, filter) => {
  let result = {}
  for (const key in object) {
    if (filter(object[key], key)) {
      result[key] = object[key]
    }
  }
  return result
}

export const removeObjectProperty = (obj, prop) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== prop) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

export const removeObjectProperties = (obj, props) => {
  const sProps = new Set(props)
  const res = Object.keys(obj).reduce((result, key) => {
    if (!sProps.has(key)) {
      result[key] = obj[key]
    }
    return result
  }, {})
  return res
}

export const sleep = (time, args) => {
  return new Promise(resolve => {
    setTimeout(resolve, time, args)
  })
}

export const retry = (fn, count, delay = 300) => {
  return function doTry(...args) {
    return fn(...args).catch(err => {
      if (--count < 0) {
        throw err
      }
      return sleep(getBackedoffDelay(delay, count)).then(() => doTry(...args))
    })
  }
}

const FUZZ_FACTOR = 0.3
export const getFuzzedDelay = retryDelay => {
  const fuzzingFactor = (Math.random() * 2 - 1) * FUZZ_FACTOR
  return retryDelay * (1.0 + fuzzingFactor)
}

export const getBackedoffDelay = (retryDelay, retryCount = 1) =>
  getFuzzedDelay(retryDelay * Math.pow(2, retryCount - 1))

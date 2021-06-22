const arrToObj = (obj = {}, [key, val = true]) => {
  obj[key] = decodeURIComponent(val)
  return obj
}

const getQueryParameter = () =>
  window.location.search
    .substring(1)
    .split('&')
    .map(varval => varval.split('='))
    .reduce(arrToObj, {})

export default getQueryParameter

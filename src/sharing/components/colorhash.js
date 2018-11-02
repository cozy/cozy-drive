const ColorHash = () => {
  const schemes = {
    base: [
      '304FFE',
      '2979FF',
      '00B0FF',
      '00DCE9',
      '00D5B8',
      '00C853',
      'E70505',
      'FF5700',
      'FF7900',
      'FFA300',
      'B3C51D',
      '64DD17',
      'FF2828',
      'F819AA',
      'AA00FF',
      '6200EA',
      '7190AB',
      '51658D'
    ]
  }

  const hashCode = str => {
    var h, i, len, max

    h = 0
    max = Math.pow(2, 32)

    for (i = 0, len = str.length; i < len; i++) {
      h = (h * 31 + str.charCodeAt(i)) % max
    }

    return h
  }

  const getColor = (str, name) => {
    var scheme, hash

    scheme = schemes[name] || schemes.base
    hash = hashCode(str)

    return '#' + scheme[hash % scheme.length]
  }

  return {
    getHash: hashCode,
    getColor: getColor
  }
}

export default ColorHash

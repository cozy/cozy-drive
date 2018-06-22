const jsonPluckLoader = require('./json-pluck-loader')

describe('pluck loader', () => {
  let data

  beforeEach(() => {
    const loaderContext = { query: '?key=a.b.c;e;a.h' }
    const json = {
      a: {
        b: {
          c: 3
        },
        h: 7,
        d: 4
      },
      e: 5,
      f: 6
    }
    const source = JSON.stringify(json)
    const res = jsonPluckLoader.call(loaderContext, source)
    data = JSON.parse(res.replace('module.exports = ', ''))
  })

  it('should keep only a subset of the JSON', function() {
    expect(data.a.d).toBe(undefined)
    expect(data.a.b.c).toBe(3)
    expect(data.a.h).toBe(7)
    expect(data.e).toBe(5)
    expect(data.f).toBe(undefined)
  })
})

import FuzzyPathSearch from './FuzzyPathSearch'

describe('simple search', () => {
  const guitars = [
    { name: 'fender stratocaster', path: '' },
    { name: 'fender telecaster', path: '' },
    { name: 'gibson SG', path: '' }
  ]

  let fps
  beforeEach(() => {
    fps = new FuzzyPathSearch(guitars)
  })

  it('should return an exact match', () => {
    const query = 'fender telecaster'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(guitars[1])
  })

  it('should return all possible matches', () => {
    const query = 'fender'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result.includes(guitars[0])).toBe(true)
    expect(result.includes(guitars[1])).toBe(true)
  })
})

describe('search with path', () => {
  const guitars = [
    { name: 'stratocaster', path: '/fender/' },
    { name: 'telecaster', path: '/fender/' },
    { name: 'SG', path: '/Gibson/' }
  ]

  let fps
  beforeEach(() => {
    fps = new FuzzyPathSearch(guitars)
  })

  it('should return an exact match', () => {
    const query = 'fender telecaster'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(guitars[1])
  })

  it('should return all possible matches', () => {
    const query = 'fender'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result.includes(guitars[0])).toBe(true)
    expect(result.includes(guitars[1])).toBe(true)
  })
})

describe('malformed queries', () => {
  const guitars = [
    { name: 'fender stratocaster', path: '' },
    { name: 'fender telecaster', path: '' },
    { name: 'gibson SG', path: '' }
  ]

  let fps
  beforeEach(() => {
    fps = new FuzzyPathSearch(guitars)
  })

  it('should handle different orders', () => {
    const query1 = 'telecaster fender'
    const result1 = fps.search(query1)

    const query2 = 'fender telecaster'
    const result2 = fps.search(query2)

    expect(result1).toEqual(result2)
  })

  it('should handle diacritics', () => {
    const query = 'télécaster fender'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(guitars[1])
  })

  it('should handle extra spaces', () => {
    const query = 'fender   telecaster'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(guitars[1])
  })

  it('should not care about casing', () => {
    const query = 'FENDER TeLeCASTER'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(guitars[1])
  })
})

describe('result ordering', () => {
  it('should favor names over pathes', () => {
    const guitars = [
      { name: 'telecaster', path: '/fender' },
      { name: 'fender', path: '/telecaster' }
    ]
    const fps = new FuzzyPathSearch(guitars)

    const query = 'tele'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result[0]).toBe(guitars[0])
    expect(result[1]).toBe(guitars[1])
  })

  it('should not care about the input order', () => {
    const guitars = [
      { name: 'telecaster', path: '/fender' },
      { name: 'fender', path: '/telecaster' }
    ]
    const fps = new FuzzyPathSearch(guitars)

    const query = 'tele'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result[0]).toBe(guitars[0])
    expect(result[1]).toBe(guitars[1])

    const reversed = guitars.reverse()
    const reversedFps = new FuzzyPathSearch(reversed)

    const reversedResult = reversedFps.search(query)

    expect(reversedResult).toBeInstanceOf(Array)
    expect(reversedResult.length).toEqual(2)
    expect(reversedResult[0]).toBe(guitars[1])
    expect(reversedResult[1]).toBe(guitars[0])
  })

  it('should favor matches nearer the start of the path', () => {
    const guitars = [
      { name: '2015', path: '/fender/telecaster/stratocaster/' },
      { name: '2015', path: '/fender/stratocaster/' }
    ]

    const fps = new FuzzyPathSearch(guitars)
    const query = 'stratocaster'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result[0]).toBe(guitars[1])
    expect(result[1]).toBe(guitars[0])
  })

  it('should fallback to the shortest path', () => {
    const guitars = [
      { name: '2015', path: '/fender/telecaster/stratocaster/' },
      { name: '2015', path: '/fender/stratocaster/' }
    ]

    const fps = new FuzzyPathSearch(guitars)
    const query = '2015'
    const result = fps.search(query)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(result[0]).toBe(guitars[1])
    expect(result[1]).toBe(guitars[0])
  })
})

describe('successive searches', () => {
  it('should filter results as the query gets longer', () => {
    const guitars = [
      { name: 'fender stratocaster', path: '' },
      { name: 'fender telecaster', path: '' },
      { name: 'gibson SG', path: '' }
    ]
    const fps = new FuzzyPathSearch(guitars)

    const result1 = fps.search('caster')

    expect(result1).toBeInstanceOf(Array)
    expect(result1.length).toEqual(2)
    expect(result1.includes(guitars[0])).toBe(true)
    expect(result1.includes(guitars[1])).toBe(true)

    const result2 = fps.search('caster tele')

    expect(result2).toBeInstanceOf(Array)
    expect(result2.length).toEqual(1)
    expect(result2.includes(guitars[1])).toBe(true)
  })

  it('should reset when queries backtrack', () => {
    const guitars = [
      { name: 'fender stratocaster', path: '' },
      { name: 'fender telecaster', path: '' },
      { name: 'gibson SG', path: '' }
    ]
    const fps = new FuzzyPathSearch(guitars)

    const result1 = fps.search('telecaster')

    expect(result1).toBeInstanceOf(Array)
    expect(result1.length).toEqual(1)
    expect(result1.includes(guitars[1])).toBe(true)

    const result2 = fps.search('caster')

    expect(result2).toBeInstanceOf(Array)
    expect(result2.length).toEqual(2)
    expect(result2.includes(guitars[0])).toBe(true)
    expect(result2.includes(guitars[1])).toBe(true)
  })
})

import {
  averageTime,
  convertDurationInMilliseconds,
  isDurationMoreThan24Hours
} from './utils'

describe('date', () => {
  it('Should compute the mean date', () => {
    const data = [
      {
        datetime: '2018-03-01T15:38:41+01:00',
        timestamp: 422198.64472222223
      },
      {
        datetime: '2018-07-17T15:13:09+02:00',
        timestamp: 425509.2191666667
      },
      {
        datetime: '2018-07-17T15:13:55+02:00',
        timestamp: 425509.2319444445
      },
      {
        datetime: '2018-07-17T15:16:00+02:00',
        timestamp: 425509.26666666666
      }
    ]
    const expectedTime = new Date('2018-06-13T01:35:26.249Z').getTime()
    expect(averageTime(data)).toEqual(expectedTime)
  })
})

describe('duration', () => {
  it('Should correctly convert duration', () => {
    const d1 = '2h'
    const d2 = '3m'
    const d3 = '4s'
    const d4 = '1h10m15s'
    const d5 = 'wrongduration'
    expect(convertDurationInMilliseconds(d1)).toEqual(7200000)
    expect(convertDurationInMilliseconds(d2)).toEqual(180000)
    expect(convertDurationInMilliseconds(d3)).toEqual(4000)
    expect(convertDurationInMilliseconds(d4)).toEqual(4215000)
    expect(convertDurationInMilliseconds(d5)).toEqual(0)
  })

  it('should correctly detect 24h duration', () => {
    const d1 = new Date('2020-01-01T12:00:00')
    const d2 = new Date('2020-01-02T12:00:01')
    expect(isDurationMoreThan24Hours(d1, d2)).toEqual(true)
    expect(isDurationMoreThan24Hours(d2, d1)).toEqual(true)

    const d3 = new Date('2020-01-01T12:00:00')
    const d4 = new Date('2020-01-02T12:00:00')
    expect(isDurationMoreThan24Hours(d3, d4)).toEqual(false)
    expect(isDurationMoreThan24Hours(d4, d3)).toEqual(false)

    const d5 = new Date('2020-01-01T12:00')
    const d6 = new Date('2020-01-01T13:00')
    expect(isDurationMoreThan24Hours(d5, d6)).toEqual(false)
    expect(isDurationMoreThan24Hours(d6, d5)).toEqual(false)
  })
})

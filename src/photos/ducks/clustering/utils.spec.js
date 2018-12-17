import { averageDate } from './utils'

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
    const expectedDate = new Date('2018-06-13T01:35:26.249Z')
    expect(averageDate(data)).toEqual(expectedDate)
  })
})

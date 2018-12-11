import { matchingClusters, matchingParameters } from './matching'

const photos = [
  {
    _id: 'photo1',
    name: 'photo1',
    datetime: '2018-07-17T15:13:09+02:00',
    timestamp: 425509.2191666667
  },
  {
    _id: 'photo2',
    name: 'photo2',
    datetime: '2018-07-17T15:14:09+02:00',
    timestamp: 425509.23583333334
  },
  {
    _id: 'photo3',
    name: 'photo3',
    datetime: '2018-12-17T15:13:09+02:00',
    timestamp: 429181.2191666667
  }
]

describe('auto albums', () => {
  it('Should match existing clusters with same date', () => {
    const existingAlbums = [
      {
        _id: 'album1',
        name: '2018-12-17T15:13:09+02:00',
        period: {
          start: '2018-12-17T15:13:09+02:00',
          end: '2018-12-17T15:13:09+02:00'
        }
      },
      {
        _id: 'album2',
        name: '2018-07-17T15:13:09+02:00',
        period: {
          start: '2018-07-17T15:13:09+02:00',
          end: '2018-07-17T15:14:09+02:00'
        }
      }
    ]
    let matching = matchingClusters(photos[0], existingAlbums)
    expect(matching.length).toEqual(1)
    expect(matching[0]).toEqual(existingAlbums[1])

    matching = matchingClusters(photos[1], existingAlbums)
    expect(matching.length).toEqual(1)
    expect(matching[0]).toEqual(existingAlbums[1])

    matching = matchingClusters(photos[2], existingAlbums)
    expect(matching.length).toEqual(1)
    expect(matching[0]).toEqual(existingAlbums[0])
  })

  it('Should match existing clusters with different dates', () => {
    const existingAlbums = [
      {
        _id: 'album1',
        name: '2019-07-17T15:13:09+02:00',
        period: {
          start: '2019-07-17T15:13:09+02:00',
          end: '2019-07-17T15:14:09+02:00'
        }
      },
      {
        _id: 'album2',
        name: '2016-12-17T15:13:09+02:00',
        period: {
          start: '2016-12-17T15:13:09+02:00',
          end: '2016-12-17T15:13:09+02:00'
        }
      }
    ]
    photos.push(
      {
        _id: 'photo4',
        name: 'photo4',
        datetime: '2014-07-17T15:13:09+02:00',
        timestamp: 390445.2191666667
      },
      {
        _id: 'photo5',
        name: 'photo5',
        datetime: '2020-07-17T15:13:09+02:00',
        timestamp: 478117.2191666667
      }
    )
    for (let i = 0; i < 3; i++) {
      let matching = matchingClusters(photos[i], existingAlbums)
      expect(matching.length).toEqual(2)
      expect(matching[0]).toEqual(existingAlbums[0])
      expect(matching[1]).toEqual(existingAlbums[1])
    }

    let matching = matchingClusters(photos[3], existingAlbums)
    expect(matching.length).toEqual(1)
    expect(matching[0]).toEqual(existingAlbums[1])

    matching = matchingClusters(photos[4], existingAlbums)
    expect(matching.length).toEqual(1)
    expect(matching[0]).toEqual(existingAlbums[0])
  })
})

describe('parameters', () => {
  const params = [
    {
      period: {
        start: '2016-01-01T00:00:00+00:00',
        end: '2016-12-31T00:00:00+00:00'
      }
    },
    {
      period: {
        start: '2017-01-01T00:00:00+00:00',
        end: '2017-07-31T00:00:00+00:00'
      }
    },
    {
      period: {
        start: '2019-01-01T00:00:00+00:00',
        end: '2020-01-01T00:00:00+00:00'
      }
    }
  ]
  it('Should match older photo', () => {
    const photos = [
      {
        datetime: '2014-03-01T15:38:41+01:00',
        timestamp: 387134.64472222223
      }
    ]
    const matching = matchingParameters(params, photos)
    expect(matching).toEqual(params[0])
  })
  it('Should match newer photo', () => {
    const photos = [
      {
        datetime: '2022-03-01T15:38:41+01:00',
        timestamp: 457262.64472222223
      }
    ]
    const matching = matchingParameters(params, photos)
    expect(matching).toEqual(params[2])
  })
  it('Should match photo inside a period', () => {
    const photos = [
      {
        datetime: '2017-03-01T15:38:41+01:00',
        timestamp: 413438.64472222223
      }
    ]
    const matching = matchingParameters(params, photos)
    expect(matching).toEqual(params[1])
  })
  it('Should match photo between two periods', () => {
    const photos = [
      {
        datetime: '2018-03-01T15:38:41+01:00',
        timestamp: 426614.64472222223
      }
    ]
    const matching = matchingParameters(params, photos)
    expect(matching).toEqual(params[2])
  })
})

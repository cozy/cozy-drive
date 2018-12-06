import { matchingClusters } from './matching'

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

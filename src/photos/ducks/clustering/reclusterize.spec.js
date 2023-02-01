jest.mock('./files')

import { getFilesByAutoAlbum } from './files'
import { albumsToClusterize } from './reclusterize'
import { prepareDataset } from './utils'
import CozyClient from 'cozy-client'
jest.mock('cozy-logger')

const client = new CozyClient({})

// Photos are sorted in ascending order
let newPhotos = [
  {
    id: 'p1',
    metadata: {
      datetime: '2018-01-01T00:00:00'
    }
  },
  {
    id: 'p2',
    metadata: {
      datetime: '2018-01-02T00:00:01'
    }
  },
  {
    id: 'p3',
    metadata: {
      datetime: '2018-01-02T12:00:00'
    }
  },
  {
    id: 'p4',
    metadata: {
      datetime: '2018-01-04T00:00:00'
    }
  },
  {
    id: 'p5',
    metadata: {
      datetime: '2019-01-04T00:00:00'
    }
  }
]

newPhotos = prepareDataset(newPhotos)

const existingPhotos = [
  {
    id: 'pe1',
    metadata: {
      datetime: '2018-01-01T00:00:00'
    },
    clusterId: 'a3'
  },
  {
    id: 'pe2',
    metadata: {
      datetime: '2018-01-02T00:00:00'
    },
    clusterId: 'a2'
  },
  {
    id: 'pe3',
    metadata: {
      datetime: '2018-01-03T00:00:00'
    },
    clusterId: 'a2'
  },
  {
    id: 'pe4',
    metadata: {
      datetime: '2018-01-05T12:00:00'
    },
    clusterId: 'a1'
  }
]

const existingPhotosPrepared = prepareDataset(existingPhotos)

// Albums are sorted in descending order
const albums = [
  {
    id: 'a1',
    period: {
      start: '2018-01-05T00:00:00',
      end: '2018-01-06T00:00:00'
    }
  },
  {
    id: 'a2',
    period: {
      start: '2018-01-02T00:00:00',
      end: '2018-01-03T00:00:00'
    }
  },
  {
    id: 'a3',
    period: {
      start: '2018-01-01T00:00:00',
      end: '2018-01-01T00:00:00'
    }
  }
]

describe('clusterize', () => {
  it('Should build the clusterize map with only new photos and no merge', async () => {
    const photos = [...newPhotos]
    photos.splice(3, 1)
    getFilesByAutoAlbum.mockImplementation(() => Promise.resolve([]))
    const clusterize = await albumsToClusterize(client, photos, albums)
    const expected = new Map([
      [[albums[0]], [photos[3]]],
      [[albums[1]], [photos[1], photos[2]]],
      [[albums[2]], [photos[0]]]
    ])
    expect(clusterize).toEqual(expected)
  })

  it('Should build the clusterize map with only new photos and merge', async () => {
    getFilesByAutoAlbum.mockImplementation(() => Promise.resolve([]))
    const clusterize = await albumsToClusterize(client, newPhotos, albums)

    const expected = new Map([
      [
        [albums[1], albums[0]],
        [newPhotos[1], newPhotos[2], newPhotos[3], newPhotos[4]]
      ],
      [[albums[2]], [newPhotos[0]]]
    ])
    expect(clusterize).toEqual(expected)
  })

  it('Should build the clusterize map with new and old photos', async () => {
    getFilesByAutoAlbum.mockImplementation((client, album) => {
      const files = existingPhotos.filter(p => p.clusterId === album.id)
      return Promise.resolve(files)
    })
    const clusterize = await albumsToClusterize(client, newPhotos, albums)

    const expected = new Map([
      [
        [albums[1], albums[0]],
        [
          existingPhotosPrepared[1],
          newPhotos[1],
          newPhotos[2],
          existingPhotosPrepared[2],
          newPhotos[3],
          existingPhotosPrepared[3],
          newPhotos[4]
        ]
      ],
      [[albums[2]], [existingPhotosPrepared[0], newPhotos[0]]]
    ])
    expect(clusterize).toEqual(expected)
  })
})

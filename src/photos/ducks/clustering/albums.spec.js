import CozyClient from 'cozy-client'
import { saveClustering } from './albums'
import doctypes from 'photos/targets/browser/doctypes'

const client = new CozyClient({ schema: doctypes })
client.save = jest.fn().mockImplementation((doctype, album) => {
  return { data: { _id: '1', _type: doctype, ...album } }
})
client.create = jest.fn().mockImplementation((doctype, album) => {
  return { data: { _id: '1', _type: doctype, ...album } }
})
client.mutate = jest.fn()

describe('album', () => {
  const photos = [
    {
      datetime: '2020-01-01',
      clusterId: 'fakeAlbumId1',
      id: '1'
    },
    {
      datetime: '2020-01-01',
      clusterId: 'fakeAlbumId1',
      id: '2'
    }
  ]
  it('should save clustering if no existing auto-album', async () => {
    const clusters = [photos]
    const clustered = await saveClustering(client, clusters)
    expect(clustered).toBe(photos.length)
  })

  it('should save clustering with existing auto-albums', async () => {
    const photos = [
      {
        datetime: '2020-01-02',
        clusterId: 'fakeAlbumId2',
        id: '3'
      },
      {
        datetime: '2020-01-03',
        clusterId: 'fakeAlbumId3',
        id: '4'
      }
    ]
    const clusters = [photos]
    const existingAlbums = [
      {
        _id: 'fakeAlbumId2',
        _type: 'io.cozy.photos.albums',
        name: '2020-01-02',
        period: {
          start: '2020-01-02',
          end: '2020-01-02'
        }
      },
      {
        _id: 'fakeAlbumId3',
        _type: 'io.cozy.photos.albums',
        name: '2020-01-03',
        period: {
          start: '2020-01-03',
          end: '2020-01-03'
        }
      }
    ]
    const hydratedAlbums = client.hydrateDocuments(
      'io.cozy.photos.albums',
      existingAlbums
    )
    const clustered = await saveClustering(client, clusters, hydratedAlbums)
    expect(clustered).toBe(photos.length)
  })
})

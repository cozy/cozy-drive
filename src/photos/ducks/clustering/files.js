import log from 'cozy-logger'
import { DOCTYPE_FILES, DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { Q } from 'cozy-client'

export const getFilesFromDate = async (client, date, { limit = 0 } = {}) => {
  log('info', `Get files from ${date}`)
  const query = Q(DOCTYPE_FILES)
    .where({
      class: 'image',
      'cozyMetadata.createdAt': { $gt: date }
    })
    .partialIndex({
      trashed: false
    })
    .indexFields(['class', 'cozyMetadata.createdAt'])
    .sortBy([{ class: 'asc' }, { 'cozyMetadata.createdAt': 'asc' }])
    .limitBy(limit)

  const result = await client.queryAll(query)
  return client.hydrateDocuments(DOCTYPE_FILES, result)
}

export const getAllPhotos = async client => {
  // This does not use pagination but is significantly faster as it queries
  // the _all_docs endpoint
  // Note this is only used once, for init
  const query = Q(DOCTYPE_FILES).limitBy(null)
  const results = await client.query(query)
  const files = results.data
  return files.filter(file => file.class === 'image' && !file.trashed)
}

export const getFilesByAutoAlbum = async (client, album) => {
  let allPhotos = []
  const query = Q(DOCTYPE_ALBUMS)
    .getById(album._id)
    .include(['photos'])
  const resp = await client.query(query)

  let data = client.hydrateDocument(resp.data)
  const photos = await data.photos.data
  allPhotos = allPhotos.concat(photos)
  while (data.photos.hasMore) {
    await data.photos.fetchMore()
    const fromState = client.getDocumentFromState(DOCTYPE_ALBUMS, album._id)
    data = client.hydrateDocument(fromState)
    allPhotos = await data.photos.data
  }
  return allPhotos
}

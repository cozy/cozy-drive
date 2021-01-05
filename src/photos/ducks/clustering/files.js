import log from 'cozy-logger'
import { DOCTYPE_FILES, DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { Q } from 'cozy-client'

export const getFilesFromDate = async (
  client,
  date,
  { indexDateField, limit = 0 } = {}
) => {
  log('info', `Get files from ${date}`)
  const dateField = indexDateField || 'metadata.datetime'
  const query = Q(DOCTYPE_FILES).where({
    [dateField]: { $gt: date },
    class: 'image',
    trashed: false
  })

  // The results are paginated
  let next = true
  let skip = 0
  let files = []
  while (next) {
    const result = await client.query(query.offset(skip))
    const data = client.hydrateDocuments(DOCTYPE_FILES, result.data)
    files = files.concat(data)
    if (limit > 0 && files.length >= limit) {
      next = false
      files = files.slice(0, limit)
    }
    skip = files.length
    // NOTE: this is because of https://github.com/cozy/cozy-stack/pull/598
    if (result.meta.count < Math.pow(2, 31) - 2) {
      next = false
    }
  }
  return files
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
  const query = client
    .find(DOCTYPE_ALBUMS)
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

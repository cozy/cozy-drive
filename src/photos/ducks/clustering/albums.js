import log from 'cozy-logger'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import uniq from 'lodash/uniq'
import { Q } from 'cozy-client'

// An auto album name is the date of the first photo
const albumName = photos => {
  return photos[0].datetime
}

// An auto album period starts with the first photo and ends with the last one
const albumPeriod = photos => {
  const startDate = photos[0].datetime
  const endDate =
    photos.length > 1 ? photos[photos.length - 1].datetime : startDate
  return { start: startDate, end: endDate }
}

const updateAlbumPeriod = async (client, photos, album) => {
  const period = albumPeriod(photos)
  if (period.start !== album.period.start || period.end !== album.period.end) {
    const name = photos[0].datetime
    const dehydrated = album.photos.dehydrate(album)
    const updatedAlbum = await client.save({ ...dehydrated, period, name })
    return client.hydrateDocument(updatedAlbum.data)
  }
  return album
}

//TODO: we should probably use addById from HasManyFiles. However, it causes
// unexpected relationships writes in the albums. So we skip it for now.
const addRefs = async (client, ids, album) => {
  ids = Array.isArray(ids) ? ids : [ids]
  const relations = ids.map(id => ({
    _id: id,
    _type: 'io.cozy.files'
  }))
  await client.mutate(album.photos.insertDocuments(relations))
}

//TODO: we should probably use removeById from HasManyFiles. However, it causes
// unexpected relationships writes in the albums. So we skip it for now.
const removeRefs = async (client, ids, album) => {
  ids = Array.isArray(ids) ? ids : [ids]
  const relations = ids.map(id => ({
    _id: id,
    _type: 'io.cozy.files'
  }))
  await client.mutate(album.photos.removeDocuments(relations))
}

const addAutoAlbumReferences = async (client, photos, album) => {
  let refCount = 0
  const refsIds = []
  for (const photo of photos) {
    if (photo.clusterId === album._id) {
      continue
    }
    if (photo.clusterId && photo.clusterId !== album._id) {
      // The photo references another album: remove it
      await removeRefs(client, photo.clusterId, album)
    }
    refsIds.push(photo.id)
  }
  if (refsIds.length > 0) {
    await addRefs(client, refsIds, album)
    log(
      'info',
      `${refsIds.length} photos clustered into: ${JSON.stringify(album._id)}`
    )
    refCount = refsIds.length
  } else {
    log('info', `Nothing to clusterize for ${album._id}`)
  }
  return refCount
}

const createAutoAlbum = async (client, photos) => {
  const name = albumName(photos)
  const period = albumPeriod(photos)
  const created_at = new Date()
  const album = { name, created_at, auto: true, period }
  const result = await client.create(DOCTYPE_ALBUMS, album)
  const autoAlbum = client.hydrateDocument(result.data)
  return autoAlbum
}

const removeAutoAlbums = async (client, albums) => {
  for (const album of albums) {
    await client.destroy(album)
  }
}

const removeAutoAlbumReferences = async (client, photos, album) => {
  const ids = []
  for (const photo of photos) {
    ids.push(photo.id)
    photo.clusterId = ''
  }
  await removeRefs(client, ids, album)
}

export const findAutoAlbums = async client => {
  const query = Q(DOCTYPE_ALBUMS)
    .where({
      auto: true
    })
    .sortBy([
      {
        name: 'desc'
      }
    ])
    .indexFields(['name'])
  const results = await client.queryAll(query)
  return client.hydrateDocuments(DOCTYPE_ALBUMS, results)
}

const createClusters = async (client, clusters) => {
  let refsCount = 0
  for (const photos of clusters) {
    const album = await createAutoAlbum(client, photos)
    refsCount += await addAutoAlbumReferences(client, photos, album)
  }
  return refsCount
}

/**
 * Save the clusters in database. Each cluster consists of a set of photos
 * that must be referenced-by the same auto-album.
 * The clusterAlbums are the existing auto-albums that must be either updated
 * or deleted.
 *
 * @param {Object[]} clusters - Set of cluster of photos
 * @param {Object[]} clusterAlbums - Set of existing auto-albums
 * @returns {number} Number of references updated in database
 *
 */
export const saveClustering = async (client, clusters, clusterAlbums = []) => {
  let refsCount = 0
  if (clusterAlbums.length > 0) {
    const processedAlbumsIds = []
    for (const photos of clusters) {
      // Find the clusterIds for this set of photos
      const clusterIds = uniq(
        photos.filter(p => p.clusterId).map(p => p.clusterId)
      )
      if (clusterIds.length === 0) {
        // No clusterId : create the new cluster
        const album = await createAutoAlbum(client, photos)
        refsCount += await addAutoAlbumReferences(client, photos, album)
      } else if (clusterIds.length === 1) {
        const album = clusterAlbums.find(album => album._id === clusterIds[0])
        if (processedAlbumsIds.includes(album._id)) {
          // Album already processed for another cluster: remove the refs and create a new album
          await removeAutoAlbumReferences(client, photos, album)
          const newAlbum = await createAutoAlbum(client, photos)
          refsCount += await addAutoAlbumReferences(client, photos, newAlbum)
        } else {
          // Album not processed elsewhere: add the refs and update the period
          refsCount += await addAutoAlbumReferences(client, photos, album)
          const idx = clusterAlbums.findIndex(
            album => album._id === clusterIds[0]
          )
          clusterAlbums[idx] = await updateAlbumPeriod(client, photos, album)
          processedAlbumsIds.push(album._id)
        }
      } else {
        // More than one album are referenced by the cluster: remove the refs and create a new album
        for (const photo of photos) {
          // Remove the refs
          if (photo.clusterId) {
            const album = clusterAlbums.find(
              album => album._id === photo.clusterId
            )
            await removeAutoAlbumReferences(client, [photo], album)
          }
        }
        // Create the album and add the refs
        const newAlbum = await createAutoAlbum(client, photos)
        refsCount += await addAutoAlbumReferences(client, photos, newAlbum)
      }
    }
    // Remove the "ghost" albums: they do not reference any files anymore
    const albumsToRemove = clusterAlbums.filter(
      album => !processedAlbumsIds.includes(album._id)
    )
    if (albumsToRemove.length > 0) {
      await removeAutoAlbums(client, albumsToRemove)
    }
  } else {
    // No album exist for these clusters: create them
    refsCount = await createClusters(client, clusters)
  }
  return refsCount
}

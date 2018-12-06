import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { matchingClusters } from './matching'
import { prepareDataset } from './utils'
import flatten from 'lodash/flatten'

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

const createReferences = async (photos, album) => {
  try {
    const ids = photos.map(p => p.id)
    await cozyClient.data.addReferencedFiles(album, ids)
    log(
      'info',
      `${photos.length} photos clustered into: ${JSON.stringify(album)}`
    )
  } catch (e) {
    log('error', e.reason)
  }
}

const getOrCreateAutoAlbum = async (photos, albums) => {
  // Check if an album already exists for these photos. If not, create it
  const name = albumName(photos)
  const album = albums ? albums.find(album => album.name === name) : null
  if (album) return album
  else {
    const created_at = new Date()
    const period = albumPeriod(photos)
    const album = { name, created_at, auto: true, period }
    return await cozyClient.data.create(DOCTYPE_ALBUMS, album)
  }
}

export const findAutoAlbums = async () => {
  const autoAlbums = await cozyClient.data.defineIndex(DOCTYPE_ALBUMS, [
    'auto',
    'name'
  ])
  const results = await cozyClient.data.query(autoAlbums, {
    selector: { auto: true },
    sort: [{ name: 'asc' }]
  })
  return results
}

export const saveClustering = async (clusters, albums) => {
  for (const photos of clusters) {
    if (photos && photos.length > 0) {
      const album = await getOrCreateAutoAlbum(photos, albums)
      await createReferences(photos, album)
    }
  }
}

const findPhotosByAlbum = async album => {
  try {
    album._type = DOCTYPE_ALBUMS
    const files = await cozyClient.data.fetchReferencedFiles(album, {})
    if (files && files.included) {
      const attributes = files.included.map(file => {
        const attributes = file.attributes
        attributes.id = file.id
        return attributes
      })
      return prepareDataset(attributes)
    }
  } catch (e) {
    log(
      'error',
      `Could not find photos to re-clusterize for ${JSON.stringify(album)}: ${
        e.reason
      }`
    )
    return []
  }
  return []
}

// Find existing photos for each album that need to be re-clusterize
const findPhotosToReclusterize = async albums => {
  const photos = flatten(
    await Promise.all(
      albums.map(async album => {
        return await findPhotosByAlbum(album)
      })
    )
  )
  return photos
}

/**
 *  Find the existing albums and related photos that are eligible to re-cluster,
 *  based on the new given photos.
 *  Each new photo should match at least one (maximum 2) existing album.
 *  We retrieve all the related photos for each matching album in order to
 *  recompute the cluster with the old and new photos.

 * @param {Object[]} newPhotos - Set of new photos to clusterize
 * @param {Object[]} albums - Set of existing auto albums
 * @returns {Object} dict associating albums to a set of photos.
 *
 */
export const albumsToClusterize = async (newPhotos, albums) => {
  const clusterize = {}

  for (const newPhoto of newPhotos) {
    // Find clusters matching this newPhoto
    const matchingAlbums = matchingClusters(newPhoto, albums)
    if (matchingAlbums.length > 0) {
      const key = matchingAlbums[1]
        ? matchingAlbums[0]._id + ':' + matchingAlbums[1]._id
        : matchingAlbums[0]._id
      if (clusterize[key]) {
        clusterize[key].push(newPhoto)
      } else {
        // Save the photos referenced by the matchig albums
        const photosToClusterize = await findPhotosToReclusterize(
          matchingAlbums
        )
        photosToClusterize.push(newPhoto)
        clusterize[key] = photosToClusterize
      }
    }
  }
  return clusterize
}

/**
 *  Find albums based on the ids
 */
export const findAlbumsByIds = (albums, ids) => {
  return (
    albums.filter(album => {
      return ids.find(id => album._id === id)
    }) || []
  )
}

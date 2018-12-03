import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { matchingClusters } from './matching'
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

const createAutoAlbum = async (photos, albums) => {
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
      const album = await createAutoAlbum(photos, albums)
      await createReferences(photos, album)
    }
  }
}

const findPhotosByAlbum = async album => {
  album._type = DOCTYPE_ALBUMS
  const files = await cozyClient.data.fetchReferencedFiles(album, {})
  if (files && files.included) {
    const attributes = files.included.map(file => {
      const attributes = file.attributes
      attributes.id = file.id
      return attributes
    })
    return extractPhotosInfo(attributes)
  }
  return []
}

const findPhotosToClusterize = async albums => {
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
  Look for existing auto albums to re-clusterize.
  There are 2 cases for this to occur:
    - A photo's datetime is inside an album period
    - A photo's datetime is in a gap between an album and an adjacent one.
*/
export const albumsToClusterize = async (photos, albums) => {
  const clusterize = {}

  for (const photo of photos) {
    // Find clusters matching this photo
    const matchingAlbums = matchingClusters(photo, albums)
    if (matchingAlbums.length > 0) {
      const key = matchingAlbums[1]
        ? matchingAlbums[0]._id + ':' + matchingAlbums[1]._id
        : matchingAlbums[0]._id
      if (clusterize[key]) {
        clusterize[key].push(photo)
      } else {
        // Save the photos referenced by the matchig albums
        const photosToClusterize = await findPhotosToClusterize(matchingAlbums)
        photosToClusterize.push(photo)
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

/**
 * Returns the photos metadata sorted by date
 */
export const extractPhotosInfo = photos => {
  const info = photos
    .map(file => {
      const photo = {
        id: file._id || file.id,
        name: file.name
      }
      if (file.metadata) {
        photo.datetime = file.metadata.datetime
        photo.gps = file.metadata.gps
      } else {
        photo.datetime = file.created_at
      }
      const hours = new Date(photo.datetime).getTime() / 1000 / 3600
      photo.timestamp = hours
      return photo
    })
    .sort((pa, pb) => pa.timestamp < pb.timestamp)

  return info
}

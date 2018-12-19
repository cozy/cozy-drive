import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { getMatchingClusters } from './matching'
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

const addAutoAlbumReferences = async (photos, album) => {
  try {
    // Create references only for not-clustered photos
    const ids = photos.filter(p => p.clusterId !== album._id).map(p => p.id)
    if (ids.length > 0) {
      await cozyClient.data.addReferencedFiles(album, ids)
      log(
        'info',
        `${ids.length} photos clustered into: ${JSON.stringify(album)}`
      )
    } else {
      log('info', `Nothing to clusterize for ${album._id}`)
    }
  } catch (e) {
    log('error', e.reason)
  }
}

const createAutoAlbum = async photos => {
  const name = albumName(photos)
  const period = albumPeriod(photos)
  const created_at = new Date()
  const album = { name, created_at, auto: true, period }
  return cozyClient.data.create(DOCTYPE_ALBUMS, album)
}

const removeAutoAlbums = async albums => {
  for (const album of albums) {
    await cozyClient.data.delete(DOCTYPE_ALBUMS, album)
  }
}

const removeAutoAlbumsReferences = async (photos, albums) => {
  for (const album of albums) {
    const ids = photos.map(p => {
      if (p.clusterId === album._id) {
        p.clusterId = ''
        return p.id
      }
    })
    await cozyClient.data.removeReferencedFiles(album, ids)
  }
}

export const findAutoAlbums = async () => {
  const autoAlbums = await cozyClient.data.defineIndex(DOCTYPE_ALBUMS, [
    'auto',
    'name'
  ])
  const results = await cozyClient.data.query(autoAlbums, {
    selector: { auto: true },
    sort: [{ name: 'desc' }]
  })
  return results
}

const createClusters = async clusters => {
  for (const photos of clusters) {
    const album = await createAutoAlbum(photos)
    await addAutoAlbumReferences(photos, album)
  }
}

const removeClusters = async (clusters, albumsToSave) => {
  for (const photos of clusters) {
    await removeAutoAlbumsReferences(photos, albumsToSave)
  }
  await removeAutoAlbums(albumsToSave)
}

export const saveClustering = async (clusters, albumsToSave) => {
  if (albumsToSave && albumsToSave.length > 0) {
    if (clusters.length === albumsToSave.length) {
      // The clustering structure has not changed: only new photos to add
      await Promise.all(
        clusters.map((photos, index) => {
          return addAutoAlbumReferences(photos, albumsToSave[index])
        })
      )
    } else {
      // The clustering structure has changed: remove the impacted clusters
      // and create the new ones
      await removeClusters(clusters, albumsToSave)
      await createClusters(clusters, albumsToSave)
    }
  } else {
    // No cluster exist yet: create them
    await createClusters(clusters)
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
        attributes.clusterId = album._id
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

const photoExistsInCollection = (photos, photo) => {
  return photos.find(p => p.id === photo.id)
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
    const matchingAlbums = getMatchingClusters(newPhoto, albums)
    if (matchingAlbums.length > 0) {
      const key = matchingAlbums[1]
        ? matchingAlbums[0]._id + ':' + matchingAlbums[1]._id
        : matchingAlbums[0]._id
      if (key in clusterize) {
        if (!photoExistsInCollection(clusterize[key], newPhoto)) {
          clusterize[key].push(newPhoto)
        }
      } else {
        // Save the photos referenced by the matching albums
        const photosToClusterize = await findPhotosToReclusterize(
          matchingAlbums
        )
        if (!photoExistsInCollection(photosToClusterize, newPhoto)) {
          photosToClusterize.push(newPhoto)
        }
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

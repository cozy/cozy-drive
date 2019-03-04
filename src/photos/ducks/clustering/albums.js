import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { getMatchingClusters } from './matching'
import { prepareDataset } from './utils'
import { flatten } from 'lodash/flatten'
import { union } from 'lodash/union'
import { intersection } from 'lodash/intersection'
import { difference } from 'lodash/difference'

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
  let refCount = 0
  try {
    // Create references only for not-clustered photos
    const ids = photos.filter(p => p.clusterId !== album._id).map(p => p.id)
    if (ids.length > 0) {
      await cozyClient.data.addReferencedFiles(album, ids)
      log(
        'info',
        `${ids.length} photos clustered into: ${JSON.stringify(album)}`
      )
      refCount = ids.length
    } else {
      log('info', `Nothing to clusterize for ${album._id}`)
    }
  } catch (e) {
    log('error', e.reason)
  }
  return refCount
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
  let refsCount = 0
  for (const album of albums) {
    const ids = photos.filter(p => p.clusterId === album._id).map(p => {
      p.clusterId = ''
      return p.id
    })
    if (ids.length > 0) {
      await cozyClient.data.removeReferencedFiles(album, ids)
      refsCount += ids.length
    }
  }
  return refsCount
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
  let refsCount = 0
  for (const photos of clusters) {
    const album = await createAutoAlbum(photos)
    refsCount += await addAutoAlbumReferences(photos, album)
  }
  return refsCount
}

const removeClusters = async (clusters, albumsToSave) => {
  let refsCount = 0
  for (const photos of clusters) {
    refsCount += await removeAutoAlbumsReferences(photos, albumsToSave)
  }
  await removeAutoAlbums(albumsToSave)
  return refsCount
}

export const saveClustering = async (clusters, albumsToSave) => {
  let refsCount = 0
  if (albumsToSave && albumsToSave.length > 0) {
    if (albumsToSave.length > 1 || clusters.length > 1) {
      // The clustering structure has changed: remove the impacted clusters
      // and create the new ones
      const refsRemoved = await removeClusters(clusters, albumsToSave)
      const refsAdded = await createClusters(clusters, albumsToSave)
      refsCount = refsCount + refsAdded - refsRemoved
    } else {
      // The clustering structure has not changed: only new photos to add
      refsCount = flatten(
        await Promise.all(
          clusters.map((photos, index) => {
            return addAutoAlbumReferences(photos, albumsToSave[index])
          })
        )
      ).reduce((acc, val) => acc + val, 0)
    }
  } else {
    // No cluster exist yet: create them
    refsCount = await createClusters(clusters)
  }
  return refsCount
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
  ).sort((a, b) => a.timestamp - b.timestamp)
  return photos
}

// Insert the new photo into the sorted photos set
const insertNewPhoto = (photos, newPhoto) => {
  const photoAlreadyExists = photos.find(p => p.id === newPhoto.id)
  if (photoAlreadyExists) {
    return photos
  } else {
    photos.push(newPhoto)
    return photos.sort((a, b) => a.timestamp - b.timestamp)
  }
}

/**
 *  Find the existing albums and related photos that are eligible to re-cluster,
 *  based on the new given photos.
 *  Each new photo should match at least one (maximum 2) existing album.
 *  We retrieve all the related photos for each matching album in order to
 *  recompute the cluster with the old and new photos.

 * @param {Object[]} newPhotos - Set of new photos to clusterize
 * @param {Object[]} albums - Set of existing auto albums
 * @returns {Map} Map associating a set of albums to a set of photos.
 *
 */
export const albumsToClusterize = async (newPhotos, albums) => {
  const clusterize = new Map()
  try {
    for (const newPhoto of newPhotos) {
      // Find clusters matching the photo
      const matchingAlbums = getMatchingClusters(newPhoto, albums)
      if (matchingAlbums.length > 0) {
        let clusterAlbumsExist = false

        for (const clusterAlbums of clusterize.keys()) {
          if (difference(matchingAlbums, clusterAlbums).length < 1) {
            // The matchingAlbums are included in the key: add the photo
            clusterize.set(
              clusterAlbums,
              insertNewPhoto(clusterize.get(clusterAlbums), newPhoto)
            )
            clusterAlbumsExist = true
            break
          } else if (intersection(matchingAlbums, clusterAlbums).length > 1) {
            // The matchingAlbums partially exist into the key: merge it
            const mergedKey = union(clusterAlbums, matchingAlbums)
            let mergedValues = clusterize.get(clusterAlbums)
            const missingAlbums = difference(matchingAlbums, clusterAlbums)

            for (const album of missingAlbums) {
              if (clusterize.has(album)) {
                // Album exists as a key in the Map: remove it from the Map and
                // save its photos
                mergedValues = mergedValues.concat(clusterize.get(album))
                clusterize.delete(album)
              } else {
                // Album does not exist in the Map: add it with its photos
                const photosToClusterize = await findPhotosToReclusterize([
                  album
                ])
                mergedValues = mergedValues.concat(photosToClusterize)
              }
            }
            mergedValues.push(newPhoto)
            // resort values
            const sortedMergedValues = mergedValues.sort(
              (a, b) => a.timestamp - b.timestamp
            )
            // Add the new entry and delete the previous one
            clusterize.set(mergedKey, sortedMergedValues)
            clusterize.delete(clusterAlbums)
            clusterAlbumsExist = true
            break
          }
        }
        if (!clusterAlbumsExist) {
          // The matching albums don't exist in the Map: add them with their photos
          const photosToClusterize = await findPhotosToReclusterize(
            matchingAlbums
          )
          clusterize.set(
            matchingAlbums,
            insertNewPhoto(photosToClusterize, newPhoto)
          )
        }
      }
    }
  } catch (e) {
    log(
      'error',
      `An error occured during the build of clusterize: ${JSON.stringify(e)}`
    )
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

import union from 'lodash/union'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import { getMatchingClusters } from './matching'
import { getFilesByAutoAlbum } from './files'
import { prepareDataset } from './utils'
import flatten from 'lodash/flatten'
import log from 'cozy-logger'

jest.mock('cozy-logger')

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

const findPhotosToReclusterize = async (client, albums) => {
  log('info', 'Find new photos to reclusterize...')

  const photos = flatten(
    await Promise.all(
      albums.map(async album => {
        const files = await getFilesByAutoAlbum(client, album)
        return prepareDataset(files, [album])
      })
    )
  ).sort((a, b) => a.timestamp - b.timestamp)
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
 * @returns {Map} Map associating a set of albums to a set of photos.
 *
 */
export const albumsToClusterize = async (client, newPhotos, albums) => {
  const clusterize = new Map()
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
        } else if (intersection(matchingAlbums, clusterAlbums).length > 0) {
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
              const photosToClusterize = await findPhotosToReclusterize(
                client,
                [album]
              )
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
          client,
          matchingAlbums
        )
        clusterize.set(
          matchingAlbums,
          insertNewPhoto(photosToClusterize, newPhoto)
        )
      }
    }
  }
  return clusterize
}

import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { getMatchingClusters } from './matching'
import { getFilesByAutoAlbum } from './files'
import { prepareDataset } from './utils'
import { flatten, union, intersection, difference, uniq } from 'lodash'

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

const updateAlbumPeriod = async (newPhotos, albumToUpdate) => {
  //TODO: is it necessary to avoid conflict ?
  // TODO: don't request album
  const album = await cozyClient.data.find(DOCTYPE_ALBUMS, albumToUpdate._id)
  /*const startDate =
    newPhotos[0].datetime < album.period.start
      ? newPhotos[0].datetime
      : album.period.start
  console.debug('start : ', startDate)
  const endDate =
    newPhotos[newPhotos.length - 1].datetime > album.period.end
      ? newPhotos[newPhotos.length - 1].datetime
      : album.period.end
  console.debug('end : ', endDate)*/
  const newPeriod = {
    start:
      newPhotos[0].datetime < album.period.start
        ? newPhotos[0].datetime
        : album.period.start,
    end:
      newPhotos[newPhotos.length - 1].datetime > album.period.end
        ? newPhotos[newPhotos.length - 1].datetime
        : album.period.end
  }
  if (
    newPeriod.start !== album.period.start ||
    newPeriod.end !== album.period.end
  ) {
    const newAlbum = { ...album, period: newPeriod }
    /*console.debug('new period update : ', newPeriod)
    console.debug('before : ', album.period)*/
    console.debug('go update album ', albumToUpdate._id)
    return cozyClient.data.update(DOCTYPE_ALBUMS, album, newAlbum)
  }
  return album
}

const addAutoAlbumReferences = async (photos, album) => {
  let refCount = 0
  try {
    // Create references only for not-clustered photos
    /*  for (const photo of photos) {
      if (!photo.clusterId) {
        photo.clusterId = await findMissingClusterId(photo, album)
      }
    }*/
    //const ids = photos.filter(p => p.clusterId !== album._id).map(p => p.id)
    const ids = []
    for (const photo of photos) {
      //const albumId = photo.clusterId ? photo.clusterId : await getAlbumsByFileId(photo.id)
      const albumId = photo.clusterId
      if (!albumId) {
        ids.push(photo.id)
      } else if (albumId !== album._id) {
        console.debug('find album ', albumId, ' because of ', photo.id)
        try {
          const refAlbum = await cozyClient.data.find(DOCTYPE_ALBUMS, albumId)
          await cozyClient.data.removeReferencedFiles(refAlbum, photo.id)
        } catch (e) {
          console.debug('error : ', e)
          console.debug('status : ', e.reason.status)
        } finally {
          ids.push(photo.id)
        }
        //  console.debug('remove ref album')
        //process.exit(0)
        //  console.debug('REMOVED REF')
      }
    }
    if (ids.length > 0) {
      await cozyClient.data.addReferencedFiles(album, ids)
      log(
        'info',
        `${ids.length} photos clustered into: ${JSON.stringify(album._id)}`
      )
      //console.debug('files clustered : ', ids)
      refCount = ids.length
      await updateAlbumPeriod(photos, album)
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
    // TODO: don't request album
    const toDelete = await cozyClient.data.find(DOCTYPE_ALBUMS, album._id)
    await cozyClient.data.delete(DOCTYPE_ALBUMS, toDelete)
  }
}

const removeAutoAlbumReferences = async (photos, album) => {
  const res = await cozyClient.data.removeReferencedFiles(
    album,
    photos.map(p => p.id)
  )
  for (const photo of photos) {
    photo.clusterId = album._id
  }
  console.debug('res remove : ', res)
}

/*
const removeAutoAlbumsReferences = async (clusters, albums) => {
  let refsCount = 0
  for (const album of albums) {
    //WARNING should be useless
    const files = await getFilesByAutoAlbum(album)
    const ids = files.map(file => file.id)

    if (ids.length > 0) {
      await cozyClient.data.removeReferencedFiles(album, ids)
      const idInCluster = []
      clusters.map(photos => {
        photos.map(photo => {
          if (ids.includes(photo.id)) {
            photo.clusterId = ''
            idInCluster.push(true)
          }
        })
      })
      //TEMPORARY
      if (idInCluster.length != ids.length) {
        console.debug('IDS MISSING : ', ids.length - idInCluster.length)
        process.exit(0)
      }
      refsCount += ids.length
    } else {
      console.debug('no photo found....')
      process.exit(0)
    }
  }
  return refsCount
}*/

export const findAutoAlbums = async () => {
  const autoAlbums = await cozyClient.data.defineIndex(DOCTYPE_ALBUMS, [
    'auto',
    'name'
  ])
  const results = await cozyClient.data.query(autoAlbums, {
    selector: { auto: true },
    sort: [{ name: 'desc' }]
  })
  //WARNING
  if (results.length > 99) {
    console.debug('LENGTH ALBUMS')
    process.exit(0)
  }
  const names = results.map(res => res.name)
  if (uniq(names).length != results.length) {
    console.debug('ALRRT : ', uniq(names).length)
    console.debug('results : ', results.length)
    process.exit(0)
  }
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
/*
const removeClusters = async (clusters, albumsToSave) => {
  let refsCount = 0
  //refsCount += await removeAutoAlbumsReferences(clusters, albumsToSave)
  for (const photos of clusters) {
    for(const photo of photos) {
      photo.clusterId = ''
    }
  }
  await removeAutoAlbums(albumsToSave)
  return refsCount
}*/
/*
const shouldRecreate = (clusters, albums) => {
  if (clusters.length !== albums.length) {
    return true
  } else if (clusters.length === 1 && albums.length === 1) {
    return false
  }

  // A cluster with more than one unique clusterId must be recreated
  //console.debug('check uniqueness for cluster')
  for (const photos of clusters) {
    const photosWithClusterId = photos
      .filter(photo => {
        return photo.clusterId
      })
      .map(photo => photo.clusterId)

    if (uniq(photosWithClusterId).length !== 1) {
      return true
    }
  }
  //console.debug('should recreate ? ', recreate)
  return false
}*/

const findAlbumInCluster = (photos, albums) => {
  const photoWithClusterId = photos.filter(photo => photo.clusterId)
  if (photoWithClusterId && photoWithClusterId.length > 0) {
    return albums.find(album => album._id === photoWithClusterId[0].clusterId)
  }
  return
}

export const saveClustering = async (clusters, albumsToSave) => {
  let refsCount = 0
  if (albumsToSave && albumsToSave.length > 0) {
    const processedAlbumsIds = []
    for (const photos of clusters) {
      const clustersId = photos.filter(p => p.clusterId).map(p => p.clusterId)
      const uniqClustersId = uniq(clustersId)
      if (uniqClustersId.length === 0) {
        // No clusterid : create the new cluster
        const album = await createAutoAlbum(photos)
        refsCount += await addAutoAlbumReferences(photos, album)
      } else if (uniqClustersId.length === 1) {
        //TODO WARNING que se passe t'il si on a un cluster [p1,p2,p3] et qu'on ajoute
        // p4 avec p2 < p4 < p3 produisant un clustering C1 = [p1,p2, p4] et C2= [p3] ?
        // C1 et C2 vont entrer dans le cas clustersId.length === 1 et C2 n'existera pas.
        // => il faut probablement maintenir la liste des albums et add/delete

        // Unique clusterid : add the refs for this album

        const album = findAlbumInCluster(photos, albumsToSave)
        if (processedAlbumsIds.includes(album._id)) {
          // Album already processed: remove the refs and create new album
          await removeAutoAlbumReferences(photos, album)
          album.toRemove = true
          const newAlbum = await createAutoAlbum(photos)
          refsCount += await addAutoAlbumReferences(photos, newAlbum)
        } else {
          refsCount += await addAutoAlbumReferences(photos, album)
          processedAlbumsIds.push(album._id)
        }
      } else {
        // More than one album: remove them and create a new one

        // First, remove the refs
        for (const photo of photos) {
          if (photo.clusterId) {
            const album = albumsToSave.find(
              album => album._id === photo.clusterId
            )
            await cozyClient.data.removeReferencedFiles(album, [photo.id])
            album.toRemove = true
          }
        }
        //Next, create the album
        const newAlbum = await createAutoAlbum(photos)
        refsCount += await addAutoAlbumReferences(photos, newAlbum)
      }
    }
    // Remove the albums at the end
    const albumsToRemove = albumsToSave.filter(
      album => album.toRemove && !processedAlbumsIds.includes(album._id)
    )
    if (albumsToRemove.length > 0) {
      await removeAutoAlbums(albumsToRemove)
    }
  } else {
    // No cluster exist yet: create them
    refsCount = await createClusters(clusters)
  }
  return refsCount
}

const findPhotosByAlbum = async album => {
  try {
    //album._type = DOCTYPE_ALBUMS
    const files = await getFilesByAutoAlbum(album)
    //console.debug('files found for album ', album._id, ' : ', files.length)

    /*const files = await cozyClient.data.fetchReferencedFiles(album, {})
    if (files && files.included) {
      const attributes = files.included.map(file => {
        const attributes = file.attributes
        attributes.id = file.id
        attributes.clusterId = album._id
        return attributes
      })*/
    return prepareDataset(files)
  } catch (e) {
    log(
      'error',
      `Could not find photos to re-clusterize for ${JSON.stringify(
        album
      )}: ${JSON.stringify(e)}`
    )
    return []
  }
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
        let keyExists = false

        for (const key of clusterize.keys()) {
          if (difference(matchingAlbums, key).length < 1) {
            // The matchingAlbums are included in the key: add the photo
            clusterize.set(key, insertNewPhoto(clusterize.get(key), newPhoto))
            keyExists = true
            break
          } else if (intersection(matchingAlbums, key).length > 1) {
            // The matchingAlbums partially exist into the key: merge it
            const mergedKey = union(key, matchingAlbums)
            let mergedValues = clusterize.get(key)
            const missingAlbums = difference(matchingAlbums, key)

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
            clusterize.delete(key)
            keyExists = true
            break
          }
        }
        if (!keyExists) {
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

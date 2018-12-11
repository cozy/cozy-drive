import { log, cozyClient } from 'cozy-konnector-libs'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import {
  readSetting,
  findLastDefaultParameters,
  createSetting,
  defaultSetting,
  findPhotosDefaultParameters
} from 'photos/ducks/clustering/settings'
import {
  computeEpsTemporal,
  computeEpsSpatial,
  reachabilities
} from 'photos/ducks/clustering/service'
import {
  PERCENTILE,
  DEFAULT_MODE,
  EVALUATION_THRESHOLD
} from 'photos/ducks/clustering/consts'
import { spatioTemporalScaled } from 'photos/ducks/clustering/metrics'
import { gradientClustering } from 'photos/ducks/clustering/gradient'
import {
  saveClustering,
  findAutoAlbums,
  albumsToClusterize,
  findAlbumsByIds
} from 'photos/ducks/clustering/albums'
import { prepareDataset } from 'photos/ducks/clustering/utils'

// Compute the actual clustering based on the new dataset and the existing albums
const createNewClusters = async (setting, dataset, albums) => {
  const clusterize = await albumsToClusterize(dataset, albums)
  if (clusterize) {
    for (const [id, photos] of Object.entries(clusterize)) {
      const params = findPhotosDefaultParameters(setting, photos)
      if (!params) {
        log('warn', 'No parameters for clustering found')
        break
      }
      const reachs = reachabilities(photos, spatioTemporalScaled, params)
      const clusters = gradientClustering(photos, reachs, params)
      if (clusters.length > 0) {
        const ids = id.split(':')
        const albumsToSave = findAlbumsByIds(albums, ids)
        await saveClustering(clusters, albumsToSave)
      }
    }
  }
}

const createInitialClusters = async (setting, dataset) => {
  const params = findLastDefaultParameters(setting)
  if (!params) {
    log('warn', 'No parameters for clustering found')
    return
  }
  const reachs = reachabilities(dataset, spatioTemporalScaled, params)
  const clusters = gradientClustering(dataset, reachs, params)
  await saveClustering(clusters)
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (setting, dataset) => {
  log('info', `Start clustering on ${dataset.length} photos`)

  const albums = await findAutoAlbums()
  if (albums && albums.length > 0) {
    await createNewClusters(setting, dataset, albums)
  } else {
    // No album found: this is an initialization
    await createInitialClusters(setting, dataset)
  }
  // TODO update params
  // TODO adapt percentiles for large datasets
  // TODO ensure auto albums unicity
}

const getNewPhotos = async lastSeq => {
  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )
  return result.results.map(res => res.doc).filter(doc => {
    return doc.class === 'image' && !doc._id.includes('_design') && !doc.trashed
  })
}

const initParameters = dataset => {
  log('info', `Compute clustering parameters on ${dataset.length} photos`)
  const epsTemporal = computeEpsTemporal(dataset, PERCENTILE)
  const epsSpatial = computeEpsSpatial(dataset, PERCENTILE)
  const params = {
    period: {
      start: dataset[0].datetime,
      end: dataset[dataset.length - 1].datetime
    },
    modes: [
      {
        name: DEFAULT_MODE,
        epsTemporal: epsTemporal,
        epsSpatial: epsSpatial
      }
    ]
  }
  return params
}

const onPhotoUpload = async () => {
  let setting = await readSetting()
  if (!setting) {
    // No settings found: init them or use default
    const photos = await getNewPhotos(0)
    if (photos.length < 1) {
      log('warn', 'Service called but no photos found to clusterize')
      return
    }
    const dataset = prepareDataset(photos)
    if (dataset.length > EVALUATION_THRESHOLD) {
      // There are enough photos to init the parameters and save them
      const params = initParameters(dataset)
      setting = await createSetting(params)
    } else {
      // Use default
      setting = defaultSetting(dataset)
    }
    await clusterizePhotos(setting, dataset)
  } else {
    const photos = await getNewPhotos(setting.lastSeq)
    if (photos.length < 1) {
      log('warn', 'Service called but no photos found to clusterize')
      return
    }
    const dataset = prepareDataset(photos)
    await clusterizePhotos(setting, dataset)
  }
}

onPhotoUpload()

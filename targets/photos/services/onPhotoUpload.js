import { log, cozyClient } from 'cozy-konnector-libs'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import {
  readSetting,
  defaultParameters,
  createDefaultSetting
} from 'photos/ducks/clustering/settings'
import {
  computeEpsTemporal,
  computeEpsSpatial,
  reachabilities
} from 'photos/ducks/clustering/service'
import {
  PERCENTILE,
  DEFAULT_MAX_BOUND,
  COARSE_COEFFICIENT
} from 'photos/ducks/clustering/consts'
import { spatioTemporalScaled } from 'photos/ducks/clustering/metrics'
import {
  gradientClustering,
  gradientAngle
} from 'photos/ducks/clustering/gradient'
import {
  saveClustering,
  findAutoAlbums,
  albumsToClusterize,
  findAlbumsByIds
} from 'photos/ducks/clustering/albums'
import { prepareDataset } from 'photos/ducks/clustering/utils'

// Retrieve the parameters used to compute the clustering
const clusteringParameters = (dataset, setting) => {
  const params = defaultParameters(setting)
  if (!params) {
    return null
  }
  if (!params.epsTemporal) {
    params.epsTemporal = computeEpsTemporal(dataset, PERCENTILE)
  }
  if (!params.epsSpatial) {
    params.epsSpatial = computeEpsSpatial(dataset, PERCENTILE)
  }
  const epsMax = Math.max(params.epsTemporal, params.epsSpatial)
  if (!params.maxBound) {
    params.maxBound =
      epsMax * 2 < DEFAULT_MAX_BOUND ? epsMax * 2 : DEFAULT_MAX_BOUND
  }
  if (!params.cosAngle) {
    params.cosAngle = gradientAngle(epsMax, COARSE_COEFFICIENT)
  }
  return params
}

// Compute the actual clustering based on the new dataset and the existing albums
const computeClusters = async (dataset, albums, params) => {
  if (albums && albums.length > 0) {
    const clusterize = await albumsToClusterize(dataset, albums)
    if (clusterize) {
      for (const [id, photos] of Object.entries(clusterize)) {
        // TODO adapt params to the period
        const reachs = reachabilities(photos, spatioTemporalScaled, params)
        const clusters = gradientClustering(photos, reachs, params)
        if (clusters.length > 0) {
          const ids = id.split(':')
          const albumsToSave = findAlbumsByIds(albums, ids)
          saveClustering(clusters, albumsToSave)
        }
      }
    }
  } else {
    // No album found: this is an initialization
    const reachs = reachabilities(dataset, spatioTemporalScaled, params)
    const clusters = gradientClustering(dataset, reachs, params)
    saveClustering(clusters)
  }
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (setting, photos) => {
  const dataset = prepareDataset(photos)
  const params = clusteringParameters(dataset, setting)
  if (!params) {
    log('warn', 'No default parameters for clustering found')
    return
  }

  const albums = await findAutoAlbums()
  await computeClusters(dataset, albums, params)

  // TODO save params
  // TODO adapt percentiles for large datasets
}

const getNewPhotos = async setting => {
  const lastSeq = setting.lastSeq

  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )

  return result.results.map(res => res.doc).filter(doc => {
    return doc.class === 'image' && !doc._id.includes('_design') && !doc.trashed
  })
}

const onPhotoUpload = async () => {
  let setting = await readSetting()
  if (!setting) {
    setting = await createDefaultSetting()
  }
  const photos = await getNewPhotos(setting)
  if (photos.length > 0) {
    log('info', `Start clustering on ${photos.length} photos`)

    clusterizePhotos(setting, photos)
  }
}

onPhotoUpload()

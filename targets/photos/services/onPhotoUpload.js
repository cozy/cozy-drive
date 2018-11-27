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
import { saveClustering } from 'photos/ducks/clustering/albums'

// Returns the photos metadata sorted by date
const extractInfo = photos => {
  const info = photos
    .map(file => {
      const photo = {
        id: file._id,
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
    .sort((pa, pb) => pa.timestamp - pb.timestamp)

  return info
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (setting, photos) => {
  const dataset = extractInfo(photos)
  const params = defaultParameters(setting)
  if (!params) {
    log('warn', 'No default parameters for clustering found')
    return []
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

  const reachs = reachabilities(dataset, spatioTemporalScaled, params)
  const clusters = gradientClustering(dataset, reachs, params)
  if (clusters.length > 0) {
    saveClustering(clusters)
  }

  // TODO save params
  // TODO adapt percentiles for large datasets

  return dataset
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

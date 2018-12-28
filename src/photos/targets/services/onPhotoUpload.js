import { log, cozyClient } from 'cozy-konnector-libs'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import {
  readSetting,
  createSetting,
  updateSetting,
  getDefaultParameters,
  updateSettingStatus,
  getDefaultParametersMode,
  updateParamsPeriod
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
import { getMatchingParameters } from 'photos/ducks/clustering/matching'

// Compute the actual clustering based on the new dataset and the existing albums
const createNewClusters = async (params, key, dataset, albums) => {
  const reachs = reachabilities(dataset, spatioTemporalScaled, params)
  const clusters = gradientClustering(dataset, reachs, params)
  if (clusters.length > 0) {
    const ids = key.split(':')
    const albumsToSave = findAlbumsByIds(albums, ids)
    return saveClustering(clusters, albumsToSave)
  }
  return 0
}

// Compute the inital clustering
const createInitialClusters = async (paramsMode, dataset) => {
  const reachs = reachabilities(dataset, spatioTemporalScaled, paramsMode)
  const clusters = gradientClustering(dataset, reachs, paramsMode)
  return saveClustering(clusters)
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (setting, dataset) => {
  log('info', `Start clustering on ${dataset.length} photos`)

  let clusteredCount = 0
  try {
    const albums = await findAutoAlbums()

    if (albums && albums.length > 0) {
      // Get photos to clusterize based on the existing clusters
      const clusterize = await albumsToClusterize(dataset, albums)
      if (clusterize) {
        for (const [key, photos] of Object.entries(clusterize)) {
          // Retrieve the relevant parameters to compute this cluster
          const params = getMatchingParameters(setting.parameters, photos)
          const paramsMode = getDefaultParametersMode(params)
          if (!paramsMode) {
            log('warn', 'No parameters for clustering found')
            continue
          }
          // Actual clustering
          clusteredCount += await createNewClusters(
            paramsMode,
            key,
            photos,
            albums
          )
          setting = await updateParamsPeriod(setting, params, dataset)
        }
      }
    } else {
      // No album found: this is an initialization
      const params = setting.parameters[setting.parameters.length - 1]
      const paramsMode = getDefaultParametersMode(params)
      if (!paramsMode) {
        log('warn', 'No parameters for clustering found')
        return
      }
      clusteredCount = await createInitialClusters(paramsMode, dataset)
      setting = await updateParamsPeriod(setting, params, dataset)
    }
  } catch (e) {
    log('error', `An error occured during the clustering: ${JSON.stringify(e)}`)
  }
  return { setting, clusteredCount }
  // TODO adapt percentiles for large datasets
}

const getChanges = async lastSeq => {
  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )
  const photos = result.results.map(res => res.doc).filter(doc => {
    return doc.class === 'image' && !doc._id.includes('_design') && !doc.trashed
  })
  const newLastSeq = result.last_seq
  return { photos, newLastSeq }
}

const getFilesFromDate = async date => {
  // Note a file without a metadata.datetime would not be indexed: this is not
  // a big deal as this is only to compute parameters
  const filesIndex = await cozyClient.data.defineIndex(DOCTYPE_FILES, [
    'metadata.datetime',
    'class',
    'trashed'
  ])
  const selector = {
    'metadata.datetime': { $gt: date },
    class: 'image',
    trashed: false
  }
  return cozyClient.data.query(filesIndex, {
    selector: selector
  })
}

const createParameter = (dataset, epsTemporal, epsSpatial) => {
  return {
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
}
const initParameters = dataset => {
  log('info', `Compute clustering parameters on ${dataset.length} photos`)
  const epsTemporal = computeEpsTemporal(dataset, PERCENTILE)
  const epsSpatial = computeEpsSpatial(dataset, PERCENTILE)
  return createParameter(dataset, epsTemporal, epsSpatial)
}

const recomputeParameters = async setting => {
  const lastParams = setting.parameters[setting.parameters.length - 1]
  // The defaultEvaluation field is used at init if there are not enough files
  // for a proper parameters evaluation: we use default metrics and therefore,
  // this end period should not be taken into consideration.
  const lastPeriodEnd = lastParams.defaultEvaluation
    ? lastParams.period.start
    : lastParams.period.end

  const files = await getFilesFromDate(lastPeriodEnd)

  // Safety check
  if (files.length < EVALUATION_THRESHOLD) {
    return
  }
  log('info', `Compute clustering parameters on ${files.length} photos`)

  const dataset = prepareDataset(files)
  const epsTemporal = computeEpsTemporal(dataset, PERCENTILE)
  const epsSpatial = computeEpsSpatial(dataset, PERCENTILE)
  return createParameter(dataset, epsTemporal, epsSpatial)
}

const onPhotoUpload = async () => {
  let setting = await readSetting()
  const lastSeq = setting ? setting.lastSeq : 0

  const changes = await getChanges(lastSeq)
  if (!changes || changes.photos.length < 1) {
    log('warn', 'Service called but no photos found to clusterize')
    return
  }
  const dataset = prepareDataset(changes.photos)

  if (!setting) {
    // No settings found: init them or use default
    const params =
      dataset.length > EVALUATION_THRESHOLD
        ? initParameters(dataset)
        : getDefaultParameters(dataset)
    setting = await createSetting(params)
  } else {
    if (setting.evaluationCount > EVALUATION_THRESHOLD) {
      const newParams = await recomputeParameters(setting)
      if (newParams) {
        const params = [...setting.parameters, newParams]
        const newSetting = {
          ...setting,
          parameters: params,
          evaluationCount: 0
        }
        setting = await updateSetting(setting, newSetting)
      }
    }
  }

  const result = await clusterizePhotos(setting, dataset)
  if (!result.setting) {
    return
  }
  /*
    WARNING: we save the lastSeq retrieved at the beginning of the clustering.
    However, we might have produced new _changes on files by saving the
    referenced-by, so they will computed again at the next clustering.
    We cannot save the new lastSeq, as new files might have been uploaded by
    this time and would be ignored for the next clustering.
    This is unpleasant, but harmless, as no new writes will be produced on the
    already clustered files.
   */
  await updateSettingStatus(result.setting, result.clusteredCount, changes)
}

onPhotoUpload()

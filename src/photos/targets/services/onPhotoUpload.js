import { cozyClient, log } from 'cozy-konnector-libs'
import { getAllPhotos, getFilesFromDate } from 'photos/ducks/clustering/files'
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
  EVALUATION_THRESHOLD,
  CHANGES_RUN_LIMIT
} from 'photos/ducks/clustering/consts'
import { spatioTemporalScaled } from 'photos/ducks/clustering/metrics'
import { gradientClustering } from 'photos/ducks/clustering/gradient'
import { saveClustering, findAutoAlbums } from 'photos/ducks/clustering/albums'
import { albumsToClusterize } from 'photos/ducks/clustering/reclusterize'
import { prepareDataset } from 'photos/ducks/clustering/utils'
import { getMatchingParameters } from 'photos/ducks/clustering/matching'

// Compute the actual clustering based on the new dataset and the existing albums
const createNewClusters = async (params, clusterAlbums, dataset) => {
  const reachs = reachabilities(dataset, spatioTemporalScaled, params)
  const clusters = gradientClustering(dataset, reachs, params)
  if (clusters.length > 0) {
    return saveClustering(clusters, clusterAlbums)
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
const clusterizePhotos = async (setting, dataset, albums) => {
  log('info', `Start clustering on ${dataset.length} photos`)

  let clusteredCount = 0
  try {
    if (albums && albums.length > 0) {
      // Build the clusterize Map, based on the dataset and existing photos
      const clusterize = await albumsToClusterize(dataset, albums)
      if (clusterize) {
        for (const [clusterAlbums, photos] of clusterize.entries()) {
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
            clusterAlbums,
            photos
          )
          setting = await updateParamsPeriod(setting, params, dataset)
        }
      } else {
        return
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
    return
  }
  return { setting, clusteredCount }
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

const runClustering = async setting => {
  const sinceDate = setting.lastDate ? setting.lastDate : 0
  const photos = await getFilesFromDate(sinceDate, {
    indexDateField: 'created_at',
    limit: CHANGES_RUN_LIMIT
  })
  if (photos.length < 1) {
    log('warn', 'No photo found to clusterize')
    return 0
  }
  const albums = await findAutoAlbums()
  const dataset = prepareDataset(photos, albums)
  const result = await clusterizePhotos(setting, dataset, albums)
  if (!result) {
    return 0
  }

  log('info', `${result.clusteredCount} photos clustered since ${sinceDate}`)
  const newLastDate = photos[photos.length - 1].attributes.created_at
  setting = await updateSettingStatus(
    result.setting,
    result.clusteredCount,
    newLastDate
  )
  return photos
}

const onPhotoUpload = async () => {
  log('info', `Service called with COZY_URL: ${process.env.COZY_URL}`)

  let setting = await readSetting()
  if (!setting) {
    // Create setting
    const files = await getAllPhotos()
    const dataset = prepareDataset(files)
    const params =
      dataset.length > EVALUATION_THRESHOLD
        ? initParameters(dataset)
        : getDefaultParameters(dataset)
    setting = await createSetting(params)
    log(
      'info',
      `Setting saved with ${JSON.stringify(
        params.modes
      )} on period ${JSON.stringify(params.period)}`
    )
  }

  if (setting.evaluationCount > EVALUATION_THRESHOLD) {
    // Recompute parameters when enough photos had been processed
    const newParams = await recomputeParameters(setting)
    if (newParams) {
      const params = [...setting.parameters, newParams]
      const newSetting = {
        ...setting,
        parameters: params,
        evaluationCount: 0
      }
      setting = await updateSetting(setting, newSetting)
      log('info', `Setting updated with ${JSON.stringify(newParams)}`)
    }
  }

  /*
    NOTE: A service has a limited execution window, defined in the stack config,
    e.g. 200s. As the clustering of thousands of photos can be time-consuming,
    we force a CHANGES_RUN_LIMIT to serialize the execution and be able to
    restart the clustering from the last run.
    */
  const processedPhotos = await runClustering(setting)
  if (processedPhotos.length >= CHANGES_RUN_LIMIT) {
    // There are still changes to process: re-launch the service
    const args = {
      message: {
        name: 'onPhotoUpload',
        slug: 'photos'
      }
    }
    await cozyClient.jobs.create('service', args)
  }
}

onPhotoUpload()

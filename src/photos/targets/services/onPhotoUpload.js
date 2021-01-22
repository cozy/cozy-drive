import doctypes from 'photos/targets/browser/doctypes'
import log from 'cozy-logger'
import CozyClient from 'cozy-client'
import fetch from 'node-fetch'
import { getAllPhotos, getFilesFromDate } from 'photos/ducks/clustering/files'
import {
  readSetting,
  createSetting,
  updateParameters,
  createParameter,
  updateSettingStatus,
  getDefaultParametersMode,
  updateParamsPeriod,
  shouldReleaseLock
} from 'photos/ducks/clustering/settings'
import {
  computeEpsTemporal,
  computeEpsSpatial,
  reachabilities
} from 'photos/ducks/clustering/service'
import {
  PERCENTILE,
  EVALUATION_THRESHOLD,
  CHANGES_RUN_LIMIT,
  TRIGGER_ELAPSED,
  LOG_ERROR_MSG_LIMIT
} from 'photos/ducks/clustering/consts'
import { spatioTemporalScaled } from 'photos/ducks/clustering/metrics'
import { gradientClustering } from 'photos/ducks/clustering/gradient'
import { saveClustering, findAutoAlbums } from 'photos/ducks/clustering/albums'
import { albumsToClusterize } from 'photos/ducks/clustering/reclusterize'
import {
  prepareDataset,
  convertDurationInMilliseconds
} from 'photos/ducks/clustering/utils'
import { getMatchingParameters } from 'photos/ducks/clustering/matching'

// This is required for using cozy-client as a node service.
// See https://github.com/cozy/cozy-client/blob/5f5939aef5f55f069b88f0bc1b897a7027a128e5/docs/details.md#how-to-use-the-client-on-node-environment-referenceerror-fetch-is-not-defined-
global.fetch = fetch

// Compute the actual clustering based on the new dataset and the existing albums
const createNewClusters = async (client, params, clusterAlbums, dataset) => {
  const reachs = reachabilities(dataset, spatioTemporalScaled, params)
  const clusters = gradientClustering(dataset, reachs, params)
  if (clusters.length > 0) {
    return saveClustering(client, clusters, clusterAlbums)
  }
  return 0
}

// Compute the inital clustering
const createInitialClusters = async (client, paramsMode, dataset) => {
  const reachs = reachabilities(dataset, spatioTemporalScaled, paramsMode)
  const clusters = gradientClustering(dataset, reachs, paramsMode)
  return saveClustering(client, clusters)
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (client, setting, dataset, albums) => {
  log('info', `Start clustering on ${dataset.length} photos`)

  let clusteredCount = 0
  if (albums && albums.length > 0) {
    // Build the clusterize Map, based on the dataset and existing photos
    const clusterize = await albumsToClusterize(client, dataset, albums)
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
          client,
          paramsMode,
          clusterAlbums,
          photos
        )
        setting = await updateParamsPeriod(client, setting, params, dataset)
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
    clusteredCount = await createInitialClusters(client, paramsMode, dataset)
    setting = await updateParamsPeriod(client, setting, params, dataset)
  }
  return { setting, clusteredCount }
}

const initParameters = dataset => {
  log('info', `Compute clustering parameters on ${dataset.length} photos`)
  const epsTemporal = computeEpsTemporal(dataset, PERCENTILE)
  const epsSpatial = computeEpsSpatial(dataset, PERCENTILE)
  return createParameter(dataset, epsTemporal, epsSpatial)
}

const recomputeParameters = async (client, setting) => {
  const lastParams = setting.parameters[setting.parameters.length - 1]
  // The defaultEvaluation field is used at init if there are not enough files
  // for a proper parameters evaluation: we use default metrics and therefore,
  // this end period should not be taken into consideration.
  const lastEvaluationEnd = lastParams.defaultEvaluation
    ? lastParams.evaluation.start
    : lastParams.evaluation.end

  const files = await getFilesFromDate(client, lastEvaluationEnd)
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

const runClustering = async (client, setting) => {
  const sinceDate = setting.lastDate ? setting.lastDate : 0
  const photos = await getFilesFromDate(client, sinceDate, {
    limit: CHANGES_RUN_LIMIT
  })
  if (photos.length < 1) {
    log('warn', 'No photo found to clusterize')
    return { photos: [], newSetting: setting }
  }
  const albums = await findAutoAlbums(client)
  const dataset = prepareDataset(photos, albums)
  const result = await clusterizePhotos(client, setting, dataset, albums)
  if (!result) {
    return { photos: [], newSetting: setting }
  }

  log('info', `${result.clusteredCount} photos clustered since ${sinceDate}`)
  const newLastDate =
    photos[photos.length - 1].attributes.cozyMetadata.createdAt
  // The oldest photo in the dataset is older or equal than the last photo used
  // to compute the parameters: do not count this dataset in the evaluation
  // as it has been already used to compute parameters
  const lastParams = setting.parameters[setting.parameters.length - 1]
  const evalCount =
    new Date(dataset[0].datetime).getTime() <=
    new Date(lastParams.evaluation.end).getTime()
      ? 0
      : result.clusteredCount
  setting = await updateSettingStatus(
    client,
    result.setting,
    evalCount,
    newLastDate
  )
  return { photos, newSetting: setting }
}

export const onPhotoUpload = async () => {
  log('info', `Service called with COZY_URL: ${process.env.COZY_URL}`)

  const options = {
    schema: doctypes
  }
  const client = CozyClient.fromEnv(null, options)
  let setting = await readSetting(client)
  if (!setting) {
    // Create setting
    const files = await getAllPhotos(client)
    const dataset = prepareDataset(files)
    if (dataset.length == 0) {
      return 0
    }
    const params =
      dataset.length > EVALUATION_THRESHOLD
        ? initParameters(dataset)
        : createParameter(dataset)
    setting = await createSetting(client, params)
    log(
      'info',
      `Setting saved with ${JSON.stringify(
        params.modes
      )} on period ${JSON.stringify(params.period)}`
    )
  }

  /*
    There is no way to prevent the service to be run in parallel for
    the same instance, which could lead to inconsistent results.
    To avoid this, we use a lock which is set to true during the execution
  */
  if (setting.jobStatus === 'running') {
    // Safeguard to avoid never-released locks
    if (!shouldReleaseLock(setting)) {
      log('info', 'The service is already executed. Abort.')
      return
    }
    log('warn', 'The job status is marked as running for too long.')
  } else if (setting.jobStatus === 'postponed') {
    const lastUpdatedDate = new Date(setting.cozyMetadata.updatedAt).getTime()
    const elapsedDuration = convertDurationInMilliseconds(TRIGGER_ELAPSED)
    // Stop if a trigger is planned later
    if (lastUpdatedDate + elapsedDuration > Date.now()) {
      log('info', 'The service is already planned later. Abort.')
      return
    }
  }
  try {
    const res = await client.save({ ...setting, jobStatus: 'running' })
    setting = res.data
  } catch (e) {
    if (e.status === 409) {
      log('error', 'Several jobs running. Abort')
    }
    return
  }

  try {
    const lastParams = setting.parameters[setting.parameters.length - 1]
    if (!lastParams.evaluation) {
      // Temporary code for migration: existing instances with clusters do not
      // have the evaluation parameter
      lastParams.evaluation = {
        start: lastParams.period.start,
        end: lastParams.period.end
      }
      setting = await client.save({ ...setting })
    }

    if (setting.evaluationCount > EVALUATION_THRESHOLD) {
      // Recompute parameters when enough photos had been processed
      const newParams = await recomputeParameters(client, setting)
      if (newParams) {
        setting = await updateParameters(client, setting, newParams)
        log('info', `Setting updated with ${JSON.stringify(newParams)}`)
      }
    }

    /*
      NOTE: A service has a limited execution window, defined in the stack config,
      e.g. 200s. As the clustering of thousands of photos can be time-consuming,
      we force a CHANGES_RUN_LIMIT to serialize the execution and be able to
      restart the clustering from the last run.
      */
    const { photos, newSetting } = await runClustering(client, setting)
    if (photos.length >= CHANGES_RUN_LIMIT) {
      // There are still changes to process: re-launch the service.
      // We use a @in trigger to postpone the next execution as we might
      // reach the rate thumbnails jobs limit (5000/h the 2019-09-04)
      const attrs = {
        type: '@in',
        arguments: TRIGGER_ELAPSED,
        worker: 'service',
        message: {
          name: 'onPhotoUpload',
          slug: 'photos'
        }
      }
      client
        .getStackClient()
        .collection('io.cozy.triggers')
        .create(attrs)
      await client.save({
        ...newSetting,
        jobStatus: 'postponed'
      })
      log('info', `The service will be run again in ${TRIGGER_ELAPSED}`)
    } else {
      await client.save({ ...newSetting, jobStatus: '' })
    }
  } catch (e) {
    // Release the lock in case of error
    log('critical', String(e).substr(0, LOG_ERROR_MSG_LIMIT))
    await client.save({ ...setting, jobStatus: '' })
    process.exit(1)
  }
}

onPhotoUpload()

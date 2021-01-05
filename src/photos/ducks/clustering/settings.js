import log from 'cozy-logger'
import { Q } from 'cozy-client'
import { DOCTYPE_PHOTOS_SETTINGS } from 'drive/lib/doctypes'
import {
  SETTING_TYPE,
  DEFAULT_SETTING,
  DEFAULT_EPS_TEMPORAL,
  DEFAULT_EPS_SPATIAL,
  DEFAULT_MAX_BOUND,
  DEFAULT_MODE,
  COARSE_COEFFICIENT
} from './consts'
import { gradientAngle } from 'photos/ducks/clustering/gradient'

export const createSetting = async (client, initParameters) => {
  log('info', 'Create setting')
  const defaultSetting = DEFAULT_SETTING
  defaultSetting.parameters[0] = initParameters
  const setting = await client.create(DOCTYPE_PHOTOS_SETTINGS, defaultSetting)
  return setting.data
}

export const readSetting = async client => {
  const settings = await client.query(Q(DOCTYPE_PHOTOS_SETTINGS))
  return settings.data.find(doc => doc.type === SETTING_TYPE)
}

export const updateParameters = async (client, setting, params) => {
  const parameters = [...setting.parameters, params]
  const newSetting = await client.save({
    ...setting,
    parameters,
    evaluationCount: 0
  })
  return newSetting.data
}

export const getDefaultParametersMode = params => {
  if (!params || !params.modes) {
    return null
  }
  const mode = params.modes.find(mode => mode.name === DEFAULT_MODE)
  if (!mode || !mode.epsTemporal || !mode.epsSpatial) {
    return null
  }
  const epsMax = Math.max(mode.epsTemporal, mode.epsSpatial)
  const maxBound =
    epsMax * 2 < DEFAULT_MAX_BOUND ? epsMax * 2 : DEFAULT_MAX_BOUND
  const cosAngle = gradientAngle(epsMax, COARSE_COEFFICIENT)
  return {
    epsTemporal: mode.epsTemporal,
    epsSpatial: mode.epsSpatial,
    epsMax,
    maxBound,
    cosAngle
  }
}

export const createParameter = (dataset, epsTemporal, epsSpatial) => {
  return {
    evaluation: {
      start: dataset[0].datetime,
      end: dataset[dataset.length - 1].datetime
    },
    period: {
      start: dataset[0].datetime,
      end: dataset[0].datetime
    },
    modes: [
      {
        name: DEFAULT_MODE,
        epsTemporal: epsTemporal ? epsTemporal : DEFAULT_EPS_TEMPORAL,
        epsSpatial: epsSpatial ? epsSpatial : DEFAULT_EPS_SPATIAL
      }
    ],
    defaultEvaluation: epsTemporal ? false : true
  }
}

const getPhotosPeriod = (params, photos) => {
  // Photos are sorted from oldest to newest
  const newest = new Date(photos[photos.length - 1].datetime).getTime()
  const endPeriod = new Date(params.period.end).getTime()

  // Note: we do not extend the period backwards (an older starting period),
  // to avoid side-effects cases where several periods would overlap.
  if (newest > endPeriod) {
    return {
      start: params.period.start,
      end: photos[photos.length - 1].datetime
    }
  }
  return params.period
}

export const updateParamsPeriod = async (client, setting, params, photos) => {
  const newParams = {
    ...params,
    period: getPhotosPeriod(params, photos)
  }
  const idx = setting.parameters.findIndex(p => {
    return (
      p.period.start === params.period.start &&
      p.period.end === params.period.end
    )
  })
  if (idx < 0) {
    log('warn', 'Can not update setting: the period is incorrect')
    return
  }
  const parameters = [...setting.parameters]
  parameters[idx] = newParams

  const newSetting = await client.save({ ...setting, parameters })
  return newSetting.data
}

export const updateSettingStatus = async (client, setting, count, lastDate) => {
  log('info', `Update setting for last date ${lastDate}`)
  const evaluationCount =
    count > 0 ? setting.evaluationCount + count : setting.evaluationCount
  const runs = setting.runs ? setting.runs + 1 : 1
  const updatedSetting = await client.save({
    ...setting,
    evaluationCount,
    lastDate,
    runs
  })
  return updatedSetting.data
}

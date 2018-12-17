import { cozyClient, log } from 'cozy-konnector-libs'
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
import { getMatchingParameters } from './matching'

export const createSetting = initParameters => {
  log('info', 'Create setting')
  const defaultSetting = DEFAULT_SETTING
  defaultSetting.parameters[0] = initParameters
  return cozyClient.data.create(DOCTYPE_PHOTOS_SETTINGS, defaultSetting)
}

export const readSetting = async () => {
  const settings = await cozyClient.data.findAll(DOCTYPE_PHOTOS_SETTINGS)
  return settings.find(doc => doc.type === SETTING_TYPE)
}

const getDefaultParametersMode = params => {
  const mode = params.modes.find(mode => mode.name === DEFAULT_MODE)
  if (!mode || !mode.epsTemporal || !mode.epsSpatial) {
    return null
  }
  mode.epsMax = Math.max(mode.epsTemporal, mode.epsSpatial)
  mode.maxBound =
    mode.epsMax * 2 < DEFAULT_MAX_BOUND ? mode.epsMax * 2 : DEFAULT_MAX_BOUND
  mode.cosAngle = gradientAngle(mode.epsMax, COARSE_COEFFICIENT)
  return mode
}

export const findPhotosDefaultParameters = (setting, photos) => {
  const matchingParams = getMatchingParameters(setting.parameters, photos)
  return matchingParams ? getDefaultParametersMode(matchingParams) : null
}

export const findLastDefaultParameters = setting => {
  const lastParams = setting.parameters[setting.parameters.length - 1]
  return lastParams ? getDefaultParametersMode(lastParams) : null
}

export const getDefaultSetting = photos => {
  const setting = DEFAULT_SETTING
  const params = {
    period: {
      start: photos[0].datetime,
      end: photos[photos.length - 1].datetime
    },
    modes: [
      {
        name: DEFAULT_MODE,
        epsTemporal: DEFAULT_EPS_TEMPORAL,
        epsSpatial: DEFAULT_EPS_SPATIAL
      }
    ]
  }
  setting.parameters[0] = params
  return setting
}

export const saveChangesSettings = (setting, changes) => {
  const count = setting.evaluationCount + changes.photos.length
  const lastSeq = changes.newLastSeq
  const newSetting = { ...setting, evaluationCount: count, lastSeq: lastSeq }
  return cozyClient.data.update(DOCTYPE_PHOTOS_SETTINGS, setting, newSetting)
}

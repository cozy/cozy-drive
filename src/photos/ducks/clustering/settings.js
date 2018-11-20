import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_PHOTOS_SETTINGS } from 'drive/lib/doctypes'
import {
  SETTING_TYPE,
  DEFAULT_SETTING,
  DEFAULT_PERIOD,
  DEFAULT_MODE
} from './consts'

export const createDefaultSetting = () => {
  log('info', 'Create default setting')
  return cozyClient.data.create(DOCTYPE_PHOTOS_SETTINGS, DEFAULT_SETTING)
}

export const readSetting = async () => {
  const settings = await cozyClient.data.findAll(DOCTYPE_PHOTOS_SETTINGS)
  return settings.find(doc => doc.type === SETTING_TYPE)
}

export const defaultParameters = setting => {
  const param = setting.parameters.filter(param => {
    return param.period === DEFAULT_PERIOD
  })
  const defaultParam =
    param.length > 0
      ? param[0].modes.find(mode => mode.name === DEFAULT_MODE)
      : null
  return defaultParam
    ? {
        eps: defaultParam.eps,
        epsTemporal: defaultParam.eps_temporal,
        epsSpatial: defaultParam.eps_spatial
      }
    : defaultParam
}

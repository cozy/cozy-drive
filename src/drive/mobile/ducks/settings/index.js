// export { default as Settings } from './Settings'
// export { default as RatingModal } from './RatingModal'

export {
  setUrl,
  setAnalytics,
  setOffline,
  startReplication,
  setBackupImages
} from './actions'

export {
  default,
  getServerUrl,
  isAnalyticsOn,
  getPouchIndexes,
  shouldWorkFromPouchDB
} from './reducers'

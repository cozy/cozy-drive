export const DEFAULT_PERIOD = 'all'
export const DEFAULT_MODE = 'default'
export const SETTING_TYPE = 'clustering'
export const DEFAULT_MAX_BOUND = 48
export const DEFAULT_EPS_TEMPORAL = 12
export const DEFAULT_EPS_SPATIAL = 3
export const MIN_EPS_TEMPORAL = 3
export const MIN_EPS_SPATIAL = 2.5
export const PERCENTILE = 99.5
export const MAX_DISTANCE = 24 * 7
export const COARSE_COEFFICIENT = 1
export const EVALUATION_THRESHOLD = 500
export const CHANGES_RUN_LIMIT = 1000
export const TRIGGER_ELAPSED = '20m'
export const LOG_ERROR_MSG_LIMIT = 32 * 1024 - 1 // Avoid unreadable logs by the stack
export const DAY_DURATION_IN_MS = 24 * 60 * 60 * 1000

export const DEFAULT_SETTING = {
  type: SETTING_TYPE,
  evaluationCount: 0,
  parameters: []
}

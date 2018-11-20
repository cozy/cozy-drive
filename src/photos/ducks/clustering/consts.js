export const THRESHOLD = 314
export const DEFAULT_PERIOD = 'all'
export const DEFAULT_MODE = 'default'
export const SETTING_TYPE = 'clustering'
const DEFAULT_MAX_BOUND = 24
const DEFAULT_EPS_TEMPORAL = 12
const DEFAULT_EPS_SPATIAL = 2

export const DEFAULT_SETTING = {
  type: SETTING_TYPE,
  lastSeq: 0,
  currentCount: 0,
  parameters: [
    {
      period: DEFAULT_PERIOD,
      modes: [
        {
          name: DEFAULT_MODE,
          eps: DEFAULT_MAX_BOUND,
          eps_temporal: DEFAULT_EPS_TEMPORAL,
          eps_spatial: DEFAULT_EPS_SPATIAL
        }
      ]
    }
  ]
}

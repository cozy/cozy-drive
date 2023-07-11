import CozyClient, { Q } from 'cozy-client'

const FIVE_MINUTES = 5 * 60 * 1000

export const buildSettingsByIdQuery = id => ({
  definition: Q('io.cozy.settings').getById(id),
  options: {
    as: `io.cozy.settings/${id}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(FIVE_MINUTES),
    singleDocData: true
  }
})

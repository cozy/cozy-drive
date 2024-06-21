import CozyClient, { Q, hasQueryBeenLoaded } from 'cozy-client'

const FIVE_MINUTES = 5 * 60 * 1000

export const buildSettingsByIdQuery = id => ({
  definition: Q('io.cozy.settings').getById(id),
  options: {
    as: `io.cozy.settings/${id}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(FIVE_MINUTES),
    singleDocData: true
  }
})

/**
 * Check if the query has been loaded and if it has data
 *
 * @param {import('cozy-client/types/types').UseQueryReturnValue} queryResult
 * @returns {boolean}
 */
export const hasDataLoaded = queryResult => {
  return hasQueryBeenLoaded(queryResult) && queryResult.data
}

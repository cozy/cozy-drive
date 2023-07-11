import { useQuery, hasQueryBeenLoaded } from 'cozy-client'

import { buildSettingsByIdQuery } from 'lib/queries'

const useInstanceInfo = () => {
  const instanceQuery = buildSettingsByIdQuery('io.cozy.settings.instance')
  const instanceResult = useQuery(
    instanceQuery.definition,
    instanceQuery.options
  )

  const contextQuery = buildSettingsByIdQuery('context')
  const contextResult = useQuery(contextQuery.definition, contextQuery.options)

  const diskUsageQuery = buildSettingsByIdQuery('disk-usage')
  const diskUsageResult = useQuery(
    diskUsageQuery.definition,
    diskUsageQuery.options
  )

  return {
    isLoaded:
      hasQueryBeenLoaded(instanceResult) !== null &&
      hasQueryBeenLoaded(contextResult) !== null &&
      hasQueryBeenLoaded(diskUsageResult) !== null,
    instance: {
      data: instanceResult.data
    },
    context: {
      data: contextResult.data
    },
    diskUsage: {
      data: diskUsageResult.data
    }
  }
}

export default useInstanceInfo

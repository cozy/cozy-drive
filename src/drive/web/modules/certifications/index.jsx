import { useQuery } from 'cozy-client'

export const MakeConditionWithQuery = ({ query }) => {
  const queryResult = useQuery(query.definition, query.options)

  return queryResult.fetchStatus === 'loaded' && queryResult.data.length > 0
}

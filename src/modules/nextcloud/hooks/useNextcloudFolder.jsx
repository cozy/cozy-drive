import { useQuery } from 'cozy-client'

import { buildNextcloudFolderQuery } from 'queries'

const useNextcloudFolder = ({ sourceAccount, path }) => {
  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount,
    path
  })
  const nextcloudResult = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  )

  return {
    nextcloudQuery,
    nextcloudResult
  }
}

export { useNextcloudFolder }

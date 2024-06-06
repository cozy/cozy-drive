import { useQuery } from 'cozy-client'

import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { buildFileByIdQuery } from 'modules/queries'

const useNextcloudFolder = ({ shortcutId, path }) => {
  const shortcutQuery = buildFileByIdQuery(shortcutId)
  const shortcutResult = useQuery(
    shortcutQuery.definition,
    shortcutQuery.options
  )

  const sourceAccount = shortcutResult.data?.cozyMetadata?.sourceAccount

  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount,
    path
  })
  const nextcloudResult = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  )

  return {
    shortcutResult,
    nextcloudResult
  }
}

export { useNextcloudFolder }

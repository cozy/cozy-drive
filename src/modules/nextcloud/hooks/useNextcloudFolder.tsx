import { useQuery } from 'cozy-client'
import { NextcloudFile } from 'cozy-client/types/types'

import {
  buildNextcloudFolderQuery,
  buildNextcloudTrashFolderQuery,
  QueryConfig
} from 'queries'

interface NextcloudFolderProps {
  sourceAccount?: string
  path: string
  insideTrash: boolean
}

interface NextcloudFolderReturn {
  nextcloudQuery: QueryConfig
  nextcloudResult: {
    data?: NextcloudFile[] | null
  }
}

const useNextcloudFolder = ({
  sourceAccount,
  path,
  insideTrash = false
}: NextcloudFolderProps): NextcloudFolderReturn => {
  const queryBuilder = insideTrash
    ? buildNextcloudTrashFolderQuery
    : buildNextcloudFolderQuery

  const nextcloudQuery = queryBuilder({
    sourceAccount,
    path
  })
  const nextcloudResult = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  ) as NextcloudFolderReturn['nextcloudResult']

  return {
    nextcloudQuery,
    nextcloudResult
  }
}

export { useNextcloudFolder }

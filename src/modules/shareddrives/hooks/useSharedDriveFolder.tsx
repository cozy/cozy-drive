import { useState, useEffect, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { buildSharedDriveFolderQuery, QueryConfig } from '@/queries'

interface SharedDriveFolderProps {
  driveId: string
  folderId: string
}

interface SharedDriveFolderReturn {
  sharedDriveQuery: QueryConfig
  sharedDriveResult: {
    data?: IOCozyFile[] | null
    included?: IOCozyFile[] | null
  }
}

const useSharedDriveFolder = ({
  driveId,
  folderId
}: SharedDriveFolderProps): SharedDriveFolderReturn => {
  // FIXME: We should use useQuery hook here but it doesn't allow to get included data
  // See https://github.com/cozy/cozy-client/issues/1620

  // const sharedDriveQuery = buildSharedDriveFolderQuery({
  //   driveId,
  //   folderId
  // })
  // const sharedDriveResult = useQuery(
  //   sharedDriveQuery.definition,
  //   sharedDriveQuery.options
  // ) as SharedDriveFolderReturn['sharedDriveResult']

  // return {
  //   sharedDriveQuery,
  //   sharedDriveResult
  // }

  const client = useClient()
  const [sharedDriveResult, setSharedDriveResult] = useState<
    SharedDriveFolderReturn['sharedDriveResult']
  >({ data: undefined })

  const sharedDriveQuery = useMemo(
    () =>
      buildSharedDriveFolderQuery({
        driveId,
        folderId
      }),
    [driveId, folderId]
  )

  useEffect(() => {
    const fetchSharedDriveFolder = async (): Promise<void> => {
      const newSharedDriveResult = (await client?.query(
        sharedDriveQuery.definition(),
        sharedDriveQuery.options
      )) as SharedDriveFolderReturn['sharedDriveResult']

      setSharedDriveResult(newSharedDriveResult)
    }

    if (client) {
      void fetchSharedDriveFolder()
    }
  }, [client, sharedDriveQuery])

  return {
    sharedDriveQuery,
    sharedDriveResult
  }
}

export { useSharedDriveFolder }

import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { SharedDriveFolderBody } from '@/modules/shareddrives/components/SharedDriveFolderBody'
import { useSharedDriveFolder } from '@/modules/shareddrives/hooks/useSharedDriveFolder'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'

const SharedDriveFolderView = () => {
  const { driveId, folderId } = useParams()

  const { sharedDriveResult } = useSharedDriveFolder({
    driveId,
    folderId
  })

  const queryResults = sharedDriveResult
    ? [{ fetchStatus: 'loaded', data: sharedDriveResult.included }]
    : []

  return (
    <FolderView>
      <FolderViewHeader>TODO</FolderViewHeader>
      <SharedDriveFolderBody folderId={folderId} queryResults={queryResults} />
      <Outlet />
    </FolderView>
  )
}

export { SharedDriveFolderView }

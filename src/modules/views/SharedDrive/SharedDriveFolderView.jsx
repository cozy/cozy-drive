import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { Content } from 'cozy-ui/transpiled/react/Layout'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { SharedDriveFolderBody } from '@/modules/shareddrives/components/SharedDriveFolderBody'
import { useSharedDriveFolder } from '@/modules/shareddrives/hooks/useSharedDriveFolder'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'

const SharedDriveFolderView = () => {
  const { isMobile } = useBreakpoints()
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
      <Content className={isMobile ? '' : 'u-pt-1'}>
        <FolderViewHeader>TODO</FolderViewHeader>
        <SharedDriveFolderBody
          folderId={folderId}
          queryResults={queryResults}
        />
        <Outlet />
      </Content>
    </FolderView>
  )
}

export { SharedDriveFolderView }

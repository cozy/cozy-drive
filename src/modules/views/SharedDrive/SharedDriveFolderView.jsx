import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { useSharingContext } from 'cozy-sharing'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { useDisplayedFolder } from '@/hooks'
import Toolbar from '@/modules/drive/Toolbar'
import { SharedDriveBreadcrumb } from '@/modules/shareddrives/components/SharedDriveBreadcrumb'
import { SharedDriveFolderBody } from '@/modules/shareddrives/components/SharedDriveFolderBody'
import { useSharedDriveFolder } from '@/modules/shareddrives/hooks/useSharedDriveFolder'
import Dropzone from '@/modules/upload/Dropzone'
import DropzoneDnD from '@/modules/upload/DropzoneDnD'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'

const SharedDriveFolderView = () => {
  const { isMobile } = useBreakpoints()
  const { driveId, folderId } = useParams()
  const { hasWriteAccess } = useSharingContext()
  const { displayedFolder } = useDisplayedFolder()
  const isInRootOfSharedDrive = displayedFolder?.dir_id === SHARED_DRIVES_DIR_ID

  const { sharedDriveResult } = useSharedDriveFolder({
    driveId,
    folderId
  })

  const queryResults = sharedDriveResult
    ? [{ fetchStatus: 'loaded', data: sharedDriveResult.included }]
    : []

  const canWriteToCurrentFolder = hasWriteAccess(folderId, driveId)

  const DropzoneComp = !isMobile ? DropzoneDnD : Dropzone

  return (
    <FolderView>
      <DropzoneComp
        disabled={!canWriteToCurrentFolder}
        displayedFolder={displayedFolder}
      >
        <Content className={isMobile ? '' : 'u-pt-1'}>
          <FolderViewHeader>
            <SharedDriveBreadcrumb driveId={driveId} folderId={folderId} />
            <Toolbar
              canUpload={false}
              canCreateFolder={false}
              driveId={driveId}
              showShareButton={isInRootOfSharedDrive}
            />
          </FolderViewHeader>

          <SharedDriveFolderBody
            folderId={folderId}
            queryResults={queryResults}
          />
          <Outlet />
        </Content>
      </DropzoneComp>
    </FolderView>
  )
}

export { SharedDriveFolderView }

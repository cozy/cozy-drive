import React, { FC } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import flag from 'cozy-flags'

import { LoaderModal } from '@/components/LoaderModal'
import useDisplayedFolder from '@/hooks/useDisplayedFolder'
import { DuplicateModal } from '@/modules/duplicate/components/DuplicateModal'
import { useQueryMultipleSharedDriveFolders } from '@/modules/shareddrives/hooks/useQueryMultipleSharedDriveFolders'

const SharedDriveDuplicateView: FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state: { fileIds?: string[] }
  }
  const { displayedFolder } = useDisplayedFolder()

  const hasFileIds = state.fileIds != undefined

  const { sharedDriveResults } = useQueryMultipleSharedDriveFolders({
    folderIds: state.fileIds ?? [],
    driveId: displayedFolder?.driveId ?? ''
  })

  if (!hasFileIds) {
    return <Navigate to=".." replace={true} />
  }

  if (sharedDriveResults && displayedFolder) {
    const onClose = (): void => {
      navigate('..', { replace: true })
    }

    return (
      <DuplicateModal
        showNextcloudFolder={!flag('drive.hide-nextcloud-dev')}
        showSharedDriveFolder={true}
        currentFolder={displayedFolder}
        entries={sharedDriveResults}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { SharedDriveDuplicateView }

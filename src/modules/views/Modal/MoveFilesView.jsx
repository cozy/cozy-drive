import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { LoaderModal } from '@/components/LoaderModal'
import useDisplayedFolder from '@/hooks/useDisplayedFolder'
import MoveModal from '@/modules/move/MoveModal'
import { useSharedDrives } from '@/modules/shareddrives/hooks/useSharedDrives'
import { buildParentsByIdsQuery } from '@/queries'

const MoveFilesView = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { displayedFolder } = useDisplayedFolder()
  const { sharedDrives } = useSharedDrives()

  const hasFileIds = state?.fileIds != undefined

  const fileQuery = buildParentsByIdsQuery(hasFileIds ? state.fileIds : [])
  const fileResult = useQuery(fileQuery.definition, {
    ...fileQuery.options,
    enabled: hasFileIds
  })

  if (!hasFileIds) {
    return <Navigate to=".." replace={true} />
  }

  if (hasQueryBeenLoaded(fileResult) && fileResult.data && displayedFolder) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    const showNextcloudFolder = !fileResult.data.some(
      file => file.type === 'directory'
    )

    return (
      <MoveModal
        currentFolder={displayedFolder}
        entries={fileResult.data}
        onClose={onClose}
        showNextcloudFolder={showNextcloudFolder}
        showSharedDriveFolder={
          sharedDrives?.length > 0 && flag('drive.move-in-shared-drive.enabled')
        }
      />
    )
  }

  return <LoaderModal />
}

export { MoveFilesView }

import React from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import { SharedDriveModal, SharedDriveEditModal } from 'cozy-sharing'

import { LoaderModal } from '@/components/LoaderModal'
import { buildFileOrFolderByIdQuery, buildSharedDriveIdQuery } from '@/queries'

const ShareDriveEditView = () => {
  const navigate = useNavigate()
  const { driveId, folderId } = useParams()

  const folderQuery = buildFileOrFolderByIdQuery(folderId)
  const folderResult = useQuery(folderQuery.definition, folderQuery.options)

  const sharedDriveQuery = buildSharedDriveIdQuery({ driveId })
  const sharedDriveResult = useQuery(
    sharedDriveQuery.definition,
    sharedDriveQuery.options
  )

  const handleExit = () => {
    navigate('..', { replace: true })
  }

  if (
    hasQueryBeenLoaded(folderResult) &&
    folderResult.data &&
    hasQueryBeenLoaded(sharedDriveResult) &&
    sharedDriveResult.data
  ) {
    // return (
    //   <SharedDriveModal
    //     sharedDrive={sharedDriveResult.data}
    //     sharedDriveFolder={folderResult.data}
    //     onClose={handleExit}
    //   />
    // )
    return (
      <SharedDriveEditModal document={folderResult.data} onClose={handleExit} />
    )
  }

  if (
    (hasQueryBeenLoaded(folderResult) && !folderResult.data) ||
    (hasQueryBeenLoaded(sharedDriveResult) && !sharedDriveResult.data)
  ) {
    handleExit()
  }

  if (
    folderResult.fetchStatus === 'failed' ||
    sharedDriveResult.fetchStatus === 'failed'
  ) {
    handleExit()
  }

  return <LoaderModal />
}

export { ShareDriveEditView }

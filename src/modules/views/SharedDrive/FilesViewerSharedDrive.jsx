import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'

import { FilesViewerLoading } from '@/components/FilesViewerLoading'
import { useCurrentFolderId } from '@/hooks'
import { useFolderSort } from '@/modules/navigation/duck'
import {
  getSharedDrivePath,
  getSharedDriveViewerPath
} from '@/modules/routeUtils'
import FilesViewer from '@/modules/viewer/FilesViewer'
import { buildSharedDriveQuery } from '@/queries'

const FilesViewerSharedDrive = () => {
  const navigate = useNavigate()
  const [sortOrder] = useFolderSort()
  const folderId = useCurrentFolderId()
  const { driveId } = useParams()
  const { hasWriteAccess } = useSharingContext()

  const buildedFilesQuery = buildSharedDriveQuery({
    currentFolderId: folderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order,
    driveId
  })

  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  const viewableFiles = filesQuery.data

  if (viewableFiles) {
    return (
      <FilesViewer
        files={viewableFiles}
        filesQuery={filesQuery}
        onClose={() => navigate(getSharedDrivePath(driveId, folderId))}
        onChange={fileId =>
          navigate(`${getSharedDriveViewerPath(driveId, folderId, fileId)}`)
        }
        viewerProps={{
          panel: {
            sharing: { disabled: !hasWriteAccess(folderId) }
          }
        }}
      />
    )
  }

  return <FilesViewerLoading />
}

export default FilesViewerSharedDrive

import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { generateWebLink, useClient, useQuery } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'

import { FilesViewerLoading } from '@/components/FilesViewerLoading'
import useHead from '@/components/useHead'
import { useCurrentFolderId, useFolderSort } from '@/hooks'
import {
  getSharedDrivePath,
  getSharedDriveViewerPath,
  getSpacePath,
  isSpacePath
} from '@/modules/routeUtils'
import FilesViewer from '@/modules/viewer/FilesViewer'
import {
  getSharingsSharedDrivePath,
  getSharingsSharedDriveViewerPath,
  getSharingsTabFromPath
} from '@/modules/views/Sharings/routes'
import { buildSharedDriveQuery } from '@/queries'

const FilesViewerSharedDrive = () => {
  const navigate = useNavigate()
  const client = useClient()
  const { pathname } = useLocation()
  const [sortOrder] = useFolderSort()
  const folderId = useCurrentFolderId()
  const { driveId } = useParams()
  const { hasWriteAccess } = useSharingContext()
  useHead()

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
    const isInSharings = Boolean(getSharingsTabFromPath(pathname))
    const isInSpace = isSpacePath(pathname)
    const closePath = isInSharings
      ? getSharingsSharedDrivePath(pathname, driveId, folderId)
      : isInSpace
        ? getSpacePath(driveId, folderId)
        : getSharedDrivePath(driveId, folderId)

    return (
      <FilesViewer
        files={viewableFiles}
        filesQuery={filesQuery}
        onClose={() => navigate(closePath)}
        onChange={fileId =>
          navigate(
            isInSharings
              ? getSharingsSharedDriveViewerPath(
                  pathname,
                  driveId,
                  folderId,
                  fileId
                )
              : isInSpace
                ? `${getSpacePath(driveId, folderId)}/file/${fileId}`
                : getSharedDriveViewerPath(driveId, folderId, fileId)
          )
        }
        viewerProps={{
          panel: {
            sharing: { disabled: !hasWriteAccess(folderId, driveId) }
          },
          ...(isInSpace && {
            toolbarProps: {
              onFilePathClick: file =>
                window.open(
                  generateWebLink({
                    slug: 'drive',
                    cozyUrl: client.getStackClient().uri,
                    subDomainType: client.getInstanceOptions().subdomain,
                    pathname: '/',
                    hash: getSharedDrivePath(driveId, file.dir_id)
                  }),
                  '_blank',
                  'noopener,noreferrer'
                )
            }
          })
        }}
      />
    )
  }

  return <FilesViewerLoading />
}

export default FilesViewerSharedDrive

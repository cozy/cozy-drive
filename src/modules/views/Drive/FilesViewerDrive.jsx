import { useCurrentFolderId } from 'hooks'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { useFolderSort } from 'modules/navigation/duck'
import { buildDriveQuery } from 'modules/queries'
import { getFolderPath } from 'modules/routeUtils'
import FilesViewer, { FilesViewerLoading } from 'modules/viewer/FilesViewer'

const FilesViewerWithQuery = props => {
  const navigate = useNavigate()
  const [sortOrder] = useFolderSort()
  const folderId = useCurrentFolderId()

  const buildedFilesQuery = buildDriveQuery({
    currentFolderId: folderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  if (filesQuery.data) {
    const viewableFiles = filesQuery.data
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={filesQuery}
        onClose={() => navigate(getFolderPath(folderId))}
        onChange={fileId =>
          navigate(`${getFolderPath(folderId)}/file/${fileId}`)
        }
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

export default FilesViewerWithQuery

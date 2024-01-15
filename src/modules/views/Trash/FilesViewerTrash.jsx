import { useCurrentFolderId } from 'hooks'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { useFolderSort } from 'modules/navigation/duck'
import { buildTrashQuery } from 'modules/queries'
import FilesViewer, { FilesViewerLoading } from 'modules/viewer/FilesViewer'

const FilesViewerWithQuery = props => {
  const currentFolderId = useCurrentFolderId()
  const [sortOrder] = useFolderSort(currentFolderId)
  const navigate = useNavigate()

  const fileQuery = buildTrashQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const filesResult = useQuery(fileQuery.definition, fileQuery.options)
  if (filesResult.data) {
    const viewableFiles = filesResult.data
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={filesResult}
        onClose={() => navigate(`/trash/${currentFolderId}`)}
        onChange={fileId =>
          navigate(`/trash/${currentFolderId}/file/${fileId}`)
        }
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

export default FilesViewerWithQuery

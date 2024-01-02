import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { buildTrashQuery } from 'drive/web/modules/queries'
import { useCurrentFolderId } from 'hooks'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewer'

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

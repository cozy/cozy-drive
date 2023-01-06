import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildTrashQuery } from 'drive/web/modules/queries'
import { useCurrentFolderId } from 'drive/web/modules/selectors'
import { useFolderSort } from 'drive/web/modules/navigation/duck'

import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewer'
const FilesViewerWithQuery = props => {
  const currentFolderId = useCurrentFolderId()
  const [sortOrder] = useFolderSort(currentFolderId)

  const fileQuery = buildTrashQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const filesResult = useQuery(fileQuery.definition, fileQuery.options)
  const { router } = useRouter()
  if (filesResult.data) {
    const viewableFiles = filesResult.data
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={filesResult}
        onClose={() =>
          router.push({
            pathname: `/trash/${props.currentFolderId}`
          })
        }
        onChange={fileId =>
          router.push({
            pathname: `/trash/${props.currentFolderId}/file/${fileId}`
          })
        }
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

export default FilesViewerWithQuery

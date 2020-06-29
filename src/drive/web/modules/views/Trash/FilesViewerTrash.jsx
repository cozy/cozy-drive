import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildTrashQueryFolder } from 'drive/web/modules/queries'
import {
  getCurrentFileId,
  getCurrentFolderId
} from 'drive/web/modules/selectors'
import { useFolderSort } from 'drive/web/modules/navigation/duck'

import { connect } from 'react-redux'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewerV2'
const FilesViewerWithQuery = props => {
  const currentFolderId = props.currentFolderId
  const [sortOrder] = useFolderSort(currentFolderId)

  const fileQuery = buildTrashQueryFolder({
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
            pathname: `trash/${props.currentFolderId}/file/${fileId}`
          })
        }
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

const mapStateToProps = state => ({
  fileId: getCurrentFileId(state),
  currentFolderId: getCurrentFolderId(state)
})

export default connect(mapStateToProps)(FilesViewerWithQuery)

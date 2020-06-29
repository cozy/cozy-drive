import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildSharingsQuery } from 'drive/web/modules/queries'
import {
  getCurrentFileId,
  getCurrentFolderId
} from 'drive/web/modules/selectors'
import { connect } from 'react-redux'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewerV2'
import withSharedDocumentIds from './withSharedDocumentIds'

const FilesViewerWithQuery = ({
  sharedDocumentIds,
  currentFolderId,
  ...props
}) => {
  const filesQuery = buildSharingsQuery(sharedDocumentIds)
  const results = useQuery(filesQuery.definition, filesQuery.options)
  const { router } = useRouter()
  if (results.data) {
    const viewableFiles = results.data.filter(f => f.type !== 'directory')
    const basePath = currentFolderId
      ? `/sharings/${currentFolderId}`
      : '/sharings'
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={results}
        onClose={() => router.push(basePath)}
        onChange={fileId =>
          router.push({
            pathname: `${basePath}/file/${fileId}`
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

const FilesViewerWithFolderId = connect(mapStateToProps)(FilesViewerWithQuery)

export default withSharedDocumentIds(FilesViewerWithFolderId)

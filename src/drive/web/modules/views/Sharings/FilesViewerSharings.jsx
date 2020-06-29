import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildSharingsQuery } from 'drive/web/modules/queries'
import { getCurrentFileId } from 'drive/web/modules/selectors'
import { connect } from 'react-redux'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewerV2'
import withSharedDocumentIds from './withSharedDocumentIds'

const FilesViewerWithQuery = ({ sharedDocumentIds, ...props }) => {
  const filesQuery = buildSharingsQuery(sharedDocumentIds)
  const results = useQuery(filesQuery.definition, filesQuery.options)
  const { router } = useRouter()
  if (results.data) {
    const viewableFiles = results.data.filter(f => f.type !== 'directory')
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={results}
        onClose={() => router.push('/sharings')}
        onChange={fileId =>
          router.push({
            pathname: '/sharings/file/' + fileId
          })
        }
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

const mapStateToProps = state => ({
  fileId: getCurrentFileId(state)
})

const FilesViewerWithFolderId = connect(mapStateToProps)(FilesViewerWithQuery)

export default withSharedDocumentIds(FilesViewerWithFolderId)

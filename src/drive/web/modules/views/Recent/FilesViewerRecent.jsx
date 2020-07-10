import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildRecentQuery } from 'drive/web/modules/queries'
import { getCurrentFileId } from 'drive/web/modules/selectors'
import { connect } from 'react-redux'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewer'
const FilesViewerWithQuery = props => {
  const filesQuery = buildRecentQuery()
  const results = useQuery(filesQuery.definition, filesQuery.options)
  const { router } = useRouter()
  if (results.data) {
    const viewableFiles = results.data
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={results}
        onClose={() => router.push('/recent')}
        onChange={fileId =>
          router.push({
            pathname: '/recent/file/' + fileId
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

export default connect(mapStateToProps)(FilesViewerWithQuery)

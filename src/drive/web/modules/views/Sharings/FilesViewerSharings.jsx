import React from 'react'
import { useQuery } from 'cozy-client'
import { useRouter } from 'drive/lib/RouterContext'
import { buildSharingsQuery } from 'drive/web/modules/queries'
import { useCurrentFolderId } from 'drive/web/modules/selectors'
import FilesViewer, {
  FilesViewerLoading
} from 'drive/web/modules/viewer/FilesViewer'
import withSharedDocumentIds from './withSharedDocumentIds'

const FilesViewerWithQuery = ({ sharedDocumentIds, ...props }) => {
  const currentFolderId = useCurrentFolderId()
  const filesQuery = buildSharingsQuery({ ids: sharedDocumentIds })
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

export default withSharedDocumentIds(FilesViewerWithQuery)

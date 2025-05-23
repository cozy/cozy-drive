import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import withSharedDocumentIds from './withSharedDocumentIds'

import { FilesViewerLoading } from '@/components/FilesViewerLoading'
import { useCurrentFolderId } from '@/hooks'
import FilesViewer from '@/modules/viewer/FilesViewer'
import { buildSharingsQuery } from '@/queries'

const FilesViewerSharing = ({ sharedDocumentIds }) => {
  const currentFolderId = useCurrentFolderId()
  const filesQuery = buildSharingsQuery({ ids: sharedDocumentIds })
  const results = useQuery(filesQuery.definition, filesQuery.options)
  const navigate = useNavigate()

  if (results.data) {
    const viewableFiles = results.data.filter(f => f.type !== 'directory')
    const basePath = currentFolderId
      ? `/sharings/${currentFolderId}`
      : '/sharings'
    return (
      <FilesViewer
        files={viewableFiles}
        filesQuery={results}
        onClose={() => navigate(basePath)}
        onChange={fileId => navigate(`${basePath}/file/${fileId}`)}
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

export default withSharedDocumentIds(FilesViewerSharing)

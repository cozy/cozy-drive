import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { buildRecentQuery } from 'modules/queries'
import FilesViewer, { FilesViewerLoading } from 'modules/viewer/FilesViewer'

const FilesViewerWithQuery = props => {
  const filesQuery = buildRecentQuery()
  const results = useQuery(filesQuery.definition, filesQuery.options)
  const navigate = useNavigate()

  if (results.data) {
    const viewableFiles = results.data
    return (
      <FilesViewer
        {...props}
        files={viewableFiles}
        filesQuery={results}
        onClose={() => navigate('/recent')}
        onChange={fileId => navigate(`/recent/file/${fileId}`)}
      />
    )
  } else {
    return <FilesViewerLoading />
  }
}

export default FilesViewerWithQuery

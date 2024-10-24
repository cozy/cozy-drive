import { useCurrentFolderId } from 'hooks'
import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'

import { FilesViewerLoading } from 'components/FilesViewerLoading'
import PublicViewer from 'modules/viewer/PublicViewer'
import usePublicFilesQuery from 'modules/views/Public/usePublicFilesQuery'

const PublicFileViewer = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()

  const currentFolderId = useCurrentFolderId()

  const filesResult = usePublicFilesQuery(currentFolderId)
  const files = filesResult.data

  const currentIndex = useMemo(() => {
    return files.findIndex(f => f.id === fileId)
  }, [files, fileId])
  const hasCurrentIndex = useMemo(() => currentIndex != -1, [currentIndex])
  const viewerIndex = useMemo(
    () => (hasCurrentIndex ? currentIndex : 0),
    [hasCurrentIndex, currentIndex]
  )

  const viewableFiles = files.filter(f => f.type !== 'directory')

  const handleChange = ({ _id }) => {
    navigate(`../${_id}`, {
      relative: 'path'
    })
  }

  const handleClose = () => {
    navigate('..')
  }

  // If we can't find the file, we fallback to the (potentially loading)
  // direct stat made by the viewer
  if (currentIndex === -1) {
    return <FilesViewerLoading />
  }

  return (
    <PublicViewer
      files={viewableFiles}
      currentIndex={viewerIndex}
      onChangeRequest={handleChange}
      onCloseRequest={handleClose}
    >
      <FooterActionButtons>
        <ForwardOrDownloadButton />
      </FooterActionButtons>
    </PublicViewer>
  )
}

export { PublicFileViewer }

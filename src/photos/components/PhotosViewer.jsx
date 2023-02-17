import React, { useMemo } from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryAll } from 'cozy-client'
import { buildTimelineQuery } from '../queries/queries'

const PhotosViewer = () => {
  const navigate = useNavigate()
  let { photoId } = useParams()

  const timelineQuery = buildTimelineQuery()

  const results = useQueryAll(timelineQuery.definition, timelineQuery.options)
  const photos = results.data

  const currentIndex = useMemo(
    () => (photos ? photos.findIndex(p => p.id === photoId) : 0),
    [photos, photoId]
  )

  if (results.fetchStatus != 'loaded') return null

  return (
    <Overlay>
      <Viewer
        files={photos}
        currentIndex={currentIndex}
        onChangeRequest={nextPhoto => navigate(`../${nextPhoto.id}`)}
        onCloseRequest={() => navigate('..')}
      >
        <FooterActionButtons>
          <SharingButton />
          <ForwardOrDownloadButton />
        </FooterActionButtons>
      </Viewer>
    </Overlay>
  )
}

export default PhotosViewer

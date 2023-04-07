import React, { useMemo } from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'cozy-client'
import { buildTimelineQuery, buildAlbumsQuery } from '../queries/queries'

export const TimelinePhotosViewer = () => {
  const timelineQuery = buildTimelineQuery()

  const results = useQuery(timelineQuery.definition, timelineQuery.options)

  if (results.fetchStatus != 'loaded') return null

  return <PhotosViewer photos={results.data} />
}

export const AlbumPhotosViewer = () => {
  const { albumId } = useParams()
  const albumsQuery = buildAlbumsQuery(albumId)

  const results = useQuery(albumsQuery.definition, albumsQuery.options)

  if (results.fetchStatus != 'loaded') return null

  return <PhotosViewer photos={results.data.photos.data} />
}

const PhotosViewer = ({ photos }) => {
  const navigate = useNavigate()
  let { photoId } = useParams()

  const currentIndex = useMemo(
    () => (photos ? photos.findIndex(p => p.id === photoId) : 0),
    [photos, photoId]
  )

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

import React from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
import { useNavigate, useLocation } from 'react-router-dom'

const getParentPath = url => {
  return url.substring(0, url.lastIndexOf('/'))
}

const PhotosViewer = ({ photos, params }) => {
  const navigate = useNavigate()
  const { query, pathname } = useLocation()
  const currentIndex = photos.findIndex(p => p.id === params.photoId)

  return (
    <Overlay>
      <Viewer
        files={photos}
        currentIndex={currentIndex}
        onChangeRequest={nextPhoto =>
          navigate.push({
            pathname: `${getParentPath(pathname)}/${nextPhoto.id}`,
            query
          })
        }
        onCloseRequest={() =>
          navigate.push({
            pathname: getParentPath(pathname),
            query
          })
        }
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

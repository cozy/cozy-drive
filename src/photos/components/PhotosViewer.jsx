import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class PhotosViewer extends Component {
  render() {
    const { photos, params, router } = this.props
    const currentIndex = photos.findIndex(p => p.id === params.photoId)
    return (
      <Overlay>
        <Viewer
          files={photos}
          currentIndex={currentIndex}
          onChangeRequest={nextPhoto =>
            router.push({
              pathname: `${getParentPath(router)}/${nextPhoto.id}`,
              query: router.location.query
            })
          }
          onCloseRequest={() =>
            router.push({
              pathname: getParentPath(router),
              query: router.location.query
            })
          }
        />
      </Overlay>
    )
  }
}

export default withRouter(PhotosViewer)

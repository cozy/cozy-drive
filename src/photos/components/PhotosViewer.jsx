import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Overlay } from 'cozy-ui/transpiled/react'
import Viewer from 'viewer'

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
          onChange={nextPhoto =>
            router.push({
              pathname: `${getParentPath(router)}/${nextPhoto.id}`,
              query: router.location.query
            })
          }
          onClose={() =>
            router.push({
              pathname: getParentPath(router),
              query: router.location.query
            })
          }
          {...this.props}
        />
      </Overlay>
    )
  }
}

export default withRouter(PhotosViewer)

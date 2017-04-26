import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchAlbumPhotosStatsById } from '../ducks/albums'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'

export class AlbumPhotos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      photosAreDirty: false
    }
  }

  render () {
    const { router, onFetchAlbumPhotos, album } = this.props
    const albumId = router.params.albumId
    return (
      <div>
        {album.name &&
          <Topbar viewName='albumContent' albumName={album.name} />
        }
        <PhotoBoard
          fetchPhotoLists={() => onFetchAlbumPhotos(albumId)}
          photosContext='album'
        />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  album: state.albums.currentAlbum
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchAlbumPhotos: (albumId) => {
    return dispatch(fetchAlbumPhotosStatsById(albumId))
      .then(photos => {
        return photos.length ? [{photos}] : []
      })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AlbumPhotos))

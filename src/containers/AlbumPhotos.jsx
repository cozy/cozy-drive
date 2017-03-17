import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchAlbumPhotosStatsById } from '../actions/albums'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'

export class AlbumPhotos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      photosAreDirty: false
    }
  }

  componentWillUpdate (nextProps, nextState) {
    this.state.photosAreDirty = nextProps.photos &&
      nextProps.photos.length !== this.props.photos.length
  }

  render () {
    const { router, onFetchAlbumPhotos, album } = this.props
    const { photosAreDirty } = this.state
    const albumId = router.params.albumId
    return (
      <div>
        {album.name &&
          <Topbar viewName='albumContent' albumName={album.name} />
        }
        <PhotoBoard
          fetchPhotoLists={() => onFetchAlbumPhotos(albumId)}
          refetch={photosAreDirty}
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
      .then(photos => [{photos: photos}])
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AlbumPhotos))

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchAlbumPhotosStatsById } from '../ducks/albums'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'

export class AlbumPhotos extends Component {
  componentWillMount () {
    this.props.fetchAlbumPhotos(this.props.router.params.albumId)
  }

  render () {
    const { album, photoLists } = this.props
    return (
      <div>
        {album.name &&
          <Topbar viewName='albumContent' albumName={album.name} />
        }
        <PhotoBoard
          photoLists={photoLists}
          photosContext='album'
        />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  album: state.albums.currentAlbum,
  photoLists: [{ photos: state.albums.photos }]
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbumPhotos: (albumId) => dispatch(fetchAlbumPhotosStatsById(albumId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AlbumPhotos))

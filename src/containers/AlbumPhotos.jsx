import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { AlbumPhotoToolbar, getAlbum, getAlbumPhotos, fetchAlbums, fetchAlbumPhotos } from '../ducks/albums'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'

export class AlbumPhotos extends Component {
  componentWillMount () {
    if (!this.props.album) {
      this.props.fetchAlbums()
        .then(() => this.props.fetchPhotos(this.props.router.params.albumId))
    } else {
      this.props.fetchPhotos(this.props.router.params.albumId)
    }
  }

  render () {
    if (!this.props.album) {
      return null
    }
    const { album, photos, fetchPhotos } = this.props
    return (
      <div>
        {album.name &&
          <Topbar viewName='albumContent' albumName={album.name}>
            <AlbumPhotoToolbar album={album} />
          </Topbar>
        }
        {photos &&
          <PhotoBoard
            photoLists={[{ photos: photos.entries }]}
            fetchStatus={photos.fetchStatus}
            hasMore={photos.hasMore}
            photosContext='album'
            onFetchMore={() => fetchPhotos(album._id, photos.entries.length)}
          />
        }
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  album: getAlbum(state, ownProps.router.params.albumId),
  photos: getAlbumPhotos(state, ownProps.router.params.albumId)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbums: () => dispatch(fetchAlbums()),
  fetchPhotos: (albumId, skip) => dispatch(fetchAlbumPhotos(albumId, skip))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AlbumPhotos))

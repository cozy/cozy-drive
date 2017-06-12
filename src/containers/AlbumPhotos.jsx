import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styles from '../styles/layout'

import { AlbumToolbar, getAlbum, getAlbumPhotos, fetchAlbums, fetchAlbumPhotos, updateAlbum } from '../ducks/albums'

import BoardView from './BoardView'
import Topbar from '../components/Topbar'
import Alerter from '../components/Alerter'

export class AlbumPhotos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
  }

  componentWillMount () {
    if (!this.props.album) {
      this.props.fetchAlbums()
        .then(() => this.props.fetchPhotos(this.props.router.params.albumId))
    } else {
      this.props.fetchPhotos(this.props.router.params.albumId)
    }
  }

  editAlbumName () {
    this.setState({editing: true})
  }

  renameAlbum (name) {
    if (name.trim() === '') {
      Alerter.error('Error.album_rename_abort')
      return
    } else if (name === this.props.album.name) {
      this.setState({editing: false})
      return
    }

    let updatedAlbum = { ...this.props.album, name: name }
    this.props.updateAlbum(updatedAlbum)
      .then(() => {
        this.setState({editing: false})
      })
      .catch(() => {
        Alerter.error('Error.generic')
      })
  }

  render () {
    if (!this.props.album) {
      return null
    }
    const { album, photos, fetchPhotos } = this.props
    const { editing } = this.state
    return (
      <div className={styles['pho-content-wrapper']}>
        {album.name &&
          <Topbar viewName='albumContent' albumName={album.name} editing={editing} onEdit={this.renameAlbum.bind(this)} >
            <AlbumToolbar album={album} onRename={this.editAlbumName.bind(this)} />
          </Topbar>
        }
        {photos &&
          <BoardView
            photoLists={[{ photos: photos.entries }]}
            fetchStatus={photos.fetchStatus}
            hasMore={photos.hasMore}
            photosContext='album'
            onFetchMore={() => fetchPhotos(album._id, photos.entries.length)}
          />
        }
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.props.photos.entries
    }))
  }
}

const mapStateToProps = (state, ownProps) => ({
  album: getAlbum(state, ownProps.router.params.albumId),
  photos: getAlbumPhotos(state, ownProps.router.params.albumId)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbums: () => dispatch(fetchAlbums()),
  fetchPhotos: (albumId, skip) => dispatch(fetchAlbumPhotos(albumId, skip)),
  updateAlbum: (album) => dispatch(updateAlbum(album))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AlbumPhotos))

import React, { Component } from 'react'
import { cozyConnect } from '../lib/redux-cozy-client'
import { withRouter } from 'react-router'
import styles from '../styles/layout'

import { AlbumToolbar, fetchAlbum, fetchAlbumPhotos, updateAlbum } from '../ducks/albums'
import { hideSelectionBar } from '../ducks/selection'
import { withSharings, SHARED_WITH_ME } from '../ducks/sharing'

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

  editAlbumName () {
    this.setState({ editing: true })
  }

  renameAlbum (name) {
    if (name.trim() === '') {
      Alerter.error('Error.album_rename_abort')
      return
    } else if (name === this.props.album.name) {
      this.setState({ editing: false })
      return
    }

    let updatedAlbum = { ...this.props.album, name: name }
    this.props.updateAlbum(updatedAlbum)
      .then(() => {
        this.setState({ editing: false })
      })
      .catch(() => {
        Alerter.error('Error.generic')
      })
  }

  render () {
    if (!this.props.album) {
      return null
    }
    const { album, photos, sharedWithMe } = this.props
    const { editing } = this.state

    return (
      <div className={styles['pho-content-wrapper']}>
        {(album.name && photos.data) &&
          <Topbar viewName='albumContent' albumName={album.name} editing={editing} onEdit={this.renameAlbum.bind(this)} >
            <AlbumToolbar album={album} readOnly={sharedWithMe.length > 0} photos={photos.data} onRename={this.editAlbumName.bind(this)} />
          </Topbar>
        }
        {photos.data &&
          <BoardView
            album={album}
            photos={photos}
            photoLists={[{ photos: photos.data }]}
            photosContext='album'
            readOnly={sharedWithMe.length > 0}
          />
        }
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.props.photos.data
    }))
  }

  componentWillUnmount () {
    this.props.clearSelection()
  }
}

const mapDocumentsToProps = (ownProps) => ({
  album: fetchAlbum(ownProps.router.params.albumId),
  // TODO: not ideal, but we'll have to wait after associations are implemented
  photos: fetchAlbumPhotos({ type: 'io.cozy.photos.albums', id: ownProps.router.params.albumId })
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  updateAlbum: (album) => dispatch(updateAlbum(album)),
  clearSelection: () => dispatch(hideSelectionBar())
})

export default cozyConnect(
  mapDocumentsToProps,
  mapDispatchToProps
)(withRouter(withSharings(AlbumPhotos, 'album', 'io.cozy.photos.albums', [SHARED_WITH_ME])))

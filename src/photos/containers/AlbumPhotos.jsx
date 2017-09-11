import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cozyConnect, isSharedWithMe, isSharedByMe, getSharingDetails } from 'redux-cozy-client'
import { withRouter } from 'react-router'
import styles from '../styles/layout'

import { AlbumToolbar, fetchAlbum, fetchAlbumPhotos, fetchAlbumSharing, updateAlbum } from '../ducks/albums'
import { hideSelectionBar } from '../ducks/selection'

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
    if (!this.props.album || !this.props.sharing) {
      return null
    }
    const { album, photos, sharedWithMe, sharedByMe, sharing } = this.props
    const { editing } = this.state

    return (
      <div className={styles['pho-content-wrapper']}>
        {(album.name && photos.data) &&
          <Topbar viewName='albumContent' albumName={album.name} editing={editing} onEdit={this.renameAlbum.bind(this)} >
            <AlbumToolbar
              album={album}
              sharedWithMe={sharedWithMe}
              sharedByMe={sharedByMe}
              sharing={sharing}
              photos={photos.data}
              onRename={this.editAlbumName.bind(this)}
            />
          </Topbar>
        }
        {photos.data &&
          <BoardView
            album={album}
            photos={photos}
            photoLists={[{ photos: photos.data }]}
            photosContext='album'
            readOnly={sharedWithMe}
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

const mapStateToProps = (state, ownProps) => ownProps.album
  ? {
    sharedWithMe: isSharedWithMe(state, ownProps.album),
    sharedByMe: isSharedByMe(state, ownProps.album),
    sharing: getSharingDetails(state, ownProps.album)
  }
  : {}

const mapDocumentsToProps = (ownProps) => ({
  album: fetchAlbum(ownProps.router.params.albumId),
  // TODO: not ideal, but we'll have to wait after associations are implemented
  photos: fetchAlbumPhotos(ownProps.router.params.albumId),
  sharingStatus: fetchAlbumSharing(ownProps.router.params.albumId)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  updateAlbum: (album) => dispatch(updateAlbum(album)),
  clearSelection: () => dispatch(hideSelectionBar())
})

export default cozyConnect(
  mapDocumentsToProps,
  mapDispatchToProps
)(connect(mapStateToProps)(withRouter(AlbumPhotos)))

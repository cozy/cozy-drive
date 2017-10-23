import React, { Component } from 'react'
import { cozyConnect } from 'cozy-client'
import { withRouter } from 'react-router'
import styles from '../styles/layout'

import {
  AlbumToolbar,
  fetchAlbum,
  fetchAlbumPhotos,
  fetchAlbumSharings,
  updateAlbum
} from '../ducks/albums'
import { hideSelectionBar } from '../ducks/selection'

import BoardView from './BoardView'
import Topbar from '../components/Topbar'
import Alerter from '../components/Alerter'

export class AlbumPhotos extends Component {
  state = {
    editing: false
  }

  editAlbumName = () => {
    this.setState({ editing: true })
  }

  renameAlbum = name => {
    if (name.trim() === '') {
      Alerter.error('Error.album_rename_abort')
      return
    } else if (name === this.props.album.name) {
      this.setState({ editing: false })
      return
    }

    let updatedAlbum = { ...this.props.album, name: name }
    this.props
      .updateAlbum(updatedAlbum)
      .then(() => {
        this.setState({ editing: false })
      })
      .catch(() => {
        Alerter.error('Error.generic')
      })
  }

  render() {
    if (!this.props.album || !this.props.shared) {
      return null
    }
    const { album, photos, shared } = this.props
    const { editing } = this.state
    return (
      <div className={styles['pho-content-wrapper']}>
        {album.name &&
          photos.data && (
            <Topbar
              viewName="albumContent"
              albumName={album.name}
              editing={editing}
              onEdit={this.renameAlbum}
            >
              <AlbumToolbar
                album={album}
                sharedWithMe={shared.withMe}
                sharedByMe={shared.byMe}
                readOnly={shared.readOnly}
                photos={photos.data}
                onRename={this.editAlbumName}
              />
            </Topbar>
          )}
        {photos.data && (
          <BoardView
            album={album}
            photos={photos}
            photoLists={[{ photos: photos.data }]}
            photosContext="album"
            readOnly={shared.readOnly}
          />
        )}
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer(children) {
    if (!children) return null
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        photos: this.props.photos.data
      })
    )
  }

  componentWillUnmount() {
    this.props.clearSelection()
  }
}

const mapDocumentsToProps = ownProps => ({
  album: fetchAlbum(ownProps.router.params.albumId),
  // TODO: not ideal, but we'll have to wait after associations are implemented
  photos: fetchAlbumPhotos(ownProps.router.params.albumId),
  shared: fetchAlbumSharings(ownProps.router.params.albumId)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  updateAlbum: album => dispatch(updateAlbum(album)),
  clearSelection: () => dispatch(hideSelectionBar())
})

export default cozyConnect(mapDocumentsToProps, mapDispatchToProps)(
  withRouter(AlbumPhotos)
)

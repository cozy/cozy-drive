import React, { Component } from 'react'
import styles from '../../../styles/layout'
import Topbar from '../../../components/Topbar'
import Toolbar from './Toolbar'
import DeleteConfirm from './DeleteConfirm'
import confirm from '../../../lib/confirm'
import PhotoBoard from '../../../components/PhotoBoard'

import { addToUploadQueue } from '../../upload'
import { AddToAlbumModal, belongsToAlbums } from '../../albums'
import Selection from '../../selection'

export default class Timeline extends Component {
  state = {
    showAddAlbumModal: false
  }

  showAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: true }))
  }
  hideAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: false }))
  }

  uploadPhotos = photos => {
    const { uploadPhoto } = this.props
    this.dispatch(
      addToUploadQueue(photos, photo =>
        uploadPhoto(photo, this.context.t('UploadQueue.path'))
      )
    )
  }

  downloadPhotos = photos => {
    this.context.client
      .collection('io.cozy.files')
      .downloadArchive(photos.map(({ _id }) => _id), 'selected')
  }

  deletePhotos = (selected, clearSelection) =>
    confirm(
      <DeleteConfirm
        t={this.context.t}
        count={selected.length}
        related={belongsToAlbums(selected)}
      />,
      () =>
        Promise.all(selected.map(p => this.props.deletePhoto(p))).then(
          clearSelection
        )
    )

  dispatch(action) {
    return this.context.store.dispatch(action)
  }

  render() {
    const { lists, fetchStatus, hasMore, fetchMore } = this.props
    return (
      <Selection
        actions={selection => ({
          'album-add': this.showAddAlbumModal,
          download: this.downloadPhotos,
          delete: selected => this.deletePhotos(selected, selection.clear)
        })}
      >
        {(selected, active, selection) => (
          <div className={styles['pho-content-wrapper']}>
            <Topbar viewName="photos">
              <Toolbar
                disabled={active}
                uploadPhotos={this.uploadPhotos}
                selectItems={selection.show}
              />
            </Topbar>
            <div role="contentinfo">
              {this.state.showAddAlbumModal && (
                <AddToAlbumModal
                  onDismiss={this.hideAddAlbumModal}
                  photos={selected}
                />
              )}
              <PhotoBoard
                lists={lists}
                selected={selected}
                photosContext="timeline"
                showSelection={active}
                onPhotoToggle={selection.toggle}
                onPhotosSelect={selection.select}
                onPhotosUnselect={selection.unselect}
                fetchStatus={fetchStatus}
                hasMore={hasMore}
                fetchMore={fetchMore}
              />
            </div>
            {this.renderViewer(this.props.children)}
          </div>
        )}
      </Selection>
    )
  }

  renderViewer(children) {
    if (!children) return null
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        photos: this.props.data || []
      })
    )
  }
}

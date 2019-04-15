import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import PropTypes from 'prop-types'
import styles from '../../../styles/layout'

import { Content } from 'cozy-ui/react/Layout'
import Topbar from '../../../components/Topbar'
import Toolbar from './Toolbar'
import DeleteConfirm from './DeleteConfirm'
import confirm from '../../../lib/confirm'
import PhotoBoard from '../../../components/PhotoBoard'

import { addToUploadQueue } from '../../upload'
import { AddToAlbumModal, belongsToAlbums } from '../../albums'
import Selection from '../../selection'

import {
  getReferencedFolders,
  getOrCreateFolderWithReference,
  REF_PHOTOS,
  REF_UPLOAD
} from 'folder-references'

const getUploadDir = async (client, t) => {
  const referencedFolders = await getReferencedFolders(client, REF_UPLOAD)

  if (referencedFolders.length > 0) {
    return referencedFolders[0]._id
  } else {
    await getOrCreateFolderWithReference(
      client,
      `/${t('UploadQueue.path_photos')}`,
      REF_PHOTOS
    )
    const uploadDir = await getOrCreateFolderWithReference(
      client,
      `/${t('UploadQueue.path_photos')}/${t('UploadQueue.path_upload')}`,
      REF_UPLOAD
    )

    return uploadDir._id
  }
}

class Timeline extends Component {
  state = {
    showAddAlbumModal: false
  }
  static contextTypes = {
    t: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  showAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: true }))
  }
  hideAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: false }))
  }

  uploadPhotos = async photos => {
    const { uploadPhoto } = this.props
    const { client, t } = this.context
    const uploadDirId = await getUploadDir(client, t)

    this.dispatch(
      addToUploadQueue(photos, photo => uploadPhoto(photo, uploadDirId))
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
    const { t, lists, fetchStatus, hasMore, fetchMore } = this.props
    return (
      <Selection
        actions={selection => ({
          'album-add': this.showAddAlbumModal,
          download: this.downloadPhotos,
          delete: selected => this.deletePhotos(selected, selection.clear)
        })}
      >
        {(selected, active, selection) => (
          <div
            data-test-id="timeline-pho-content-wrapper"
            className={styles['pho-content-wrapper']}
          >
            <Topbar viewName="photos">
              <Toolbar
                disabled={active}
                uploadPhotos={this.uploadPhotos}
                selectItems={selection.show}
                t={t}
              />
            </Topbar>
            <Content>
              {this.state.showAddAlbumModal && (
                <AddToAlbumModal
                  onDismiss={this.hideAddAlbumModal}
                  onSuccess={selection.clear}
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
            </Content>
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

export default translate()(Timeline)

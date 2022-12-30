import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Outlet, useNavigate } from 'react-router-dom'

import { withClient } from 'cozy-client'
import { showModal } from 'react-cozy-helpers'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { ShareModal } from 'cozy-sharing'
import flow from 'lodash/flow'

import styles from '../../../styles/layout.styl'

import AlbumToolbar from './AlbumToolbar'
import { AddToAlbumModal } from '..'

import PhotoBoard from 'photos/components/PhotoBoard'
import Topbar from 'photos/components/Topbar'
import DestroyConfirm from 'photos/components/DestroyConfirm'
import Selection from '../../selection'

class AlbumPhotos extends Component {
  state = {
    editing: false,
    showAddAlbumModal: false
  }

  showAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: true }))
  }
  hideAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: false }))
  }
  editAlbumName = () => {
    this.setState(state => ({ ...state, editing: true }))
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
      // TODO: fix me
      // eslint-disable-next-line promise/always-return
      .then(() => {
        this.setState({ editing: false })
      })
      .catch(() => {
        Alerter.error('Error.generic')
      })
  }
  // !TODO Hack. We should not use 99999 as limit.
  downloadAlbum = async () => {
    const { album } = this.props
    const allPhotos = await this.props.client
      .getStackClient()
      .collection('io.cozy.files')
      .findReferencedBy(
        {
          _type: 'io.cozy.photos.albums',
          _id: album.id
        },
        { limit: 99999 }
      )
    this.props.client.collection('io.cozy.files').downloadArchive(
      allPhotos.data.map(({ _id }) => _id),
      album.name
    )
  }

  downloadPhotos = photos => {
    this.props.client.collection('io.cozy.files').downloadArchive(
      photos.map(({ _id }) => _id),
      'selected'
    )
  }
  closeDestroyConfirmModal = () => {
    this.setState({
      displayDestroyConfirmModal: false
    })
  }
  renderDestroyConfirm = () => {
    const { t, navigate, album, deleteAlbum } = this.props

    return (
      <DestroyConfirm
        t={t}
        albumName={album.name}
        onClose={this.closeDestroyConfirmModal}
        confirm={() =>
          deleteAlbum(album)
            // TODO: fix me
            // eslint-disable-next-line promise/always-return
            .then(() => {
              navigate('/albums')
              Alerter.success('Albums.remove_album.success', {
                name: album.name
              })
            })
            .catch(() => Alerter.error('Albums.remove_album.error.generic'))
        }
      />
    )
  }
  deleteAlbum = () => {
    this.setState({
      displayDestroyConfirmModal: true
    })
  }

  render() {
    if (!this.props.album || !this.props.photos) {
      return null
    }

    const { t, album, shareAlbum, photos, hasMore, fetchMore, lastFetch } =
      this.props
    const { editing } = this.state
    const shared = {}

    return (
      <Selection
        actions={selection => ({
          'album-add': this.showAddAlbumModal,
          download: this.downloadPhotos,
          'album-remove': selected =>
            this.props.removePhotos(album, selected, selection.clear)
        })}
      >
        {(selected, active, selection) => (
          <div
            data-testid="album-pho-content-wrapper"
            className={styles['pho-content-wrapper']}
          >
            {album.name && album.photos.data && (
              <Topbar
                viewName="albumContent"
                albumName={album.name}
                editing={editing}
                onEdit={this.renameAlbum}
              >
                <AlbumToolbar
                  t={t}
                  album={album}
                  sharedWithMe={shared.withMe}
                  sharedByMe={shared.byMe}
                  readOnly={shared.readOnly}
                  onRename={this.editAlbumName}
                  downloadAlbum={this.downloadAlbum}
                  deleteAlbum={this.deleteAlbum}
                  shareAlbum={shareAlbum}
                />
              </Topbar>
            )}
            {this.state.displayDestroyConfirmModal &&
              this.renderDestroyConfirm()}
            {this.state.showAddAlbumModal && (
              <AddToAlbumModal
                onDismiss={this.hideAddAlbumModal}
                onSuccess={selection.clear}
                photos={selected}
              />
            )}
            {photos && (
              <PhotoBoard
                lists={[{ photos }]}
                selected={selected}
                photosContext="timeline"
                showSelection={active}
                onPhotoToggle={selection.toggle}
                onPhotosSelect={selection.select}
                onPhotosUnselect={selection.unselect}
                fetchStatus={photos.fetchStatus}
                hasMore={hasMore}
                fetchMore={fetchMore}
                lastFetch={lastFetch}
              />
            )}
            <Outlet />
          </div>
        )}
      </Selection>
    )
  }

  componentWillUnmount() {
    if (this.props.selection !== undefined) {
      this.props.selection.clear()
    }
  }
}

const mapDispatchToProps = dispatch => ({
  shareAlbum: album =>
    dispatch(
      showModal(<ShareModal document={album} sharingDesc={album.name} />)
    )
})

AlbumPhotos.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired,
  album: PropTypes.object.isRequired,
  shareAlbum: PropTypes.func,
  photos: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  lastFetch: PropTypes.number
}

const AlbumPhotosWrapper = props => {
  const navigate = useNavigate()
  return <AlbumPhotos {...props} navigate={navigate} />
}

export default flow(
  connect(null, mapDispatchToProps),
  withClient,
  translate()
)(AlbumPhotosWrapper)

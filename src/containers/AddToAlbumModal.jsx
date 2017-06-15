import styles from '../styles/addToAlbum'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalSection } from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'
import SelectAlbumsForm from '../components/SelectAlbumsForm'
import Loading from '../components/Loading'

import { getSelectedIds } from '../ducks/selection'

import {
  fetchAlbums,
  getAlbumsList,
  cancelAddToAlbum,
  closeAddToAlbum,
  createAlbum,
  addToAlbum }
from '../ducks/albums'

export class AddToAlbumModal extends Component {
  componentWillMount () {
    this.props.fetchAlbums()
  }

  render (props) {
    const {
      t,
      photos,
      albums,
      onDismiss,
      onSubmitNewAlbum,
      onSubmitSelectedAlbum
    } = props

    const { fetchingStatus } = props.albums ? props.albums : { fetchingStatus: 'loading' }
    const isFetchingAlbums = fetchingStatus === 'pending' || fetchingStatus === 'loading'

    return (
      <Modal
        title={t('Albums.add_photos.title')}
        secondaryAction={() => onDismiss()}
        >
        <ModalSection className={styles['coz-modal-section']}>
          <div className={classNames(styles['coz-create-album'])}>
            <CreateAlbumForm
              onSubmitNewAlbum={name => onSubmitNewAlbum(name, photos)}
              />
          </div>
          {
            isFetchingAlbums
            ? <Loading loadingType='albums_fetching' />
            : albums && albums.entries.length > 0
            ? <div className={classNames(styles['coz-select-album'])}>
              <SelectAlbumsForm albums={albums} onSubmitSelectedAlbum={album => onSubmitSelectedAlbum(album, photos)} />
            </div>
            : null
          }
        </ModalSection>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: getSelectedIds(state),
    albums: getAlbumsList(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  onSubmitNewAlbum: (name, photos) => {
    return dispatch(createAlbum(name, photos))
      .then(() => {
        dispatch(closeAddToAlbum())
        Alerter.success('Albums.create.success', {name: name, smart_count: photos.length})
      })
      .catch(error => Alerter.error(error.message, error.messageData))
  },
  onSubmitSelectedAlbum: (album, photos) => {
    return dispatch(addToAlbum(album, photos))
      .then(() => {
        dispatch(closeAddToAlbum())
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length})
      })
      .catch(error => Alerter.error(error.message, error.messageData))
  },
  fetchAlbums: () => dispatch(fetchAlbums())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

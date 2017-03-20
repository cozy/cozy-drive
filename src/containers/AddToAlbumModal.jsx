import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'

import { cancelAddToAlbum, createAlbum, addToAlbum } from '../actions/albums'

const AddToAlbumModal = ({t, mangoIndex, photos,
  onDismiss, onSubmitNewAlbum }) => {
  return (
    <Modal
      title={t('Albums.add_photos.title')}
      secondaryAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'], styles['coz-create-album'])}>
        <CreateAlbumForm
          onSubmitNewAlbum={(name) => onSubmitNewAlbum(name, mangoIndex, photos)}
          />
      </div>
    </Modal>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: state.ui.selected,
    mangoIndex: state.mango.albumsIndexByName
  }
}

const handleActionError = name => {
  return error => {
    const isUnexpectedError = !!error.message
    Alerter.error(isUnexpectedError ? 'Albums.add_photos.error.generic' : error, {name: name})
    return Promise.reject(error)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  // Removes photos parameter when we will be able to pick an album instead
  // of adding photo to the created one by default.
  onSubmitNewAlbum: (name, mangoIndex, photos) => {
    return dispatch(createAlbum(name, mangoIndex, photos))
      .then(
        album => {
          dispatch(addToAlbum(photos, album))
            .then(() => Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length}))
            .catch(handleActionError)
        },
        handleActionError(name)
      )
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

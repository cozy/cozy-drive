import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'

import { cancelAddToAlbum, createAlbum } from '../actions/albums'

const AddToAlbumModal = ({t, isCreating, mangoIndex, photos,
  onDismiss, onSubmitNewAlbum, albumCreationError, error }) => {
  if (error) {
    Alerter.error(error)
  }
  return (
    <Modal
      title={t('Albums.add_photos.title')}
      cancelAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'], styles['coz-create-album'])}>
        <CreateAlbumForm
          onSubmitNewAlbum={onSubmitNewAlbum(mangoIndex, photos)}
          hasError={albumCreationError}
          isBusy={isCreating}
          />
      </div>
    </Modal>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: state.ui.selected,
    isCreating: state.ui.isCreatingAlbum,
    albumCreationError: state.ui.albumCreationError,
    error: state.ui.albumCreationError || state.ui.addToAlbumError,
    mangoIndex: state.mango.albumsIndexByName
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  // Removes photos parameter when we will be able to pick an album instead
  // of adding photo to the created one by default.
  onSubmitNewAlbum: (mangoIndex, photos) =>
    (name) => {
      dispatch(createAlbum(name, mangoIndex, photos))
    }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

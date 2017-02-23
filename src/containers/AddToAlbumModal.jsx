import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'

import { cancelAddToAlbum, createAlbum } from '../actions/albums'

const AddToAlbumModal = ({t, visible, isCreating, mangoIndex,
  onDismiss, onSubmitNewAlbum, albumCreationError }) => {
  if (albumCreationError) {
    Alerter.error(albumCreationError)
  }
  return visible
    ? (<Modal
      title={t('Albums.add_photos.title')}
      cancelAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'], styles['coz-create-album'])}>
        <CreateAlbumForm
          onSubmitNewAlbum={onSubmitNewAlbum(mangoIndex)}
          hasError={albumCreationError}
          isBusy={isCreating}
          />
      </div>
    </Modal>)
    : null
}

const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.isAddingToAlbum,
    isCreating: state.ui.isCreatingAlbum,
    albumCreationError: state.ui.albumCreationError,
    mangoIndex: state.mango.albumsIndexByName
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  onSubmitNewAlbum: (mangoIndex) =>
    (name) => {
      dispatch(createAlbum(name, mangoIndex))
    }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

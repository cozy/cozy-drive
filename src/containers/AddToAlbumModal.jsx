import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'
import SelectAlbumsForm from '../components/SelectAlbumsForm'

import { cancelAddToAlbum, closeAddToAlbum, createAlbum, addToAlbum } from '../ducks/albums'

export const AddToAlbumModal = props => {
  const {
    t,
    photos,
    onDismiss,
    onSubmitNewAlbum,
    onSubmitSelectedAlbum
  } = props
  return (
    <Modal
      title={t('Albums.add_photos.title')}
      secondaryAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'])}>
        <div className={classNames(styles['coz-create-album'])}>
          <CreateAlbumForm
            onSubmitNewAlbum={name => onSubmitNewAlbum(name, photos)}
            />
        </div>
        <div className={classNames(styles['coz-select-album'])}>
          <SelectAlbumsForm onSubmitSelectedAlbum={album => onSubmitSelectedAlbum(album, photos)} />
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: state.ui.selected
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
        Alerter.success('Albums.add_photos.success', {name: name, smart_count: photos.length})
      })
  },
  onSubmitSelectedAlbum: (album, photos) => {
    return dispatch(addToAlbum(album, photos))
      .then(() => {
        dispatch(closeAddToAlbum())
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length})
      })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

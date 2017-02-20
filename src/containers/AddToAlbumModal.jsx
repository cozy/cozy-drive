import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/i18n'
import Modal from 'cozy-ui/react/Modal'

import { cancelAddToAlbum } from '../actions/albums'

const AddToAlbumModal = ({t, visible, onDismiss}) => {
  return visible
    ? (<Modal
      title={t('Albums.add_to_album_modal.title')}
      cancelAction={() => onDismiss()}
      >
      <div>Future content</div>
    </Modal>)
    : null
}

const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.isAddingToAlbum
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))

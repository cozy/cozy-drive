import React from 'react'
import { connect } from 'react-redux'

import { uploadPhotos } from '../actions'

const styles = {
  parent: {
    position: 'relative',
    overflow: 'hidden'
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  }
}

const UploadButton = ({ t, uploadPhotos }) => (
  <label
    role='button'
    className='coz-btn coz-btn--regular coz-btn--upload'
    style={styles.parent}
  >
    { t('Toolbar.photo_upload') }
    <input
      type='file'
      accept='image/*'
      multiple
      style={styles.input}
      onChange={e => {
        // e.target.files is an array-like, transform it to Array instance
        const photosArray = Array.from(e.target.files)
        uploadPhotos(photosArray)
      }} />
  </label>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadPhotos: (photo) => {
    dispatch(uploadPhotos(photo))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadButton)

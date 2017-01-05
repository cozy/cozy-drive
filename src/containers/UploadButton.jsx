import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { uploadFile } from '../actions'

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

const UploadButton = ({ t, uploadFile }) => (
  <label
    role='button'
    className='coz-btn coz-btn--regular coz-btn--upload'
    style={styles.parent}
  >
    { t('toolbar.item_upload') }
    <input type='file' style={styles.input} onChange={e => uploadFile(e.target.files[0])} />
  </label>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFile: (file) => {
    dispatch(uploadFile(file))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(UploadButton))

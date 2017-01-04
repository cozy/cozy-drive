import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { uploadFile } from '../actions'

const styles = {
  parent: {
    position: 'relative',
    display: 'inline-block'
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  button: {
    position: 'relative',
    zIndex: -1,
    cursor: 'pointer'
  }
}

const UploadButton = ({ t, uploadFile }) => (
  <div style={styles.parent}>
    <input type='file' style={styles.input} onChange={e => uploadFile(e.target.files[0])} />
    <button
      role='button'
      className='coz-btn coz-btn--regular coz-btn--upload'
      style={styles.button}
    >
      { t('toolbar.item_upload') }
    </button>
  </div>
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

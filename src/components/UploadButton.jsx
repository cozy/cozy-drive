import React from 'react'
import { translate } from '../lib/I18n'

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

export const UploadButton = ({ t, disabled, onUpload }) => (
  <label
    role='button'
    disabled={disabled}
    className='coz-btn coz-btn--regular coz-btn--upload'
    style={styles.parent}
  >
    { t('Toolbar.photo_upload') }
    <input
      type='file'
      accept='image/*'
      multiple
      disabled={disabled}
      style={styles.input}
      onChange={e => {
        // e.target.files is an array-like, transform it to Array instance
        const photosArray = Array.from(e.target.files)
        onUpload(photosArray)
      }} />
  </label>
)

export default translate()(UploadButton)

import React from 'react'
import classNames from 'classnames'
import UploadButton from 'drive/web/modules/upload/UploadButton'
import { translate } from 'cozy-ui/transpiled/react'
import styles from 'drive/styles/toolbar.styl'
import { compose } from 'redux'

import toolbarContainer from '../toolbar'

const UploadButtonItem = ({ t, displayedFolder, isDisabled, onUploaded }) => (
  <UploadButton
    disabled={isDisabled}
    displayedFolder={displayedFolder}
    label={t('toolbar.item_upload')}
    className={classNames(styles['c-btn'], 'u-hide--mob')}
    onUploaded={onUploaded}
  />
)

export default compose(
  toolbarContainer,
  translate()
)(UploadButtonItem)

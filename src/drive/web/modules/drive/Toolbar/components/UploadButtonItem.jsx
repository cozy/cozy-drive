import React from 'react'
import classNames from 'classnames'
import UploadButton from 'drive/web/modules/upload/UploadButton'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import styles from 'drive/styles/toolbar.styl'
import { compose } from 'redux'

import { useDisplayedFolder } from 'drive/hooks'

const UploadButtonItem = ({ t, isDisabled, onUploaded }) => {
  const displayedFolder = useDisplayedFolder()

  return (
    <UploadButton
      disabled={isDisabled}
      displayedFolder={displayedFolder}
      label={t('toolbar.item_upload')}
      className={classNames(styles['c-btn'], 'u-hide--mob')}
      onUploaded={onUploaded}
    />
  )
}

export default compose(translate())(UploadButtonItem)

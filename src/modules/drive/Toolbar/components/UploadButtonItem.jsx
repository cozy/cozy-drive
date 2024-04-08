import classNames from 'classnames'
import { useDisplayedFolder } from 'hooks'
import React from 'react'
import { compose } from 'redux'

import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import UploadButton from 'modules/upload/UploadButton'
import styles from 'styles/toolbar.styl'

const UploadButtonItem = ({ t, isDisabled, onUploaded }) => {
  const { displayedFolder } = useDisplayedFolder()

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

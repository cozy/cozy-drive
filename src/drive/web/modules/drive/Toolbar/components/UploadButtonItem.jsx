import React from 'react'
import classNames from 'classnames'
import UploadButton from 'drive/web/modules/upload/UploadButton'
import { translate } from 'cozy-ui/react'
import styles from 'drive/styles/toolbar'
import buttonContainer from '../containers/button'
import { uploadFiles } from 'drive/web/modules/navigation/duck'

const UploadButtonItem = translate()(
  ({ t, displayedFolder, insideMoreMenu, isDisabled }) =>
    insideMoreMenu ? (
      <UploadButton
        onUpload={files => uploadFiles(files, displayedFolder)}
        label={t('toolbar.menu_upload')}
        className={styles['fil-action-upload']}
      />
    ) : (
      <UploadButton
        disabled={isDisabled}
        onUpload={files => uploadFiles(files, displayedFolder)}
        label={t('toolbar.item_upload')}
        className={classNames(styles['c-btn'], styles['u-hide--mob'])}
      />
    )
)

export default buttonContainer(UploadButtonItem)

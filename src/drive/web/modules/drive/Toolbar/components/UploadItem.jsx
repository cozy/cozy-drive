import React from 'react'
import classNames from 'classnames'
import UploadButton from 'drive/web/modules/upload/UploadButton'
import { translate } from 'cozy-ui/react'
import styles from 'drive/styles/toolbar'

import toolbarContainer from '../toolbar'

const UploadItem = translate()(
  ({ t, displayedFolder, insideMoreMenu, isDisabled, uploadFiles }) =>
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

export default toolbarContainer(UploadItem)

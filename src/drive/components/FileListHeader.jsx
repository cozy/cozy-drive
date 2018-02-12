import styles from '../styles/table'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

const FileListHeader = ({ t }) => (
  <div
    className={classNames(
      styles['fil-content-head'],
      styles['fil-content-row-head']
    )}
  >
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-file-select']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-file']
      )}
    >
      {t('table.head_name')}
    </div>
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-date']
      )}
    >
      {t('table.head_update')}
    </div>
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-size']
      )}
    >
      {t('table.head_size')}
    </div>
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-status']
      )}
    >
      {t('table.head_status')}
    </div>
  </div>
)

export default translate()(FileListHeader)

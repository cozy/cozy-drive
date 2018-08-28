import React from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import FilenameInput from './FilenameInput'
import styles from 'drive/styles/filelist'

const AddFolder = ({ f, onSubmit, onAbort }) => (
  <div className={styles['fil-content-row']}>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file-select']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file'],
        styles['fil-file-folder']
      )}
    >
      <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-date']
      )}
    >
      <time dateTime="">{f(Date.now(), 'MMM D, YYYY')}</time>
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-size']
      )}
    >
      —
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-status']
      )}
    >
      —
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file-action']
      )}
    />
  </div>
)

export default translate()(AddFolder)

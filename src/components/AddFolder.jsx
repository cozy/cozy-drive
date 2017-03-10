import React from 'react'
import classNames from 'classnames'

import styles from '../styles/table'
import FilenameInput from '../components/FilenameInput'
import { translate } from '../lib/I18n'

const AddFolder = ({ f, onSubmit, onAbort }) => (
  <div className={styles['fil-content-row']}>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])} />
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file'], styles['fil-file-folder'])}>
      <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
    </div>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])}>
      <time datetime=''>{f(Date.now(), 'MMM D, YYYY')}</time>
    </div>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])}>—</div>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-status'])}>—</div>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-action'])} />
  </div>
)

export default translate()(AddFolder)

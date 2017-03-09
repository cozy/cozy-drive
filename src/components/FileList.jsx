import styles from '../styles/table'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import File from '../components/File'
import AddFolder from '../containers/AddFolder'
import Empty from '../components/Empty'

const FileList = ({
  t, f, isTrashContext, context, files, error, showSelection, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, onShowActionMenu
}) => (
  <div className={classNames(
    styles['fil-content-table'],
    { [styles['fil-content-table-selection']]: showSelection }
  )}>
    <div className={classNames(styles['fil-content-head'], styles['fil-content-row'])}>
      <div className={classNames(styles['fil-content-header'], styles['fil-content-file-select'])} />
      <div className={classNames(styles['fil-content-header'], styles['fil-content-file'])}>{ t('table.head_name') }</div>
      <div className={classNames(styles['fil-content-header'], styles['fil-content-date'])}>{ t('table.head_update') }</div>
      <div className={classNames(styles['fil-content-header'], styles['fil-content-size'])}>{ t('table.head_size') }</div>
      <div className={classNames(styles['fil-content-header'], styles['fil-content-status'])}>{ t('table.head_status') }</div>
    </div>
    <div className={styles['fil-content-body']}>
      <AddFolder />
      {!error && files.map((file, idx) => (
        <File
          context={context}
          onEdit={onFileEdit}
          onFolderOpen={onFolderOpen}
          onFileOpen={onFileOpen}
          onToggle={onFileToggle}
          onShowActionMenu={onShowActionMenu}
          attributes={file}
          showSelection={showSelection}
        />
      ))}
      {!error && files.length === 0 && <Empty canUpload={!isTrashContext} />}
    </div>
  </div>
)

export default translate()(FileList)

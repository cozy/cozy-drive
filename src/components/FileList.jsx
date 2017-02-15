import styles from '../styles/table'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import Oops from '../components/Oops'
import File from '../components/File'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const FileList = ({
  t, f, files, error, showSelection, isBrowsingTrash, showActionMenu, showDeleteConfirmation, onFileEdit, onFileEditAbort, onFolderOpen, onFileToggle, onShowActionMenu
}) => (
  <div role='contentinfo'>
    {!isBrowsingTrash && showSelection && <FilesSelectionBar />}
    {isBrowsingTrash && showSelection && <TrashSelectionBar />}
    {showDeleteConfirmation && <DeleteConfirmation />}
    <div className={classNames(
      styles['fil-content-table'],
      { [styles['fil-content-table-selection']]: showSelection }
    )}>
      <div className={styles['fil-content-row']}>
        <div className={classNames(styles['fil-content-header'], styles['fil-content-file-select'])} />
        <div className={classNames(styles['fil-content-header'], styles['fil-content-file'])}>{ t('table.head_name') }</div>
        <div className={classNames(styles['fil-content-header'], styles['fil-content-date'])}>{ t('table.head_update') }</div>
        <div className={classNames(styles['fil-content-header'], styles['fil-content-size'])}>{ t('table.head_size') }</div>
        <div className={classNames(styles['fil-content-header'], styles['fil-content-status'])}>{ t('table.head_status') }</div>
      </div>
      <div className={styles['fil-content-body']}>
        {!error && files.map((file, idx) => (
          <File
            onEdit={onFileEdit}
            onEditAbort={onFileEditAbort}
            onOpen={onFolderOpen}
            onToggle={onFileToggle}
            onShowActionMenu={onShowActionMenu}
            attributes={file}
            showSelection={showSelection}
          />
        ))}
      </div>
    </div>
    {error && <Oops />}
    {files.length === 0 && <Empty canUpload={!isBrowsingTrash} />}
    {showActionMenu && <FileActionMenu />}
  </div>
)

export default translate()(FileList)

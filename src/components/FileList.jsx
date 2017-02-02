import styles from '../styles/table'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import Oops from '../components/Oops'
import File from '../components/File'

import SelectionBar from '../containers/SelectionBar'
import FileActionMenu from '../containers/FileActionMenu'

const FileList = ({
  t, f, files, error, showSelection, showActionMenu, onFileEdit, onFolderOpen, onFileToggle, onShowActionMenu
}) => (
  <div role='contentinfo'>
    {showSelection && <SelectionBar />}
    <table className={classNames(
      styles['fil-content-table'],
      { [styles['fil-content-table-selection']]: showSelection }
    )}>
      <thead>
        <tr>
          <th />
          <th className={styles['fil-content-file']}>{ t('table.head_name') }</th>
          <th>{ t('table.head_update') }</th>
          <th>{ t('table.head_size') }</th>
          <th>{ t('table.head_status') }</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {!error && files.map((file, idx) => (
          <File
            onEdit={onFileEdit}
            onOpen={onFolderOpen}
            onToggle={onFileToggle}
            onShowActionMenu={onShowActionMenu}
            attributes={file}
          />
        ))}
      </tbody>
    </table>
    {error && <Oops />}
    {files.length === 0 && <Empty />}
    {showActionMenu && <FileActionMenu />}
  </div>
)

export default translate()(FileList)

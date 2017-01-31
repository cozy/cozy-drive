import styles from '../styles/table'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import File from '../components/File'

import SelectionBar from '../containers/SelectionBar'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const FileList = ({ t, f, files, showSelection, showDeleteConfirmation, onFileEdit, onFolderOpen, onFileToggle }) => (
  <div role='contentinfo'>
    { showSelection && <SelectionBar /> }
    { showDeleteConfirmation && <DeleteConfirmation /> }
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
        </tr>
      </thead>
      <tbody>
        {files.map((file, idx) => (
          <File
            onEdit={onFileEdit}
            onOpen={onFolderOpen}
            onToggle={onFileToggle}
            attributes={file}
          />
        ))}
      </tbody>
    </table>
    {files.length === 0 && <Empty />}
  </div>
)

export default translate()(FileList)

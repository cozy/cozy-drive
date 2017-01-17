import styles from '../styles/table'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import File from '../components/File'

const FileList = ({ t, f, files, onFileEdit, onFolderOpen }) => (
  <div role='contentinfo'>
    <table class={styles['fil-content-table']}>
      <thead>
        <tr>
          <th class={styles['fil-content-file']}>{ t('table.head_name') }</th>
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
            attributes={file}
          />
        ))}
      </tbody>
    </table>
    {files.length === 0 && <Empty />}
  </div>
)

export default translate()(FileList)

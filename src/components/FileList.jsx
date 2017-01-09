import styles from '../styles/table'

import React from 'react'
import { translate } from '../lib/I18n'

import File from '../components/File'

const FileList = ({ t, f, files = [], onFileEdit, isFetching }) => {
  if (isFetching) {
    return <p>Loading</p>
  }
  return (
    <table class={styles['fil-content-table']} role='contentinfo'>
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
            attributes={file} />
        ))}
      </tbody>
    </table>
  )
}

export default translate()(FileList)

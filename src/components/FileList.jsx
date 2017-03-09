import styles from '../styles/table'

import React from 'react'
import { translate } from '../lib/I18n'

import File from '../components/File'
import AddFolder from '../containers/AddFolder'

const FileList = ({
  t, f, context, files, error, showSelection, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, onShowActionMenu
}) => (
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
  </div>
)

export default translate()(FileList)

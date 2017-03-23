import React from 'react'
import { translate } from '../lib/I18n'

import File from '../components/File'
import AddFolder from '../containers/AddFolder'

const FileList = ({
  t, f, displayedFolder, files, selected, error, showSelection, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, onShowActionMenu
}) => (
  <div>
    <AddFolder />
    {!error && files.map((file, idx) => (
      <File
        displayedFolder={displayedFolder}
        selected={selected.indexOf(file.id) !== -1}
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

import React from 'react'
import { translate } from '../lib/I18n'

import File from '../components/File'
import AddFolder from '../containers/AddFolder'

const FileList = ({
  t, f, virtualRoot, displayedFolder, files, selected, error, showSelection, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, onShowActionMenu
}) => (
  <div>
    <AddFolder />
    {!error && files.map((file, idx) => (
      <File
        virtualRoot={virtualRoot}
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

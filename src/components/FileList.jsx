import React from 'react'
import { translate } from '../lib/I18n'

import File from '../components/File'

const FileList = ({
  t, f, displayedFolder, files, selected, selectionModeActive, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, showActionMenu
}) => (
  <div>
    {files.map((file, idx) => (
      <File
        displayedFolder={displayedFolder}
        selected={selected.find(f => f && f.id === file.id) !== undefined}
        onEdit={onFileEdit}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        onToggle={onFileToggle}
        onShowActionMenu={showActionMenu}
        attributes={file}
        selectionModeActive={selectionModeActive}
      />
    ))}
  </div>
)

export default translate()(FileList)

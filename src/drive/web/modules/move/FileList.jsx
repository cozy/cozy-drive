import React from 'react'
import PropTypes from 'prop-types'
import { DumbFile as File } from 'drive/web/modules/filelist/File'

const isValidMoveTarget = (subjects, target) => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'

  return isAFile || isASubject
}

const FileList = ({ targets, files, navigateTo }) => (
  <>
    {files.map(file => (
      <File
        key={file.id}
        disabled={isValidMoveTarget(targets, file)}
        attributes={file}
        displayedFolder={null}
        actions={null}
        isRenaming={false}
        onFolderOpen={id => navigateTo(files.find(f => f.id === id))}
        onFileOpen={null}
        withSelectionCheckbox={false}
        withFilePath={false}
        withSharedBadge
      />
    ))}
  </>
)

FileList.propTypes = {
  targets: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default FileList

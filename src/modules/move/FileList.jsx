import PropTypes from 'prop-types'
import React from 'react'

import { ROOT_DIR_ID } from 'constants/config'
import { DumbFile as File } from 'modules/filelist/File'
import { FolderUnlocker } from 'modules/folder/components/FolderUnlocker'

const isInvalidMoveTarget = (subjects, target) => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'
  return isAFile || isASubject !== undefined
}

const FileList = ({ targets, files, folder, navigateTo }) => {
  const handleFolderUnlockerDismiss = () => {
    navigateTo(ROOT_DIR_ID)
  }

  return (
    <FolderUnlocker folder={folder} onDismiss={handleFolderUnlockerDismiss}>
      {files.map(file => (
        <File
          key={file.id}
          disabled={isInvalidMoveTarget(targets, file)}
          styleDisabled={isInvalidMoveTarget(targets, file)}
          attributes={file}
          displayedFolder={null}
          actions={null}
          isRenaming={false}
          onFolderOpen={({ id }) => navigateTo(files.find(f => f.id === id))}
          onFileOpen={() => {}}
          withSelectionCheckbox={false}
          withFilePath={false}
          withSharedBadge
          disableSelection={true}
        />
      ))}
    </FolderUnlocker>
  )
}

FileList.propTypes = {
  targets: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  folder: PropTypes.object
}

export default FileList

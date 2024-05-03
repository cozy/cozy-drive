import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { VaultUnlocker } from 'cozy-keys-lib'

import { ROOT_DIR_ID } from 'constants/config'
import { isEncryptedFolder } from 'lib/encryption'
import { DumbFile as File } from 'modules/filelist/File'

const isInvalidMoveTarget = (subjects, target) => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'
  return isAFile || isASubject !== undefined
}

const FileList = ({ targets, files, folder, navigateTo }) => {
  const [shouldUnlock, setShouldUnlock] = useState(true)
  const isEncFolder = isEncryptedFolder(folder)

  if (isEncFolder && shouldUnlock) {
    return (
      <VaultUnlocker
        onDismiss={() => {
          setShouldUnlock(false)
          return navigateTo(ROOT_DIR_ID)
        }}
        onUnlock={() => setShouldUnlock(false)}
      />
    )
  } else {
    return (
      <>
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
      </>
    )
  }
}

FileList.propTypes = {
  targets: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  folder: PropTypes.object
}

export default FileList

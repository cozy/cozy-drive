import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { DumbFile as File } from 'drive/web/modules/filelist/File'
import { useVaultUnlockContext } from 'cozy-keys-lib'
import { isEncryptedDir } from 'drive/lib/encryption'

const getDirsSubjects = subjects => {
  return subjects.filter(
    subject => get(subject, 'attributes.type') === 'directory'
  )
}

const getEncryptedDirs = subjects => {
  return subjects.filter(subject => {
    if (get(subject, 'attributes.type') !== 'directory') {
      return false
    }
    return isEncryptedDir(subject)
  })
}

const isInvalidMoveTarget = (subjects, target) => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'
  if (isAFile || isASubject) {
    return true
  }

  const dirs = getDirsSubjects(subjects)
  if (dirs.length > 0) {
    const encryptedDirsSubjects = getEncryptedDirs(dirs)
    const hasEncryptedSubjects = encryptedDirsSubjects.length > 0
    const isTargetEncrypted = getEncryptedDirs([target]).length > 0

    if (hasEncryptedSubjects && !isTargetEncrypted) {
      // Do not allow moving an encrypted folder to a non-encrypted one
      return true
    }
    if (!hasEncryptedSubjects && isTargetEncrypted) {
      // Do not allow moving a non-encrypted folder to an encrypted one
      return true
    }
    if (hasEncryptedSubjects && encryptedDirsSubjects.length !== dirs.length) {
      // Do not allow moving encrypted + non encrypted folders
      return true
    }
  }
  return false
}

const FileList = ({ targets, files, navigateTo }) => {
  const { showUnlockForm } = useVaultUnlockContext()

  const onFolderOpen = folderId => {
    const dir = files.find(f => f._id === folderId)
    const shouldUnlock = isEncryptedDir(dir)
    if (shouldUnlock) {
      return showUnlockForm({ onUnlock: () => navigateTo(dir) })
    } else {
      return navigateTo(dir)
    }
  }

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
          onFolderOpen={id => onFolderOpen(id)}
          onFileOpen={null}
          withSelectionCheckbox={false}
          withFilePath={false}
          withSharedBadge
        />
      ))}
    </>
  )
}

FileList.propTypes = {
  targets: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default FileList

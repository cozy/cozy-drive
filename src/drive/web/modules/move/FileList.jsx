import React from 'react'
import PropTypes from 'prop-types'
import { DumbFile as File } from 'drive/web/modules/filelist/File'
import { useVaultUnlockContext } from 'cozy-keys-lib'
import {
  hasEncryptionRef,
  isUnSupportedFileForEncryption
} from 'drive/lib/encryption'

const getDirsSubjects = subjects => {
  return subjects.filter(subject => subject.type === 'directory')
}

const getEncryptedDirs = subjects => {
  return subjects.filter(subject => {
    if (subject.type !== 'directory') {
      return false
    }
    return hasEncryptionRef(subject)
  })
}

const isInvalidMoveTarget = (subjects, target) => {
  const isTargetASubject = subjects.find(subject => subject._id === target._id)
  const isTargetAFile = target.type === 'file'
  if (isTargetAFile || isTargetASubject) {
    return true
  }

  const dirs = getDirsSubjects(subjects)
  const isTargetEncrypted = getEncryptedDirs([target]).length > 0
  if (dirs.length > 0) {
    const encryptedDirsSubjects = getEncryptedDirs(dirs)
    const hasEncryptedSubjects = encryptedDirsSubjects.length > 0

    if (!hasEncryptedSubjects && isTargetEncrypted) {
      // Do not allow moving a non-encrypted folder to an encrypted one
      return true
    }
    if (hasEncryptedSubjects && encryptedDirsSubjects.length !== dirs.length) {
      // Do not allow moving encrypted + non encrypted folders
      return true
    }
  }
  if (isTargetEncrypted) {
    // Do not allow moving unsupported files in encrypted folder
    for (const subject of subjects) {
      const isFile = subject.type === 'file'
      const mime = subject.mime
      if (isFile && isUnSupportedFileForEncryption(mime)) {
        return true
      }
    }
  }
  return false
}

const FileList = ({ targets, files, navigateTo }) => {
  const { showUnlockForm } = useVaultUnlockContext()

  const onFolderOpen = folderId => {
    const dir = files.find(f => f._id === folderId)
    const shouldUnlock = hasEncryptionRef(dir)
    if (shouldUnlock) {
      // TODO query encryption key to get it in the store
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
  folderId: PropTypes.string.isRequired,
  targets: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  setEncryptionKey: PropTypes.func.isRequired
}

export default FileList

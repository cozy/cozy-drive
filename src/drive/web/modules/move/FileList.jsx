import React from 'react'
import PropTypes from 'prop-types'
import { DumbFile as File } from 'drive/web/modules/filelist/File'
import { useVaultUnlockContext } from 'cozy-keys-lib'
import { isEncryptedFolder } from 'drive/lib/encryption'

const getFoldersInEntries = entries => {
  return entries.filter(entry => entry.type === 'directory')
}

const getEncryptedFolders = entries => {
  return entries.filter(entry => {
    if (entry.type !== 'directory') {
      return false
    }
    return isEncryptedFolder(entry)
  })
}

export const isInvalidMoveTarget = (entries, target) => {
  const isTargetAnEntry = entries.find(subject => subject._id === target._id)
  const isTargetAFile = target.type === 'file'
  if (isTargetAFile || isTargetAnEntry) {
    return true
  }
  const dirs = getFoldersInEntries(entries)
  if (dirs.length > 0) {
    const encryptedFoldersEntries = getEncryptedFolders(dirs)
    const hasEncryptedFolderEntries = encryptedFoldersEntries.length > 0
    const hasEncryptedAndNonEncryptedFolderEntries =
      hasEncryptedFolderEntries &&
      encryptedFoldersEntries.length !== dirs.length
    const isTargetEncrypted = isEncryptedFolder(target)

    if (isTargetEncrypted && !hasEncryptedFolderEntries) {
      // Do not allow moving a non-encrypted folder to an encrypted one
      return true
    }
    if (isTargetEncrypted && hasEncryptedAndNonEncryptedFolderEntries) {
      // Do not allow moving encrypted + non encrypted folders
      return true
    }
  }
  return false
}

const FileList = ({ entries, files, folder, navigateTo }) => {
  const { showUnlockForm } = useVaultUnlockContext()

  const onFolderOpen = folderId => {
    const dir = folder ? folder._id : files.find(f => f._id === folderId)
    const shouldUnlock = isEncryptedFolder(dir)
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
          disabled={isInvalidMoveTarget(entries, file)}
          styleDisabled={isInvalidMoveTarget(entries, file)}
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
  entries: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  folder: PropTypes.object
}

export default FileList

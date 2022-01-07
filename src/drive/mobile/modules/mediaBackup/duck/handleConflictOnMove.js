import { CozyFile } from 'models'

// Fix bug for 1.18.18 release. Used for 1.18.24 release
const generateNewFolderNameOnConflict = folderName => {
  // Check if the string ends by _1
  const regex = new RegExp('(_)([0-9]+)$')
  const matches = folderName.match(regex)
  if (matches) {
    let versionNumber = parseInt(matches[2])
    // increment versionNumber
    versionNumber++
    const newfolderName = folderName.replace(
      new RegExp('(_)([0-9]+)$'),
      `_${versionNumber}`
    )
    return newfolderName
  } else {
    return `${folderName}_1`
  }
}

const renameFolder = async (client, folderToRename, newName) => {
  try {
    return await client
      .collection('io.cozy.files')
      .updateAttributes(folderToRename.id, { name: newName })
  } catch (e) {
    if (/Conflict/.test(e.message)) {
      const newNameWithNum = generateNewFolderNameOnConflict(newName)
      return renameFolder(client, folderToRename, newNameWithNum)
    }
    throw e
  }
}

export const handleConflictOnMove = async (
  client,
  savedFromMyDeviceFolder,
  photosFolder,
  newName
) => {
  try {
    return await CozyFile.move(savedFromMyDeviceFolder.id, {
      folderId: photosFolder.data.id
    })
  } catch (e) {
    if (/Conflict/.test(e.message)) {
      const newNameWithNum = generateNewFolderNameOnConflict(newName)
      const newFolder = await renameFolder(
        client,
        savedFromMyDeviceFolder,
        newNameWithNum
      )
      return handleConflictOnMove(
        client,
        newFolder,
        photosFolder,
        newNameWithNum
      )
    }
    throw e
  }
}

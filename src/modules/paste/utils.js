import { Q } from 'cozy-client'
import { isFile } from 'cozy-client/dist/models/file'

/**
 * Extracts the base name, extension, and existing suffix from a file/folder name.
 * e.g. "file (2).txt" => { base: "file", extension: ".txt", suffix: 2 }
 */
const parseName = (name, isFileItem) => {
  let base = name
  let extension = ''
  let suffix = null

  if (isFileItem) {
    const lastDotIndex = name.lastIndexOf('.')
    if (lastDotIndex > 0) {
      base = name.substring(0, lastDotIndex)
      extension = name.substring(lastDotIndex)
    }
  }

  const match = base.match(/^(.*)\s\((\d+)\)$/)
  if (match) {
    base = match[1]
    suffix = parseInt(match[2], 10)
  }

  return { base, extension, suffix }
}

/**
 * Generates a unique name not present in the given set of existing names.
 * @param {string} originalName
 * @param {Set<string>} existingNames
 * @param {boolean} isFileItem
 * @returns {string}
 */
export const generateUniqueNameWithSuffix = (
  originalName,
  existingNames,
  isFileItem
) => {
  if (!existingNames.has(originalName)) {
    return originalName
  }

  const { base, extension, suffix } = parseName(originalName, isFileItem)

  let counter = suffix ? suffix + 1 : 1
  let newName

  do {
    newName = `${base} (${counter})${extension}`
    counter++
  } while (existingNames.has(newName))

  return newName
}

/**
 * Gets all existing items in a target folder to check for conflicts
 * @param {Object} client - The cozy client
 * @param {Object} targetFolder - The target folder object
 * @returns {Promise<Set<string>>} - Set of existing item names
 */
export const getExistingItems = async (client, targetFolder) => {
  if (!targetFolder || !targetFolder._id) {
    throw new Error('Invalid targetFolder: missing _id')
  }

  const query = Q('io.cozy.files')
    .where({
      dir_id: targetFolder._id,
      trashed: false
    })
    .indexFields(['dir_id', 'trashed'])

  const result = await client.query(query)
  const items = result.data || []
  return new Set(items.map(item => item.name))
}

/**
 * Resolves name conflicts by generating unique names for files/folders to be moved
 * @param {Object} client - The cozy client
 * @param {Array} files - Array of files/folders to be moved
 * @param {Object} targetFolder - The target folder object
 * @returns {Promise<Array>} - Array of files with resolved names
 */
export const resolveNameConflictsForCut = async (
  client,
  files,
  targetFolder
) => {
  if (!Array.isArray(files)) {
    throw new Error('files must be an array')
  }

  const existingNames = await getExistingItems(client, targetFolder)

  const resolvedFiles = files.map(file => {
    const isFileItem = isFile(file)
    const originalName = file.name
    const uniqueName = generateUniqueNameWithSuffix(
      originalName,
      existingNames,
      isFileItem
    )

    // update the set so subsequent files don’t clash
    existingNames.add(uniqueName)

    return {
      ...file,
      needsRename: originalName !== uniqueName,
      uniqueName,
      attributes: {
        ...file.attributes,
        name: uniqueName
      }
    }
  })

  return resolvedFiles
}

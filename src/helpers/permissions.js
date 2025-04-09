/**
 * Checks if a folder is a shared folder for which the current user has read-only access.
 * @param {object} folder - The folder object (presumably io.cozy.files type).
 * @returns {boolean} True if the folder is shared and the user cannot write to it, false otherwise.
 */
export const isReadOnlySharedFolder = folder => {
  if (!folder || !folder.attributes) {
    return false
  }

  // Heuristic: Check if it's likely a folder shared *with* the current user.
  // Folders shared *with* the user often have `path: null`.
  // We also check `dir_id` exists to avoid matching potential root folders if they also have path null.
  // This might need adjustment based on the exact data structure for shares.
  const isLikelySharedWithMe =
    folder.attributes.path === null && folder.dir_id !== undefined

  if (!isLikelySharedWithMe) {
    return false // Not a folder shared with the user, normal rules apply.
  }

  // Check write permission within the context of a shared folder.
  // If the permissions array exists, check for an explicit PUT verb with granted=true.
  // If the array doesn't exist or doesn't grant PUT, assume read-only for a shared folder.
  const canWrite = folder.attributes.permissions
    ? folder.attributes.permissions.some(
        p => p.type === 'files' && p.verb === 'PUT' && p.granted === true
      )
    : false // Default to false (read-only) if permissions are missing in a shared context.

  // Return true only if it's shared with the user AND they lack write permission.
  return !canWrite
}

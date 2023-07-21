/**
 * Returns whether one of the targeted folders is part of the current folder
 * @param {object[]} targets List of folders
 * @param {string} currentDirId The id of the current folder
 * @returns {boolean} whether one of the targeted folders is part of the current folder
 */
export const areTargetsInCurrentDir = (targets, currentDirId) => {
  const targetsInCurrentDir = targets.filter(
    target => target.dir_id === currentDirId
  )
  return targetsInCurrentDir.length === targets.length
}

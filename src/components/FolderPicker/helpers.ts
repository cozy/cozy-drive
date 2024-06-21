import { FolderPickerEntry, File } from 'components/FolderPicker/types'
import { getParentPath } from 'lib/path'

/**
 * Checks if the target is an invalid move target based on the subjects and target provided.
 *
 * @param subjects - The array of subjects to check against.
 * @param target - The target object to check.
 * @returns - Returns true if the target is an invalid move target, otherwise false.
 */
const isInvalidMoveTarget = (
  subjects: FolderPickerEntry[],
  target: File
): boolean => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'
  return isAFile || isASubject !== undefined
}

/**
 * Returns whether one of the targeted folders is part of the current folder
 *
 * @param targets - List of folders
 * @param folder - The id of the current folder
 * @returns - Whether one of the targeted folders is part of the current folder
 */
const areTargetsInCurrentDir = (
  targets: FolderPickerEntry[],
  folder?: File
): boolean => {
  if (!folder) return false

  return targets.every(target => {
    if (target.dir_id) {
      return target.dir_id === folder._id
    }
    if (target._type === folder._type && target.path) {
      return getParentPath(target.path) === folder.path
    }
    return false
  })
}

export { isInvalidMoveTarget, areTargetsInCurrentDir }

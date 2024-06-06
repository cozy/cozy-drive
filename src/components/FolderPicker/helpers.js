import { getParentPath } from 'lib/path'

const isInvalidMoveTarget = (subjects, target) => {
  const isASubject = subjects.find(subject => subject._id === target._id)
  const isAFile = target.type === 'file'
  return isAFile || isASubject !== undefined
}

const getParentFolderFromPath = path => {
  if (path === '/') return undefined

  const newPath = path.split('/').slice(0, -1)
  if (newPath.length === 1) {
    return {
      name: 'root',
      path: '/'
    }
  }

  return {
    name: newPath[newPath.length - 1],
    path: newPath.join('/')
  }
}

/**
 * Returns whether one of the targeted folders is part of the current folder
 * @param {import('cozy-client/types').IOCozyFile[]} targets - List of folders
 * @param {import('cozy-client/types').IOCozyFile} folder - The id of the current folder
 * @returns {boolean} - Whether one of the targeted folders is part of the current folder
 */
const areTargetsInCurrentDir = (targets, folder) => {
  if (!folder) return false

  const targetsInCurrentDir = targets.filter(target => {
    if (target.dir_id) {
      return target.dir_id === folder._id
    }
    if (target._type === folder._type) {
      return getParentPath(target.path) === folder.path
    }
    return false
  })
  return targetsInCurrentDir.length === targets.length
}

export { isInvalidMoveTarget, getParentFolderFromPath, areTargetsInCurrentDir }

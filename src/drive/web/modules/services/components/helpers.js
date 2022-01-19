import { models } from 'cozy-client'

export const TYPE_DIRECTORY = 'directory'

export const makeNormalizedFile = async (client, folders, file, getIconUrl) => {
  const isDir = file.type === TYPE_DIRECTORY
  const dirId = isDir ? file._id : file.dir_id
  const urlToFolder = `${window.location.origin}/#/folder/${dirId}`

  let path, url
  if (isDir) {
    path = file.path
    url = urlToFolder
  } else {
    const parentDir = folders.find(folder => folder._id === file.dir_id)
    path = parentDir && parentDir.path ? parentDir.path : ''
    if (models.file.isNote(file)) {
      url = await models.note.fetchURL(client, file)
    } else {
      url = `${urlToFolder}/file/${file._id}`
    }
  }

  return {
    id: file._id,
    name: file.name,
    path,
    url,
    icon: getIconUrl(file)
  }
}

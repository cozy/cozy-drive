import { models } from 'cozy-client'

import { getFileMimetype } from 'drive/lib/getFileMimetype'
import { hasEncryptionRef } from 'drive/lib/encryption'

export const TYPE_DIRECTORY = 'directory'

const iconsContext =
  typeof require.context === 'undefined' // no require.context in jest
    ? { keys: () => [] }
    : require.context('drive/assets/icons/', false, /icon-type-.*.svg$/)

const icons = iconsContext.keys().reduce((acc, item) => {
  acc[item.replace(/\.\/icon-type-(.*)\.svg/, '$1')] = iconsContext(item)
  return acc
}, {})

const getIconUrl = file => {
  let keyIcon
  if (file.type === TYPE_DIRECTORY) {
    if (hasEncryptionRef(file)) {
      keyIcon = 'encrypted-folder'
    } else {
      keyIcon = 'folder'
    }
  } else {
    keyIcon = models.file.isNote(file)
      ? 'note'
      : getFileMimetype(icons)(file.mime, file.name) || 'files'
  }
  const icon = icons[keyIcon].default

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='${
    icon.viewBox
  }'>${icon.content}<use href='#${
    icon.id
  }' x='0' y='0' width='32' height='32'/></svg>`.replace(/#/g, '%23')
}

export const containerForTesting = {
  getIconUrl
}

export const makeNormalizedFile = async (client, folders, file) => {
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
    icon: containerForTesting.getIconUrl(file)
  }
}

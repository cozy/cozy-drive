import { TYPE_DIRECTORY } from './helpers'
import { models } from 'cozy-client'
import { isEncryptedFolder } from 'drive/lib/encryption'
import { getFileMimetype } from 'drive/lib/getFileMimetype'

const iconsContext = require.context(
  'drive/assets/icons/',
  false,
  /icon-type-.*.svg$/
)

const icons = iconsContext.keys().reduce((acc, item) => {
  acc[item.replace(/\.\/icon-type-(.*)\.svg/, '$1')] = iconsContext(item)
  return acc
}, {})

export function getIconUrl(file) {
  let keyIcon
  if (file.type === TYPE_DIRECTORY) {
    if (isEncryptedFolder(file)) {
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

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='${icon.viewBox}'>${icon.content}<use href='#${icon.id}' x='0' y='0' width='32' height='32'/></svg>`.replace(
    /#/g,
    '%23'
  )
}

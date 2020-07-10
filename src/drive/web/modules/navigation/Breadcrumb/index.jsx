import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

export const renamePathNames = (path, pathname, t) => {
  if (pathname === '/recent') {
    path.unshift({
      name: t('breadcrumb.title_recent')
    })
  } else if (pathname.match(/^\/sharings/)) {
    path.unshift({
      name: t('breadcrumb.title_sharings'),
      url: '/sharings'
    })
  }

  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_drive')
    } else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
    }
    if (!folder.name) folder.name = '…'
  })

  return path
}

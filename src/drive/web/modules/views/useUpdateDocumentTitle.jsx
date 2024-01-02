import { useMemo, useEffect } from 'react'

import { useClient, models } from 'cozy-client'

import { useFileWithPath } from 'drive/web/modules/views/hooks'
import { TRASH_DIR_PATH } from 'constants/config'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const makeTitle = (fileWithPath, appFullName, t) => {
  const fileName =
    fileWithPath &&
    fileWithPath.name &&
    !TRASH_DIR_PATH.includes(fileWithPath.name)
      ? `${fileWithPath.name} `
      : ''

  let path = ''
  if (models.file.isDirectory(fileWithPath)) {
    if (fileWithPath && fileWithPath.path) {
      if (fileWithPath.path.startsWith(TRASH_DIR_PATH)) {
        const trashSubDirectories = fileWithPath.path.split(
          `${TRASH_DIR_PATH}/`
        )[1]
        path = trashSubDirectories
          ? `(${t('Nav.item_trash')}/${trashSubDirectories}) `
          : `${t('Nav.item_trash')} `
      } else if (
        fileWithPath.path !== '/' &&
        fileWithPath.path !== `/${fileWithPath.name}`
      ) {
        path = `(${fileWithPath.path.substring(1)}) `
      }
    }
  } else {
    if (fileWithPath && fileWithPath.displayedPath) {
      if (fileWithPath.displayedPath.startsWith(TRASH_DIR_PATH)) {
        const trashSubDirectories = fileWithPath.displayedPath.split(
          `${TRASH_DIR_PATH}/`
        )[1]
        path = trashSubDirectories
          ? `(${t('Nav.item_trash')}/${trashSubDirectories}) `
          : `(${t('Nav.item_trash')}) `
      } else {
        path = `(${fileWithPath.displayedPath.substring(1)}) `
      }
    }
  }

  const separator = fileName || path ? '- ' : ''

  return `${fileName}${path}${separator}${appFullName}`
}

const useUpdateDocumentTitle = docId => {
  const { t } = useI18n()
  const client = useClient()
  const { data: fileWithPath, fetchStatus } = useFileWithPath(docId)

  const appFullName = useMemo(
    () => `${client.appMetadata.prefix} ${client.appMetadata.name}`,
    [client.appMetadata]
  )

  const title = useMemo(
    () => makeTitle(fileWithPath, appFullName, t),
    [fileWithPath, appFullName, t]
  )

  useEffect(() => {
    if (fetchStatus === 'loaded' && title !== document.title) {
      document.title = title
    }
  }, [fetchStatus, title])
}

export default useUpdateDocumentTitle

import { models, Q } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { isMobileApp } from 'cozy-device-helper'

import { openLocalFile } from 'drive/mobile/modules/offline/duck'
import generateShortcutUrl from 'drive/web/modules/views/Folder/generateShortcutUrl'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'

const createFileOpeningHandler = ({
  client,
  isFlatDomain,
  dispatch,
  navigateToFile,
  replaceCurrentUrl,
  openInNewTab,
  routeTo,
  isOnlyOfficeEnabled
}) => async ({ event, file, isAvailableOffline }) => {
  if (isAvailableOffline) {
    return dispatch(openLocalFile(file))
  }

  const isNote = models.file.isNote(file)
  const isShortcut = models.file.isShortcut(file)
  const isOnlyOffice = models.file.shouldBeOpenedByOnlyOffice(file)

  if (isShortcut) {
    if (isMobileApp()) {
      try {
        const resp = await client.query(
          Q('io.cozy.files.shortcuts').getById(file.id)
        )
        replaceCurrentUrl(resp.data.attributes.url)
      } catch (error) {
        Alerter.error('alert.could_not_open_file')
      }
    } else {
      const url = generateShortcutUrl({ file, client, isFlatDomain })
      openInNewTab(url)
    }
  } else if (isNote) {
    try {
      replaceCurrentUrl(await models.note.fetchURL(client, file))
    } catch (e) {
      Alerter.error('alert.offline')
    }
  } else if (isOnlyOffice && isOnlyOfficeEnabled) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      openInNewTab(makeOnlyOfficeFileRoute(file))
    } else {
      routeTo(makeOnlyOfficeFileRoute(file, true))
    }
  } else {
    navigateToFile(file)
  }
}

export default createFileOpeningHandler

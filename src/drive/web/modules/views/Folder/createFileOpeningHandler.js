import { models, Q } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { isMobileApp } from 'cozy-device-helper'

import { openLocalFile } from 'drive/mobile/modules/offline/duck'
import generateShortcutUrl from 'drive/web/modules/views/Folder/generateShortcutUrl'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'
import { DOCTYPE_FILES_SHORTCUT } from 'drive/lib/doctypes'

const createFileOpeningHandler = ({
  client,
  isFlatDomain,
  dispatch,
  navigateToFile,
  replaceCurrentUrl,
  openInNewTab,
  routeTo,
  isOnlyOfficeEnabled,
  fileUrlToNavigate
}) => async ({ event, file, isAvailableOffline }) => {
  const fileUrl =
    fileUrlToNavigate(file.dir_id)(file) ||
    `/folder/${file.dir_id}/file/${file.id}`

  console.log('createFileOpeningHandler')

  if (isAvailableOffline) {
    console.log('isAvailableOffline')

    return dispatch(openLocalFile(client, file))
  }

  const isNote = models.file.isNote(file)
  const isShortcut = models.file.isShortcut(file)
  const isOnlyOffice = models.file.shouldBeOpenedByOnlyOffice(file)

  console.log('super')
  const shouldOpenInNewTab = event.ctrlKey || event.metaKey || event.shiftKey

  if (isShortcut) {
    console.log('isShortcut')
    if (isMobileApp()) {
      try {
        const resp = await client.query(
          Q(DOCTYPE_FILES_SHORTCUT).getById(file.id)
        )
        replaceCurrentUrl(resp.data.attributes.url)
      } catch (error) {
        Alerter.error('alert.could_not_open_file')
      }
    } else {
      const url = generateShortcutUrl({ file, client, isFlatDomain })
      openInNewTab(url)
    }
  } else {
    if (isNote) {
      console.log('isNote')
      try {
        const routeToNote = await models.note.fetchURL(client, file)
        if (shouldOpenInNewTab) {
          openInNewTab(routeToNote)
        } else {
          replaceCurrentUrl(routeToNote)
        }
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else if (isOnlyOffice && isOnlyOfficeEnabled) {
      console.log('isOnlyOffice')
      if (shouldOpenInNewTab) {
        openInNewTab(makeOnlyOfficeFileRoute(file))
      } else {
        routeTo(makeOnlyOfficeFileRoute(file, true))
      }
    } else {
      console.log('here')
      if (shouldOpenInNewTab) {
        console.log('shouldOpenInNewTab')
        openInNewTab(`/#${fileUrl}`)
      } else {
        console.log('should not OpenInNewTab')
        navigateToFile(file)
      }
    }
  }
}

export default createFileOpeningHandler

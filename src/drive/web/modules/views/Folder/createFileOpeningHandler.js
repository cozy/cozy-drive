import { models, Q } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { isFlagshipApp } from 'cozy-device-helper'

import generateShortcutUrl from 'drive/web/modules/views/Folder/generateShortcutUrl'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'
import { DOCTYPE_FILES_SHORTCUT } from 'lib/doctypes'

const createFileOpeningHandler =
  ({
    client,
    isFlatDomain,
    navigateToFile,
    replaceCurrentUrl,
    openInNewTab,
    routeTo,
    isOfficeEnabled,
    webviewIntent,
    pathname,
    fromPublicFolder = false
  }) =>
  async ({ event, file }) => {
    const isNote = models.file.isNote(file)
    const isShortcut = models.file.isShortcut(file)
    const isOnlyOffice = models.file.shouldBeOpenedByOnlyOffice(file)

    if (isShortcut) {
      if (isFlagshipApp()) {
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
    } else if (isNote) {
      try {
        const fetchedURL = await models.note.fetchURL(client, file)

        /**
         * Not using AppLinker here because it would require too much refactoring and would be risky
         * Instead we use the webviewIntent programmatically to open the cozy-note app on the note href
         */
        if (isFlagshipApp() && webviewIntent)
          return webviewIntent.call('openApp', fetchedURL, { slug: 'notes' })

        replaceCurrentUrl(fetchedURL)
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else if (isOnlyOffice && isOfficeEnabled) {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        openInNewTab(
          makeOnlyOfficeFileRoute(file.id, {
            withoutRouter: true,
            fromPathname: pathname,
            fromPublicFolder
          })
        )
      } else {
        routeTo(
          makeOnlyOfficeFileRoute(file.id, {
            fromPathname: pathname,
            fromPublicFolder
          })
        )
      }
    } else {
      navigateToFile(file)
    }
  }

export default createFileOpeningHandler

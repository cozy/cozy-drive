import { models, Q } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { DOCTYPE_FILES_SHORTCUT } from 'lib/doctypes'
import generateShortcutUrl from 'modules/views/Folder/generateShortcutUrl'
import {
  makeOnlyOfficeFileRoute,
  makeOnlyOfficeURL
} from 'modules/views/OnlyOffice/helpers'

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
    showAlert,
    t,
    fromPublicFolder = false
  }) =>
  async ({ event, file }) => {
    const isNote = models.file.isNote(file)
    const isShortcut = models.file.isShortcut(file)
    const isOnlyOffice = models.file.shouldBeOpenedByOnlyOffice(file)

    if (isShortcut) {
      if (
        file.cozyMetadata?.createdByApp === 'nextcloud' &&
        flag('drive.show-nextcloud-dev')
      ) {
        routeTo(`/nextcloud/${file.cozyMetadata.sourceAccount}`)
      } else if (isFlagshipApp()) {
        try {
          const resp = await client.query(
            Q(DOCTYPE_FILES_SHORTCUT).getById(file.id)
          )
          replaceCurrentUrl(resp.data.attributes.url)
        } catch (error) {
          showAlert({
            message: t('alert.could_not_open_file'),
            severity: 'error'
          })
        }
      } else {
        const url = generateShortcutUrl({
          file,
          client,
          isFlatDomain,
          fromPublicFolder
        })
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
        showAlert({ message: t('alert.offline'), severity: 'error' })
      }
    } else if (isOnlyOffice && isOfficeEnabled) {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        const onlyOfficeURL = makeOnlyOfficeURL(file, client, {
          fromPathname: pathname,
          fromPublicFolder
        })
        openInNewTab(onlyOfficeURL)
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

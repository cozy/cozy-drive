import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import toolbarContainer from 'drive/web/modules/drive/Toolbar/toolbar'

import styles from 'drive/styles/toolbar.styl'
import { withClient, models } from 'cozy-client'
import useAppLinkWithStoreFallback from './useAppLinkWithStoreFallBack'

const CreateNoteItem = ({ client, t, displayedFolder }) => {
  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    'notes',
    client
  )

  return (
    <a
      data-test-id="create-a-note"
      className={styles['fil-action-create-note']}
      onClick={async () => {
        if (!fetchStatus) return
        if (isInstalled) {
          const { data: file } = await models.note.createNoteDocument(
            client,
            displayedFolder.id
          )
          window.location.href = await models.note.generateUrlForNoteWithReturnUrl(
            url,
            file,
            window.location.href
          )
        } else {
          window.location.href = url
        }
      }}
    >
      {t('toolbar.menu_create_note')}
    </a>
  )
}

export default translate()(withClient(toolbarContainer(CreateNoteItem)))

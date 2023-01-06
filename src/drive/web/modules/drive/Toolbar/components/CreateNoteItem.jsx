import React from 'react'
import get from 'lodash/get'

import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

import {
  withClient,
  generateWebLink,
  models,
  useAppLinkWithStoreFallback,
  useCapabilities
} from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker/native'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'

import { useDisplayedFolder } from 'drive/web/modules/selectors'

const CreateNoteItem = ({ client, t }) => {
  const displayedFolder = useDisplayedFolder()
  const { capabilities } = useCapabilities(client)
  const isFlatDomain = get(capabilities, 'flat_subdomains')
  const webviewIntent = useWebviewIntent()

  let notesAppUrl = undefined
  let notesAppIsInstalled = true

  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    'notes',
    client
  )
  if (fetchStatus === 'loaded') {
    notesAppUrl = url
    notesAppIsInstalled = isInstalled
  }

  let returnUrl = ''
  if (displayedFolder) {
    if (isFlagshipApp() && webviewIntent) {
      returnUrl = generateWebLink({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: isFlatDomain ? 'flat' : 'nested',
        pathname: '',
        hash: `/files/${displayedFolder.id}`
      })
    } else {
      returnUrl = generateUniversalLink({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: isFlatDomain ? 'flat' : 'nested',
        nativePath: `/files/${displayedFolder.id}`
      })
    }
  }

  return (
    <ActionMenuItem
      data-testid="create-a-note"
      left={<Icon icon={IconNote} />}
      onClick={async () => {
        if (notesAppUrl === undefined) return
        if (notesAppIsInstalled) {
          const { data: file } = await client.create('io.cozy.notes', {
            dir_id: displayedFolder.id
          })

          const privateUrl = await models.note.generatePrivateUrl(
            notesAppUrl,
            file,
            { returnUrl }
          )

          /**
           * Not using AppLinker here because it would require too much refactoring and would be risky
           * Instead we use the webviewIntent programmatically to open the cozy-note app on the note href
           */
          if (isFlagshipApp() && webviewIntent)
            return webviewIntent.call('openApp', privateUrl, { slug: 'notes' })

          window.location.href = privateUrl
        } else {
          window.location.href = notesAppUrl
        }
      }}
    >
      {t('toolbar.menu_create_note')}
    </ActionMenuItem>
  )
}

export default translate()(withClient(CreateNoteItem))

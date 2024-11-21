import get from 'lodash/get'
import React from 'react'

import {
  withClient,
  generateWebLink,
  models,
  useAppLinkWithStoreFallback,
  useCapabilities
} from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker/native'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const CreateNoteItem = ({ client, t, displayedFolder }) => {
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

  const handleClick = async () => {
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
  }

  return (
    <ActionsMenuItem data-testid="create-a-note" onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={IconNote} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_create_note')} />
    </ActionsMenuItem>
  )
}

export default translate()(withClient(CreateNoteItem))

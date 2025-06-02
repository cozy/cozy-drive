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
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import IconDocs from '@/assets/icons/icon-docs.svg'
import { displayedFolderOrRootFolder } from '@/hooks/helpers'

const CreateDocsItem = ({
  client,
  t,
  displayedFolder,
  isReadOnly,
  onClick
}) => {
  const { capabilities } = useCapabilities(client)
  const isFlatDomain = get(capabilities, 'flat_subdomains')
  const webviewIntent = useWebviewIntent()
  const { showAlert } = useAlert()

  const _displayedFolder = displayedFolderOrRootFolder(displayedFolder)

  const handleClick = async () => {
    if (isReadOnly) {
      showAlert({
        message: t(
          'AddMenu.readOnlyFolder',
          'This is a read-only folder. You cannot perform this action.'
        ),
        severity: 'warning'
      })
      onClick()
      return
    }

    const url = generateWebLink({
      slug: 'docs',
      cozyUrl: client.getStackClient().uri,
      subDomainType: isFlatDomain ? 'flat' : 'nested',
      pathname: '',
      hash: `/bridge/docs/new/${_displayedFolder._id}`
    })
    console.log('url : ', url)
    // http://docs.cozy.localhost:8080/#/bridge/docs/new

    window.location.href = url
    // if (notesAppIsInstalled) {
    //   const { data: file } = await client.create('io.cozy.notes', {
    //     dir_id: _displayedFolder.id
    //   })

    //   const privateUrl = await models.note.generatePrivateUrl(
    //     notesAppUrl,
    //     file,
    //     { returnUrl }
    //   )

    //   /**
    //    * Not using AppLinker here because it would require too much refactoring and would be risky
    //    * Instead we use the webviewIntent programmatically to open the cozy-note app on the note href
    //    */
    //   if (isFlagshipApp() && webviewIntent)
    //     return webviewIntent.call('openApp', privateUrl, { slug: 'notes' })

    //   window.location.href = privateUrl
    // } else {
    //   window.location.href = notesAppUrl
    // }
  }

  return (
    <ActionsMenuItem data-testid="create-a-note" onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={IconDocs} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_create_docs')} />
    </ActionsMenuItem>
  )
}

export default translate()(withClient(CreateDocsItem))

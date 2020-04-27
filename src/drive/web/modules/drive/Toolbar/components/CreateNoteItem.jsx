import React from 'react'
import get from 'lodash/get'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import {
  withClient,
  models,
  useAppLinkWithStoreFallback,
  useCapabilities
} from 'cozy-client'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker/native'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'

import toolbarContainer from 'drive/web/modules/drive/Toolbar/toolbar'

const CreateNoteItem = ({ client, t, displayedFolder }) => {
  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    'notes',
    client
  )
  const capabilities = useCapabilities(client)
  const isFlatDomain = get(
    capabilities,
    'capabilities.data.attributes.flat_subdomains'
  )
  let returnUrl = ''
  if (displayedFolder) {
    returnUrl = generateUniversalLink({
      slug: 'drive',
      cozyUrl: client.getStackClient().uri,
      subDomainType: isFlatDomain ? 'flat' : 'nested',
      nativePath: `/files/${displayedFolder.id}`
    })
  }

  return (
    <ActionMenuItem
      data-test-id="create-a-note"
      left={<Icon icon="note" />}
      onClick={async () => {
        if (!fetchStatus) return
        if (isInstalled) {
          const { data: file } = await client.create('io.cozy.notes', {
            dir_id: displayedFolder.id
          })

          window.location.href = await models.note.generatePrivateUrl(
            url,
            file,
            { returnUrl }
          )
        } else {
          window.location.href = url
        }
      }}
    >
      {t('toolbar.menu_create_note')}
    </ActionMenuItem>
  )
}

export default translate()(withClient(toolbarContainer(CreateNoteItem)))

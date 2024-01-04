import React from 'react'

import { Button } from 'cozy-ui/transpiled/react'
import { useVaultClient } from 'cozy-keys-lib'
import { useClient } from 'cozy-client'

import { downloadFile } from './helpers'

const NoViewerButton = ({ file, t }) => {
  const client = useClient()
  const vaultClient = useVaultClient()
  return (
    <Button
      onClick={() => downloadFile(client, file, { vaultClient })}
      label={t('Viewer.noviewer.download')}
    />
  )
}

export default NoViewerButton

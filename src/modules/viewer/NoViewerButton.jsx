import React from 'react'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { Button } from 'cozy-ui/transpiled/react'

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

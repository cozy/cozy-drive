import React from 'react'
import { Link } from 'react-router-dom'

import { useClient, generateWebLink } from 'cozy-client'
import { isAndroid } from 'cozy-device-helper'

import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useBackupData } from 'photos/ducks/backup/hooks/useBackupData'

const OpenBackupButton = () => {
  const client = useClient()
  const { t } = useI18n()
  const { backupInfo } = useBackupData()

  if (!backupInfo) {
    return null
  }

  if (isAndroid()) {
    const cozyURL = new URL(client.getStackClient().uri)
    const app = 'drive'
    const nativePath = `/folder/${backupInfo.remoteBackupConfig.backupFolder.id}`
    const { subdomain: subDomainType } = client.getInstanceOptions()

    return (
      <AppLinker
        app={{ slug: app }}
        nativePath={nativePath}
        href={generateWebLink({
          pathname: '/',
          cozyUrl: cozyURL.origin,
          slug: app,
          hash: nativePath,
          subDomainType
        })}
      >
        {({ onClick }) => (
          <Button
            className="u-mt-half"
            label={t('Backup.actions.openInDrive')}
            variant="secondary"
            onClick={onClick}
          />
        )}
      </AppLinker>
    )
  }

  return (
    <Button
      component={Link}
      to="/photos"
      className="u-mt-half"
      label={t('Backup.actions.viewMyPhotos')}
      variant="secondary"
    />
  )
}

export default OpenBackupButton

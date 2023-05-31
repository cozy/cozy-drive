import React, { useState } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Alert from 'cozy-ui/transpiled/react/Alert'
import { InstallFlagshipAppDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

const InstallAppAlert = () => {
  const { t } = useI18n()

  const [isInstallFlagshipAppDialogOpen, setIsInstallFlagshipAppDialogOpen] =
    useState(false)

  return (
    <>
      <Alert
        action={
          <Button
            variant="text"
            size="small"
            label={t('Backup.InstallAppAlert.install')}
            onClick={() => {
              setIsInstallFlagshipAppDialogOpen(true)
            }}
          />
        }
        className="u-mt-1"
      >
        {t('Backup.InstallAppAlert.description')}
      </Alert>
      {isInstallFlagshipAppDialogOpen && (
        <InstallFlagshipAppDialog
          onClose={() => {
            setIsInstallFlagshipAppDialogOpen(false)
          }}
        />
      )}
    </>
  )
}

export default InstallAppAlert

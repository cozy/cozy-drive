import React from 'react'

import { QuotaPaywall } from 'cozy-ui/transpiled/react/Paywall'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import Alert from 'cozy-ui/transpiled/react/Alert'

import { shouldDisplayQuotaPaywall } from 'photos/ducks/backup/helpers/error'
import { useBackupActions } from '../hooks/useBackupActions'

export const BackupError = () => {
  const { backupError, setBackupError } = useBackupActions()

  if (backupError === null) return null

  const onClose = () => {
    setBackupError(null)
  }

  return shouldDisplayQuotaPaywall(backupError) ? (
    <QuotaPaywall onClose={onClose} />
  ) : (
    <Snackbar
      open={backupError}
      onClose={onClose}
      autoHideDuration={5000}
      className="u-mb-half"
      style={{ bottom: 'var(--sidebarHeight)' }}
    >
      <Alert variant="filled" elevation={6} severity="error" onClose={onClose}>
        {backupError.message}
      </Alert>
    </Snackbar>
  )
}

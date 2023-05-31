import React from 'react'

import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import Alert from 'cozy-ui/transpiled/react/Alert'

import { useBackupActions } from '../hooks/useBackupActions'

export const BackupError = () => {
  const { backupError, setBackupError } = useBackupActions()

  if (backupError === null) return null

  const onClose = () => {
    setBackupError(null)
  }

  return (
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

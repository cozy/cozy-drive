import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useBackupData } from '../hooks/useBackupData'

const LastBackupStatus = () => {
  const { t } = useI18n()

  const { backupInfo } = useBackupData()

  if (!backupInfo || !backupInfo.lastBackup) return null

  const {
    lastBackup: {
      status,
      errorMessage,
      backedUpMediaCount,
      totalMediasToBackupCount
    }
  } = backupInfo

  let lastBackupDescription

  if (status === 'success' && totalMediasToBackupCount > 0) {
    if (backedUpMediaCount === totalMediasToBackupCount) {
      lastBackupDescription = t('Backup.LastBackupStatus.success', {
        smart_count: totalMediasToBackupCount
      })
    } else {
      lastBackupDescription = t('Backup.LastBackupStatus.partialSuccess', {
        smart_count: totalMediasToBackupCount,
        backedUpMediaCount
      })
    }
  } else if (status === 'error') {
    lastBackupDescription = errorMessage
  } else {
    return null
  }

  return (
    <Typography className="u-mt-1-half" align="center">
      {t('Backup.LastBackupStatus.lastBackup')} {lastBackupDescription}
    </Typography>
  )
}

export default LastBackupStatus

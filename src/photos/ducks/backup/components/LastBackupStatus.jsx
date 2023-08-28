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
      message,
      backedUpMediaCount,
      totalMediasToBackupCount
    }
  } = backupInfo

  return (
    <Typography className="u-mt-1-half" align="center">
      {t('Backup.LastBackupStatus.lastBackup')}
      {status === 'success' ? t('Backup.LastBackupStatus.success') : null}
      {t('Backup.LastBackupStatus.backedUpElements', {
        smart_count: totalMediasToBackupCount,
        backedUpMediaCount
      })}
      {message ? ` (${message})` : null}
    </Typography>
  )
}

export default LastBackupStatus

import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useBackupData } from '../hooks/useBackupData'

const BackupDescription = () => {
  const { t } = useI18n()

  const { backupInfo } = useBackupData()

  const hasAlreadyStartedABackup =
    backupInfo?.currentBackup?.status === 'running' ||
    backupInfo?.currentBackup?.status === 'done' ||
    backupInfo?.lastBackup

  return (
    <>
      {!hasAlreadyStartedABackup && (
        <Typography className="u-mt-1-half" align={'center'}>
          {t('Backup.description.first')}
        </Typography>
      )}
      <Typography variant="caption" className="u-mt-1" align={'center'}>
        {t('Backup.description.second')}
      </Typography>
    </>
  )
}

export default BackupDescription

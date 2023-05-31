import React from 'react'
import cx from 'classnames'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react'

import styles from '../../../styles/backup.styl'
import { useBackupData } from '../hooks/useBackupData'

const BackupInfo = () => {
  const { t } = useI18n()

  const { backupInfo } = useBackupData()

  if (!backupInfo) return null

  const {
    currentBackup: { status, mediasToBackupCount }
  } = backupInfo

  if (status === 'ready' && mediasToBackupCount > 0) {
    return (
      <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
        <Alert severity="primary">
          <AlertTitle>
            {t('Backup.info.notBackedUpElements', {
              smart_count: backupInfo.currentBackup.mediasToBackupCount
            })}
          </AlertTitle>
          {t('Backup.info.pressStartBackup')}
        </Alert>
      </div>
    )
  }

  return null
}

export default BackupInfo

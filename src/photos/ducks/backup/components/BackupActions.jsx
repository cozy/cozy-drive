import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useBackupActions } from '../hooks/useBackupActions'
import { useBackupData } from '../hooks/useBackupData'
import OpenBackupButton from 'photos/ducks/backup/components/OpenBackupButton'

const BackupActions = () => {
  const { t } = useI18n()

  const { backupInfo } = useBackupData()
  const {
    backupPermissions,
    prepareBackup,
    startBackup,
    stopBackup,
    requestBackupPermissions
  } = useBackupActions()

  if (!backupPermissions) return null

  if (backupPermissions.granted) {
    if (!backupInfo) return null

    const {
      currentBackup: { status, mediasToBackupCount, totalMediasToBackupCount }
    } = backupInfo

    if (status === 'running') {
      return (
        <div className="u-mt-1 u-flex u-flex-column u-flex-justify-center">
          <Button
            label={t('Backup.actions.backupInProgress', {
              alreadyBackupedCount:
                totalMediasToBackupCount - mediasToBackupCount,
              totalCount: totalMediasToBackupCount
            })}
            variant="primary"
            disabled
            onClick={startBackup}
            startIcon={
              <Icon icon={SpinnerIcon} spin aria-hidden focusable="false" />
            }
          />
          <Button
            className="u-mt-half"
            label={t('Backup.actions.cancel')}
            variant="secondary"
            onClick={stopBackup}
          />
        </div>
      )
    } else if (status === 'initializing') {
      return (
        <div className="u-mt-1-half u-flex u-flex-column u-flex-justify-center">
          <Button
            label={t('Backup.actions.startBackup')}
            variant="primary"
            disabled
            startIcon={<Icon icon={SyncIcon} />}
          />
        </div>
      )
    }

    if (mediasToBackupCount === 0) {
      return (
        <div className="u-mt-1-half u-flex u-flex-column u-flex-justify-center">
          <Button
            label={t('Backup.actions.saved')}
            variant="primary"
            color="success"
            onClick={prepareBackup}
            startIcon={<Icon icon={CheckIcon} />}
          />
          <OpenBackupButton />
        </div>
      )
    } else {
      return (
        <div className="u-mt-1-half u-flex u-flex-justify-center">
          <Button
            label={t('Backup.actions.startBackup')}
            variant="primary"
            onClick={startBackup}
            startIcon={<Icon icon={SyncIcon} />}
          />
        </div>
      )
    }
  } else {
    return (
      <div className="u-mt-1-half u-flex u-flex-justify-center">
        <Button
          label={t('Backup.actions.startBackup')}
          variant="primary"
          onClick={requestBackupPermissions}
          startIcon={<Icon icon={SyncIcon} />}
        />
      </div>
    )
  }
}

export default BackupActions

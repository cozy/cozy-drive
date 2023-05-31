import React from 'react'

import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

import PhotoSync from '../../../assets/illustrations/cozy-photo-sync.svg'
import { useBackupActions } from '../hooks/useBackupActions'

const AllowPermissionsModal = () => {
  const { t } = useI18n()
  const {
    isAllowPermissionsModalOpen,
    setIsAllowPermissionsModalOpen,
    openAppOSSettings
  } = useBackupActions()

  const onCancel = () => {
    setIsAllowPermissionsModalOpen(false)
  }

  const onAllow = () => {
    setIsAllowPermissionsModalOpen(false)
    openAppOSSettings()
  }

  return (
    <IllustrationDialog
      open={isAllowPermissionsModalOpen}
      size="small"
      transitionDuration={0}
      onClose={onCancel}
      componentsProps={{ dialogTitle: { className: 'u-pt-2' } }}
      title={<img src={PhotoSync} style={{ width: '10rem' }} aria-hidden />}
      content={
        <div className="u-ta-center">
          <Typography gutterBottom variant="h3" color="textPrimary">
            {t('Backup.AllowPermissionsModal.title')}
          </Typography>
          <Typography gutterBottom variant="body1" color="textPrimary">
            {t('Backup.AllowPermissionsModal.description')}
          </Typography>
        </div>
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('Backup.AllowPermissionsModal.cancel')}
            onClick={onCancel}
          />
          <Button
            variant="primary"
            label={t('Backup.AllowPermissionsModal.allow')}
            onClick={onAllow}
          />
        </>
      }
    />
  )
}

export default AllowPermissionsModal

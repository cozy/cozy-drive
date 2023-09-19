import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import PhotoUpload from 'photos/assets/illustrations/cozy-photo-upload.svg'

const BackupHeader = () => {
  const { t } = useI18n()

  return (
    <div className="u-flex u-flex-column u-flex-items-center">
      <img src={PhotoUpload} style={{ width: '8rem' }} aria-hidden />
      <Typography variant="h4" className="u-mt-1">
        {t('Backup.header.title')}
      </Typography>
    </div>
  )
}

export default BackupHeader

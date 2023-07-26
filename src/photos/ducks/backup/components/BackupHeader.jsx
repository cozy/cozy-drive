import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PhotoSync from 'photos/assets/illustrations/cozy-photo-sync.svg'

const BackupHeader = () => {
  const { t } = useI18n()

  return (
    <div className="u-flex u-flex-column u-flex-items-center">
      <img src={PhotoSync} style={{ width: '8rem' }} aria-hidden />
      <Typography variant="h4" className="u-mt-1">
        {t('Backup.header.title')}
      </Typography>
    </div>
  )
}

export default BackupHeader

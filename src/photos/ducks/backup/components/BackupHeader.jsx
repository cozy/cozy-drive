import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { Icon } from 'cozy-ui/transpiled/react'
import PhoneUploadIcon from 'cozy-ui/transpiled/react/Icons/PhoneUpload'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const BackupHeader = () => {
  const { t } = useI18n()

  return (
    <div className="u-flex u-flex-column u-flex-items-center">
      <Icon icon={PhoneUploadIcon} size="64" color="var(--iconTextColor)" />
      <Typography variant="h4" className="u-mt-1">
        {t('Backup.header.title')}
      </Typography>
    </div>
  )
}

export default BackupHeader

import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useBreakpoints } from 'cozy-ui/transpiled/react'

const BackupDescription = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <>
      <Typography className="u-mt-1-half" align={isMobile ? 'center' : 'left'}>
        {t('Backup.description.first')}
      </Typography>
      <Typography className="u-mt-1" align={isMobile ? 'center' : 'left'}>
        {t('Backup.description.second')}
      </Typography>
    </>
  )
}

export default BackupDescription

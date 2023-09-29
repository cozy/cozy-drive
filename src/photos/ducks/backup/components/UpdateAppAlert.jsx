import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alert from 'cozy-ui/transpiled/react/Alert'

const UpdateAppAlert = () => {
  const { t } = useI18n()

  return (
    <Alert className="u-mt-1">{t('Backup.UpdateAppAlert.description')}</Alert>
  )
}

export default UpdateAppAlert

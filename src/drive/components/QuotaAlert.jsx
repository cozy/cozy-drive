import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const QuotaAlert = ({ t, close }) => (
  <Modal
    title={t('quotaalert.title')}
    description={<p>{t('quotaalert.desc')}</p>}
    primaryText={t('quotaalert.confirm')}
    primaryAction={close}
    secondaryAction={close}
  />
)

export default QuotaAlert

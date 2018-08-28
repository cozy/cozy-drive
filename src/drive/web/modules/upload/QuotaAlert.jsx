import React from 'react'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'

const QuotaAlert = ({ t, onClose }) => (
  <Modal
    title={t('quotaalert.title')}
    description={<p>{t('quotaalert.desc')}</p>}
    primaryText={t('quotaalert.confirm')}
    primaryAction={onClose}
    secondaryAction={onClose}
  />
)

export default translate()(QuotaAlert)

import React from 'react'
import classNames from 'classnames'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/confirms.styl'

const EmptyTrashConfirm = ({ t, onConfirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={type}
    >
      {t(`emptytrashconfirmation.${type}`)}
    </p>
  ))

  return (
    <Modal
      title={t('emptytrashconfirmation.title')}
      description={confirmationTexts}
      secondaryType="secondary"
      secondaryText={t('emptytrashconfirmation.cancel')}
      secondaryAction={onClose}
      primaryType="danger"
      primaryText={t('emptytrashconfirmation.delete')}
      primaryAction={async () => {
        await onConfirm()
        onClose()
      }}
    />
  )
}

export default translate()(EmptyTrashConfirm)

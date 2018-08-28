import React from 'react'
import classNames from 'classnames'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'

import styles from 'drive/styles/confirms'

const EmptyTrashConfirm = ({ t, onConfirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
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
      primaryAction={() =>
        onConfirm()
          .then(onClose)
          .catch(onClose)
      }
    />
  )
}

export default translate()(EmptyTrashConfirm)

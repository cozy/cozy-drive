import styles from '../../../styles/confirms'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const DestroyConfirm = ({ t, fileCount, confirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
    >
      {t(`destroyconfirmation.${type}`, fileCount)}
    </p>
  ))

  return (
    <Modal
      title={t('destroyconfirmation.title', fileCount)}
      description={confirmationTexts}
      secondaryType="secondary"
      secondaryText={t('destroyconfirmation.cancel')}
      secondaryAction={onClose}
      primaryType="danger"
      primaryText={t('destroyconfirmation.delete')}
      primaryAction={() =>
        confirm()
          .then(onClose)
          .catch(onClose)
      }
    />
  )
}

export default DestroyConfirm

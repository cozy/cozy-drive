import React from 'react'
import classNames from 'classnames'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/confirms.styl'

const DestroyConfirm = ({ t, fileCount, confirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={`key_destroy_${type}`}
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
      primaryAction={async () => {
        try {
          await confirm()
          onClose()
        } catch {
          onClose()
        }
      }}
    />
  )
}

export default translate()(DestroyConfirm)

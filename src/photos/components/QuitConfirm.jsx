import styles from '../styles/confirms.styl'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const QuitConfirm = ({ t, confirm, abort }) => {
  const confirmationTexts = ['forbidden'].map(type => (
    <p
      key={`key_quit_${type}`}
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
    >
      {t(`quitconfirmation.${type}`)}
    </p>
  ))

  return (
    <Modal
      title={t('quitconfirmation.title')}
      description={confirmationTexts}
      secondaryType="secondary"
      secondaryText={t('quitconfirmation.cancel')}
      secondaryAction={abort}
      primaryType="danger"
      primaryText={t('quitconfirmation.quit')}
      primaryAction={confirm}
    />
  )
}

export default QuitConfirm

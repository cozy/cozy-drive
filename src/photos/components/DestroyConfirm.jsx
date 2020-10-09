import styles from '../styles/confirms.styl'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/transpiled/react/Modal'

const DestroyConfirm = ({ t, confirm, abort }) => {
  const confirmationTexts = ['forbidden', 'eye', 'link'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={type}
    >
      {t(`destroyconfirmation.${type}`)}
    </p>
  ))

  return (
    <Modal
      title={t('destroyconfirmation.title')}
      description={confirmationTexts}
      secondaryType="secondary"
      dismissAction={abort}
      secondaryText={t('destroyconfirmation.cancel')}
      secondaryAction={abort}
      primaryType="danger"
      primaryText={t('destroyconfirmation.delete')}
      primaryAction={confirm}
    />
  )
}

export default DestroyConfirm

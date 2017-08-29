import styles from '../styles/confirms'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const DestroyConfirm = ({ t, albumName, confirm, abort }) => {
  const confirmationTexts = ['forbidden', 'eye', 'link'].map(type => (
    <p className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}>
      {t(`destroyconfirmation.${type}`)}
    </p>
  ))

  return (<Modal
    title={t('destroyconfirmation.title')}
    description={confirmationTexts}
    secondaryType='secondary'
    secondaryText={t('destroyconfirmation.cancel')}
    secondaryAction={abort}
    primaryType='danger'
    primaryText={t('destroyconfirmation.delete')}
    primaryAction={confirm}
   />)
}

export default DestroyConfirm

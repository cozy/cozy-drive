import styles from '../../../styles/confirms'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const EmptyTrashConfirm = ({ t, confirm, abort }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}>
      {t(`emptytrashconfirmation.${type}`)}
    </p>
  ))

  return (<Modal
    title={t('emptytrashconfirmation.title')}
    description={confirmationTexts}
    secondaryType='secondary'
    secondaryText={t('emptytrashconfirmation.cancel')}
    secondaryAction={abort}
    primaryType='danger'
    primaryText={t('emptytrashconfirmation.delete')}
    primaryAction={confirm}
   />)
}

export default EmptyTrashConfirm

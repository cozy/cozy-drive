import styles from '../styles/confirms'
import classNames from 'classnames'

import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const DeleteConfirm = ({ t, fileCount, referenced, confirm, abort }) => {
  let messageTypes = ['trash', 'restore', 'shared']
  if (referenced) messageTypes.push('referenced')
  const deleteConfirmationTexts = messageTypes.map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
    >
      {t(`deleteconfirmation.${type}`, fileCount)}
    </p>
  ))

  return (
    <Modal
      title={t('deleteconfirmation.title', fileCount)}
      description={deleteConfirmationTexts}
      secondaryText={t('deleteconfirmation.cancel')}
      secondaryAction={abort}
      secondaryType="secondary"
      primaryType="danger"
      primaryText={t('deleteconfirmation.delete')}
      primaryAction={confirm}
    />
  )
}

export default DeleteConfirm

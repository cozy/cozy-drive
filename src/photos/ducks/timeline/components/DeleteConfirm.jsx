import styles from '../../../styles/confirms'
import classNames from 'classnames'
import React from 'react'
import Modal from 'cozy-ui/react/Modal'

const DeleteConfirm = ({ t, count, confirm, abort, related }) => {
  let types = ['trash', 'restore', 'shared']
  if (related === true) {
    types.push('related')
  }
  const deleteConfirmationTexts = types.map(type => (
    <p className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}>
      {t(`timeline.DeleteConfirm.${type}`, count)}
    </p>
  ))

  return (<Modal
    title={t('timeline.DeleteConfirm.title', count)}
    description={deleteConfirmationTexts}
    secondaryType='secondary'
    secondaryText={t('timeline.DeleteConfirm.cancel')}
    secondaryAction={abort}
    primaryType='danger'
    primaryText={t('timeline.DeleteConfirm.delete')}
    primaryAction={confirm}
   />)
}

export default DeleteConfirm

import styles from '../../../styles/confirms.styl'
import classNames from 'classnames'
import React from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'

const DeleteConfirm = ({ t, count, confirm, onClose, related }) => {
  let types = ['trash', 'restore', 'shared']
  if (related === true) {
    types.push('related')
  }
  const deleteConfirmationTexts = types.map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={`key_delet_${type}`}
    >
      {t(`timeline.DeleteConfirm.${type}`, count)}
    </p>
  ))

  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('timeline.DeleteConfirm.title', count)}
      content={deleteConfirmationTexts}
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('timeline.DeleteConfirm.cancel')}
          />
          <Button
            theme="danger"
            label={t('timeline.DeleteConfirm.delete')}
            onClick={confirm}
          />
        </>
      }
    />
  )
}

export default DeleteConfirm

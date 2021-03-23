import styles from '../styles/confirms.styl'
import classNames from 'classnames'

import React from 'react'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Button'

const QuitConfirm = ({ t, confirm, onClose }) => {
  const confirmationTexts = ['forbidden'].map(type => (
    <p
      key={`key_quit_${type}`}
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
    >
      {t(`quitconfirmation.${type}`)}
    </p>
  ))
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('quitconfirmation.title')}
      content={confirmationTexts}
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('quitconfirmation.cancel')}
          />
          <Button
            theme="danger"
            label={t('quitconfirmation.quit')}
            onClick={confirm}
          />
        </>
      }
    />
  )
}

export default QuitConfirm

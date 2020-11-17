import React from 'react'
import classNames from 'classnames'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/confirms.styl'

const EmptyTrashConfirm = ({ t, onConfirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={type}
    >
      {t(`emptytrashconfirmation.${type}`)}
    </p>
  ))
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('emptytrashconfirmation.title')}
      content={confirmationTexts}
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('emptytrashconfirmation.cancel')}
          />
          <Button
            theme="danger"
            label={t('emptytrashconfirmation.delete')}
            onClick={async () => {
              await onConfirm()
              onClose()
            }}
          />
        </>
      }
    />
  )
}

export default translate()(EmptyTrashConfirm)

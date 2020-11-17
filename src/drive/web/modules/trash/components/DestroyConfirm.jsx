import React from 'react'
import classNames from 'classnames'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { deleteFilesPermanently } from 'drive/web/modules/actions/utils'
import styles from 'drive/styles/confirms.styl'

const DestroyConfirm = ({ t, files, onClose }) => {
  const client = useClient()
  const confirmationTexts = ['forbidden', 'restore'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={`key_destroy_${type}`}
    >
      {t(`destroyconfirmation.${type}`, files.length)}
    </p>
  ))
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('destroyconfirmation.title', files.length)}
      content={confirmationTexts}
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('destroyconfirmation.cancel')}
          />
          <Button
            theme="danger"
            label={t('destroyconfirmation.delete')}
            onClick={async () => {
              try {
                await deleteFilesPermanently(client, files)
              } catch {
                //eslint-disable-next-line
            } finally {
                onClose()
              }
            }}
          />
        </>
      }
    />
  )
}

export default translate()(DestroyConfirm)

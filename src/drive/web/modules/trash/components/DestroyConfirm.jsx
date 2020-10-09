import React from 'react'
import classNames from 'classnames'
import { useClient } from 'cozy-client'
import Modal from 'cozy-ui/transpiled/react/Modal'
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
    <Modal
      title={t('destroyconfirmation.title', files.length)}
      description={confirmationTexts}
      secondaryType="secondary"
      secondaryText={t('destroyconfirmation.cancel')}
      dismissAction={onClose}
      secondaryAction={onClose}
      primaryType="danger"
      primaryText={t('destroyconfirmation.delete')}
      primaryAction={async () => {
        try {
          await deleteFilesPermanently(client, files)
        } catch {
          //eslint-disable-next-line
        } finally {
          onClose()
        }
      }}
    />
  )
}

export default translate()(DestroyConfirm)

import React, { useCallback } from 'react'
import classNames from 'classnames'
import { useClient } from 'cozy-client'
import Modal, { ModalDescription } from 'cozy-ui/transpiled/react/Modal'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { SharedDocument, SharedRecipientsList } from 'cozy-sharing'

import { trashFiles } from 'drive/web/modules/actions/utils'
import styles from 'drive/styles/confirms.styl'

const Message = ({ type, fileCount }) => {
  const { t } = useI18n()
  return (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
    >
      {t(`deleteconfirmation.${type}`, fileCount)}
    </p>
  )
}

export const DeleteConfirm = ({
  files,
  referenced,
  afterConfirmation,
  onClose,
  children
}) => {
  const { t } = useI18n()
  const fileCount = files.length
  const client = useClient()

  const onDelete = useCallback(
    async () => {
      await trashFiles(client, files)
      afterConfirmation()
      onClose()
    },
    [client, files, afterConfirmation, onClose]
  )

  return (
    <Modal
      title={t('deleteconfirmation.title', fileCount)}
      secondaryText={t('deleteconfirmation.cancel')}
      secondaryAction={onClose}
      secondaryType="secondary"
      primaryType="danger"
      primaryText={t('deleteconfirmation.delete')}
      primaryAction={onDelete}
    >
      <ModalDescription>
        <Message type="trash" fileCount={fileCount} />
        <Message type="restore" fileCount={fileCount} />
        {referenced && <Message type="referenced" fileCount={fileCount} />}
        {children}
      </ModalDescription>
    </Modal>
  )
}

const DeleteConfirmWithSharingContext = ({ files, ...rest }) =>
  files.length !== 1 ? (
    <DeleteConfirm files={files} {...rest} />
  ) : (
    <SharedDocument docId={files[0].id}>
      {({ isSharedByMe }) => (
        <DeleteConfirm files={files} {...rest}>
          {isSharedByMe && <Message type="shared" fileCount={files.length} />}
          {isSharedByMe && (
            <SharedRecipientsList
              className={styles['fil-confirm-recipients']}
              docId={files[0].id}
            />
          )}
        </DeleteConfirm>
      )}
    </SharedDocument>
  )

export default DeleteConfirmWithSharingContext

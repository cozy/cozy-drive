import React from 'react'
import classNames from 'classnames'
import Modal, { ModalDescription } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { SharedDocument, SharedRecipientsList } from 'cozy-sharing'

import styles from 'drive/styles/confirms.styl'

const Message = translate()(({ t, type, fileCount }) => (
  <p className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}>
    {t(`deleteconfirmation.${type}`, fileCount)}
  </p>
))

const DeleteConfirm = ({
  t,
  files,
  referenced,
  onConfirm,
  onClose,
  children
}) => {
  const fileCount = files.length
  return (
    <Modal
      title={t('deleteconfirmation.title', fileCount)}
      secondaryText={t('deleteconfirmation.cancel')}
      secondaryAction={onClose}
      secondaryType="secondary"
      primaryType="danger"
      primaryText={t('deleteconfirmation.delete')}
      primaryAction={() => onConfirm().then(onClose)}
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

export default translate()(DeleteConfirmWithSharingContext)

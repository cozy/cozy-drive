import React, { useCallback } from 'react'
import { useClient } from 'cozy-client'
import Modal, { ModalDescription } from 'cozy-ui/transpiled/react/Modal'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { SharedDocument, SharedRecipientsList } from 'cozy-sharing'

import { trashFiles } from 'drive/web/modules/actions/utils'

const Message = ({ type, fileCount }) => {
  const ico =
    type === 'referenced' ? 'album' : type === 'shared' ? 'share' : type

  const { t } = useI18n()
  return (
    <Media>
      <Img>
        <Icon icon={ico} color="var(--coolGrey)" />
      </Img>
      <Bd className={'u-pl-1-half'}>
        {t(`deleteconfirmation.${type}`, fileCount)}
      </Bd>
    </Media>
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
        <Stack>
          <Message type="trash" fileCount={fileCount} />
          <Message type="restore" fileCount={fileCount} />
          {referenced && <Message type="referenced" fileCount={fileCount} />}
          {children}
        </Stack>
      </ModalDescription>
    </Modal>
  )
}

const DeleteConfirmWithSharingContext = ({ files, ...rest }) =>
  files.length !== 1 ? (
    <DeleteConfirm files={files} {...rest} />
  ) : (
    <SharedDocument docId={files[0].id}>
      {({ isSharedByMe, link, recipients }) => (
        <DeleteConfirm files={files} {...rest}>
          {isSharedByMe &&
            link && <Message type="link" fileCount={files.length} />}
          {isSharedByMe &&
            recipients.length > 0 && (
              <Message type="shared" fileCount={files.length} />
            )}
          {isSharedByMe &&
            recipients.length > 0 && (
              <SharedRecipientsList className={'u-ml-1'} docId={files[0].id} />
            )}
        </DeleteConfirm>
      )}
    </SharedDocument>
  )

export default DeleteConfirmWithSharingContext

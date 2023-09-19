import React from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { Message } from 'drive/web/modules/confirm/Message'
const EmptyTrashConfirm = ({ t, onConfirm, onClose }) => {
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('emptytrashconfirmation.title')}
      content={
        <Stack>
          <Message
            icon="forbidden"
            text={t(`emptytrashconfirmation.forbidden`)}
          />
          <Message icon="restore" text={t(`emptytrashconfirmation.restore`)} />
        </Stack>
      }
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

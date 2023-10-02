import React, { useState } from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { Message } from 'drive/web/modules/confirm/Message'
const EmptyTrashConfirm = ({ t, onConfirm, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
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
            busy={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true)
                await onConfirm()
              } catch {
                // eslint-disable-next-line
              } finally {
                setIsLoading(false)
                onClose()
              }
            }}
          />
        </>
      }
    />
  )
}

export default translate()(EmptyTrashConfirm)

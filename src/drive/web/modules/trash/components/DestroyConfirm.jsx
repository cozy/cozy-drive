import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { deleteFilesPermanently } from 'drive/web/modules/actions/utils'
import { Message } from 'drive/web/modules/confirm/Message'

const DestroyConfirm = ({ files, onCancel, onConfirm }) => {
  const { t } = useI18n()
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleDestroy = async () => {
    try {
      setIsLoading(true)
      await deleteFilesPermanently(client, files)
      onConfirm()
    } catch {
      setIsLoading(false)
      onCancel()
    }
  }

  return (
    <ConfirmDialog
      open
      onClose={onCancel}
      title={t('destroyconfirmation.title', files.length)}
      content={
        <Stack>
          <Message
            icon="forbidden"
            text={t(`destroyconfirmation.forbidden`, files.length)}
          />
          <Message
            icon="restore"
            text={t(`destroyconfirmation.restore`, files.length)}
          />
        </Stack>
      }
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onCancel}
            label={t('destroyconfirmation.cancel')}
          />
          <Button
            theme="danger"
            label={t('destroyconfirmation.delete')}
            busy={isLoading}
            onClick={handleDestroy}
          />
        </>
      }
    />
  )
}

export default DestroyConfirm

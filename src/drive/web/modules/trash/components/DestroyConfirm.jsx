import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { splitFilename } from 'cozy-client/dist/models/file'

import { deleteFilesPermanently } from 'drive/web/modules/actions/utils'
import { Message } from 'drive/web/modules/confirm/Message'
import { getEntriesTypeTranslated } from 'drive/lib/entries'

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

  const entriesType = getEntriesTypeTranslated(t, files)

  return (
    <ConfirmDialog
      open
      onClose={onCancel}
      title={t('DestroyConfirm.title', {
        filename: splitFilename(files[0]).filename,
        smart_count: files.length,
        type: entriesType
      })}
      content={
        <Stack>
          <Message
            icon="forbidden"
            text={t(`DestroyConfirm.forbidden`, {
              smart_count: files.length,
              type: entriesType
            })}
          />
          <Message
            icon="restore"
            text={t(`DestroyConfirm.restore`, {
              smart_count: files.length,
              type: entriesType
            })}
          />
        </Stack>
      }
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onCancel}
            label={t('DestroyConfirm.cancel')}
          />
          <Button
            theme="danger"
            label={t('DestroyConfirm.delete')}
            busy={isLoading}
            onClick={handleDestroy}
          />
        </>
      }
    />
  )
}

export default DestroyConfirm

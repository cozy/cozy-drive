import React from 'react'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { deleteFilesPermanently } from 'drive/web/modules/actions/utils'

import { Message } from 'drive/web/modules/confirm/Message'
const DestroyConfirm = ({ t, files, onClose }) => {
  const client = useClient()
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
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
                // eslint-disable-next-line
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

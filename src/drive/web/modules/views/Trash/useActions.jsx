import React, { useContext } from 'react'
import { SharingContext } from 'cozy-sharing'

import { useClient } from 'cozy-client'
import { ModalContext } from 'drive/lib/ModalContext'
import keyBy from 'lodash/keyBy'

import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'

const useActions = () => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)

  const client = useClient()

  const actions = {
    restore: {
      icon: 'restore',
      action: async files => {
        for (const file of files) {
          await client.collection('io.cozy.files').restore(file.id)
        }
        refresh()
      }
    },
    destroy: {
      icon: 'destroy',
      action: files =>
        pushModal(
          <DestroyConfirm
            fileCount={files.length}
            confirm={async () => {
              for (const file of files) {
                await client
                  .collection('io.cozy.files')
                  .deleteFilePermanently(file.id)
              }
            }}
            onClose={popModal}
          />
        )
    }
  }

  return keyBy(Object.values(actions), 'icon')
}

export default useActions

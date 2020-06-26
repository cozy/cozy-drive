import React, { useContext } from 'react'
import { SharingContext } from 'cozy-sharing'

import { useClient } from 'cozy-client'
import { ModalContext } from 'drive/lib/ModalContext'
import keyBy from 'lodash/keyBy'
import { restoreFiles } from 'drive/web/modules/actions/utils'

import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'

const useActions = () => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)

  const client = useClient()

  const actions = {
    restore: {
      icon: 'restore',
      action: async files => {
        await restoreFiles(client, files)
        refresh()
      }
    },
    destroy: {
      icon: 'destroy',
      action: files =>
        pushModal(<DestroyConfirm files={files} onClose={popModal} />)
    }
  }

  return keyBy(Object.values(actions), 'icon')
}

export default useActions

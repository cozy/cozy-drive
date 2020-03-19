import React, { useContext } from 'react'
import { SharingContext } from 'cozy-sharing'
// import { trashFiles } from 'drive/web/modules/navigation/duck'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import { isReferencedByAlbum } from 'drive/web/modules/drive/files'
import { ModalContext } from 'drive/lib/ModalContext'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const useActions = documentId => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { hasWriteAccess, refresh } = useContext(SharingContext)

  const actions = {
    trash: {
      icon: 'trash',
      displayCondition: () => hasWriteAccess(documentId),
      action: files =>
        pushModal(
          <DeleteConfirm
            files={files}
            referenced={isAnyFileReferencedByAlbum(files)}
            onConfirm={() => {
              refresh()
              // trashFiles(files) // client.collection.delete() + Cordova delete) -> transformer en afterDelete
            }}
            onClose={popModal}
          />
        )
    }
  }

  return actions
}

export default useActions

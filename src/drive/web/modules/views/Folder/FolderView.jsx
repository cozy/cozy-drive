import React from 'react'
import { useSelector } from 'react-redux'

import { RealTimeQueries } from 'cozy-client'
import { ModalManager } from 'react-cozy-helpers'

import { ModalStack } from 'drive/lib/ModalContext'
import Main from 'drive/web/modules/layout/Main'
import { getCurrentFolderId } from 'drive/web/modules/selectors'
import useUpdateDocumentTitle from 'drive/web/modules/views/useUpdateDocumentTitle'

const FolderView = ({ children }) => {
  const currentFolderId = useSelector(getCurrentFolderId)
  useUpdateDocumentTitle(currentFolderId)

  return (
    <Main>
      <RealTimeQueries doctype="io.cozy.files" />
      <ModalStack />
      <ModalManager />
      {children}
    </Main>
  )
}

export default React.memo(FolderView)

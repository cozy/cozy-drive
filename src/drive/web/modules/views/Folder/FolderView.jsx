import React from 'react'
import { RealTimeQueries } from 'cozy-client'

import { ModalManager } from 'react-cozy-helpers'
import { ModalStack } from 'drive/lib/ModalContext'
import Main from 'drive/web/modules/layout/Main'

const FolderView = ({ children }) => {
  return (
    <Main>
      <RealTimeQueries doctype="io.cozy.files" />
      <ModalStack />
      <ModalManager />
      {children}
    </Main>
  )
}

export default FolderView

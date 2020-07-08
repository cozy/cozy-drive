import React from 'react'

import { ModalStack } from 'drive/lib/ModalContext'

import Main from 'drive/web/modules/layout/Main'

import { ModalManager } from 'react-cozy-helpers'

import RealTimeQueries from 'drive/lib/RealTimeQueries'

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

import React from 'react'

import { RealTimeQueries } from 'cozy-client'
import { ModalManager } from 'react-cozy-helpers'

import { ModalStack } from 'lib/ModalContext'
import Main from 'modules/layout/Main'
import { NotFound } from 'components/Error/NotFound'

const FolderView = ({ children, isNotFound }) => (
  <Main>
    <RealTimeQueries doctype="io.cozy.files" />
    <ModalStack />
    <ModalManager />
    {isNotFound ? <NotFound /> : children}
  </Main>
)

export default React.memo(FolderView)

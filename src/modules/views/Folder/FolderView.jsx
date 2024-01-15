import React from 'react'
import { ModalManager } from 'react-cozy-helpers'

import { RealTimeQueries } from 'cozy-client'

import { NotFound } from 'components/Error/NotFound'
import { ModalStack } from 'lib/ModalContext'
import Main from 'modules/layout/Main'

const FolderView = ({ children, isNotFound }) => (
  <Main>
    <RealTimeQueries doctype="io.cozy.files" />
    <ModalStack />
    <ModalManager />
    {isNotFound ? <NotFound /> : children}
  </Main>
)

export default React.memo(FolderView)

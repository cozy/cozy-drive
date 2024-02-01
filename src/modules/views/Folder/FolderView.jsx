import React from 'react'
import { ModalManager } from 'react-cozy-helpers'

import { NotFound } from 'components/Error/NotFound'
import FilesRealTimeQueries from 'components/FilesRealTimeQueries'
import { ModalStack } from 'lib/ModalContext'
import Main from 'modules/layout/Main'

const FolderView = ({ children, isNotFound }) => (
  <Main>
    <FilesRealTimeQueries />
    <ModalStack />
    <ModalManager />
    {isNotFound ? <NotFound /> : children}
  </Main>
)

export default React.memo(FolderView)

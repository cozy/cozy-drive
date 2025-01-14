import React from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const FilesViewerLoading = () => (
  <Backdrop isOver open>
    <Spinner size="xxlarge" middle noMargin color="var(--white)" />
  </Backdrop>
)

export { FilesViewerLoading }

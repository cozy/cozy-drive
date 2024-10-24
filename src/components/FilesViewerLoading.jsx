import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Overlay from 'cozy-ui/transpiled/react/deprecated/Overlay'

const FilesViewerLoading = () => (
  <Overlay>
    <Spinner size="xxlarge" middle noMargin color="var(--white)" />
  </Overlay>
)

export { FilesViewerLoading }

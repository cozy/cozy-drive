import React from 'react'

import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const Loading = () => {
  return (
    <DialogContent className="u-flex u-flex-items-center u-flex-justify-center">
      <span data-testid="onlyoffice-content-spinner">
        <Spinner size="xxlarge" />
      </span>
    </DialogContent>
  )
}

export default Loading

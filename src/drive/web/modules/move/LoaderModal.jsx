import React from 'react'

import { ConfirmDialog } from 'cozy-ui/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

/**
 * Loading state for move alert modal
 */
const LoaderModal = () => {
  return (
    <ConfirmDialog
      open
      content={
        <div className="u-h-3">
          <Spinner size="large" noMargin middle />
        </div>
      }
    />
  )
}

export { LoaderModal }

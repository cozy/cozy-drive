import React from 'react'

import UILoadMore from 'cozy-ui/transpiled/react/LoadMore'

const LoadMore = ({ label, fetchMore }) => {
  return (
    <div className="u-flex u-flex-justify-center u-mb-2">
      <UILoadMore label={label} fetchMore={fetchMore} />
    </div>
  )
}

export { LoadMore }

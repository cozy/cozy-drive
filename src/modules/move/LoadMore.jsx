import PropTypes from 'prop-types'
import React from 'react'

import LoadMoreButton from 'modules/filelist/LoadMore'

const LoadMore = ({ hasMore, fetchMore }) => {
  return hasMore ? (
    <LoadMoreButton onClick={fetchMore} isLoading={false} />
  ) : (
    false
  )
}

LoadMore.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired
}

export default LoadMore

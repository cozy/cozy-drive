import React from 'react'
import PropTypes from 'prop-types'
import LoadMore from 'drive/web/modules/filelist/LoadMore'

const MoveLoadMore = ({ hasMore, fetchMore }) => {
  return hasMore ? <LoadMore onClick={fetchMore} isLoading={false} /> : false
}

MoveLoadMore.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired
}

export default MoveLoadMore

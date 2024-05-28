import PropTypes from 'prop-types'
import React from 'react'

import LoadMoreButton from 'modules/filelist/LoadMore'

const FolderPickerContentLoadMore = ({ hasMore, fetchMore }) => {
  return hasMore ? (
    <LoadMoreButton onClick={fetchMore} isLoading={false} />
  ) : (
    false
  )
}

FolderPickerContentLoadMore.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired
}

export { FolderPickerContentLoadMore }

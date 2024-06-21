import React from 'react'

import LoadMoreButton from 'modules/filelist/LoadMore'

interface FolderPickerContentLoadMoreProps {
  hasMore: boolean
  fetchMore: () => void
}

const FolderPickerContentLoadMore: React.FC<
  FolderPickerContentLoadMoreProps
> = ({ hasMore, fetchMore }) => {
  if (hasMore) {
    return <LoadMoreButton onClick={fetchMore} isLoading={false} />
  }

  return null
}

export { FolderPickerContentLoadMore }

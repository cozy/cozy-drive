import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { sortFolder, getSort } from 'drive/web/modules/navigation/duck'

const useFolderSort = folderId => {
  const defaultSort = { attribute: 'name', order: 'asc' }
  const dispatch = useDispatch()
  const currentSort = useSelector(getSort) || defaultSort
  const setOrder = useCallback(
    ({ sortAttribute, sortOrder }) => {
      dispatch(sortFolder(folderId, sortAttribute, sortOrder))
    },
    [dispatch, folderId]
  )
  return [currentSort, setOrder]
}

export { useFolderSort }

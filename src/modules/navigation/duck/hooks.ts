import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { sortFolder, getSort } from 'modules/navigation/duck'

const useFolderSort = (folderId: string): [Sort, (props: Sort) => void] => {
  const defaultSort: Sort = { attribute: 'name', order: 'asc' }
  const dispatch = useDispatch()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const currentSort = (useSelector(state => getSort(state)) ||
    defaultSort) as Sort
  const setOrder = useCallback(
    ({ attribute, order }: Sort) => {
      dispatch(sortFolder(folderId, attribute, order))
    },
    [dispatch, folderId]
  )
  return [currentSort, setOrder]
}

export { useFolderSort }

export interface Sort {
  attribute: string
  order: string
}

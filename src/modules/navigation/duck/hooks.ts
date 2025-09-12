import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import flag from 'cozy-flags'

import { DEFAULT_SORT, SORT_BY_UPDATE_DATE } from '@/config/sort'
import { sortFolder, getSort } from '@/modules/navigation/duck'
import { TRASH_DIR_ID } from '@/constants/config'

const useFolderSort = (folderId: string): [Sort, (props: Sort) => void] => {
  const defaultSort: Sort =
    flag('drive.default-updated-at-sort.enabled') || folderId === TRASH_DIR_ID
      ? SORT_BY_UPDATE_DATE
      : DEFAULT_SORT
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

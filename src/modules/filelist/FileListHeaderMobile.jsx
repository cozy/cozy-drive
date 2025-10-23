import cx from 'classnames'
import React, { useState, useCallback } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListIcon from 'cozy-ui/transpiled/react/Icons/List'
import ListMinIcon from 'cozy-ui/transpiled/react/Icons/ListMin'
import {
  TableHead,
  TableHeader,
  TableRow
} from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MobileSortMenu from './MobileSortMenu'

import styles from '@/styles/filelist.styl'

const FileListHeaderMobile = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
  viewType,
  switchViewType
}) => {
  const { t } = useI18n()
  const [isShowingSortMenu, setIsShowingSortMenu] = useState(false)

  const showSortMenu = useCallback(
    () => setIsShowingSortMenu(true),
    [setIsShowingSortMenu]
  )
  const hideSortMenu = useCallback(
    () => setIsShowingSortMenu(false),
    [setIsShowingSortMenu]
  )

  if (!canSort) return null

  return (
    <TableHead className={styles['fil-content-mobile-head']}>
      <TableRow className={styles['fil-content-row-head']}>
        <TableHeader
          onClick={showSortMenu}
          className={cx(
            styles['fil-content-mobile-header'],
            styles['fil-content-header--capitalize'],
            {
              [styles['fil-content-header-sortasc']]: sort.order === 'asc',
              [styles['fil-content-header-sortdesc']]: sort.order === 'desc'
            }
          )}
        >
          {t(`table.mobile.head_${sort.attribute}_${sort.order}`)}
        </TableHeader>
        {isShowingSortMenu && (
          <MobileSortMenu
            t={t}
            sort={sort}
            onClose={hideSortMenu}
            onSort={(attr, order) => onFolderSort(folderId, attr, order)}
          />
        )}
        <TableHeader
          className={cx(
            styles['fil-content-mobile-header'],
            styles['fil-content-header-action'],
            styles['fil-content-header--capitalize']
          )}
        >
          <Button
            variant="text"
            onClick={() => {
              switchViewType(viewType === 'list' ? 'grid' : 'list')
            }}
            label={
              <Icon
                icon={viewType === 'list' ? ListMinIcon : ListIcon}
                size={17}
              />
            }
          />
        </TableHeader>
      </TableRow>
    </TableHead>
  )
}

export { FileListHeaderMobile }

import cx from 'classnames'
import React, { useState, useCallback } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import {
  TableHead,
  TableHeader,
  TableRow
} from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MobileSortMenu from './MobileSortMenu'

import styles from '@/styles/filelist.styl'

import iconListMin from '@/assets/icons/icon-list-min.svg'
import iconList from '@/assets/icons/icon-list.svg'
import { DEFAULT_SORT } from '@/config/sort'

const FileListHeaderMobile = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
  thumbnailSizeBig,
  toggleThumbnailSize
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
  const actualSort = sort || DEFAULT_SORT
  return (
    <TableHead className={styles['fil-content-mobile-head']}>
      <TableRow className={styles['fil-content-row-head']}>
        <TableHeader
          onClick={showSortMenu}
          className={cx(
            styles['fil-content-mobile-header'],
            styles['fil-content-header--capitalize'],
            {
              [styles['fil-content-header-sortasc']]:
                actualSort.order === 'asc',
              [styles['fil-content-header-sortdesc']]:
                actualSort.order === 'desc'
            }
          )}
        >
          {t(`table.mobile.head_${actualSort.attribute}_${actualSort.order}`)}
        </TableHeader>
        {isShowingSortMenu && (
          <MobileSortMenu
            t={t}
            sort={actualSort}
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
              toggleThumbnailSize()
            }}
            label={
              <Icon
                icon={thumbnailSizeBig ? iconListMin : iconList}
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

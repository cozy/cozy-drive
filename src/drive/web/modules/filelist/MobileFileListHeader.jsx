import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { useI18n } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MobileSortMenu from './MobileSortMenu'
import { DEFAULT_SORT } from 'drive/config/sort'
import styles from 'drive/styles/filelist.styl'

import iconList from 'drive/assets/icons/icon-list.svg'
import iconListMin from 'drive/assets/icons/icon-list-min.svg'

export const MobileFileListHeader = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
  thumbnailSizeBig,
  toggleThumbnailSize
}) => {
  const { t } = useI18n()
  const [isShowingSortMenu, setIsShowingSortMenu] = useState(false)

  const showSortMenu = useCallback(() => setIsShowingSortMenu(true), [
    setIsShowingSortMenu
  ])
  const hideSortMenu = useCallback(() => setIsShowingSortMenu(false), [
    setIsShowingSortMenu
  ])

  if (!canSort) return null
  const actualSort = sort || DEFAULT_SORT
  return (
    <div
      className={cx(
        styles['fil-content-mobile-head'],
        styles['fil-content-row-head']
      )}
    >
      <div
        onClick={showSortMenu}
        className={cx(styles['fil-content-mobile-header'], {
          [styles['fil-content-header-sortasc']]: actualSort.order === 'asc',
          [styles['fil-content-header-sortdesc']]: actualSort.order === 'desc'
        })}
      >
        {t(`table.mobile.head_${actualSort.attribute}_${actualSort.order}`)}
      </div>
      {isShowingSortMenu && (
        <MobileSortMenu
          t={t}
          sort={actualSort}
          onClose={hideSortMenu}
          onSort={(attr, order) => onFolderSort(folderId, attr, order)}
        />
      )}
      <div
        className={cx(
          styles['fil-content-mobile-header'],
          styles['fil-content-header-action']
        )}
      >
        <Button
          theme={'action'}
          onClick={() => {
            toggleThumbnailSize()
          }}
          label={t('table.head_thumbnail_size')}
          extension="narrow"
          icon={
            <Icon
              icon={thumbnailSizeBig ? iconListMin : iconList}
              size={17}
              label={t('table.head_thumbnail_size')}
            />
          }
          iconOnly
        />
      </div>
    </div>
  )
}

export default MobileFileListHeader

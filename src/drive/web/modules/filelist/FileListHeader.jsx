import React from 'react'
import classNames from 'classnames'
import { useI18n } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import iconList from 'drive/assets/icons/icon-list.svg'
import iconListMin from 'drive/assets/icons/icon-list-min.svg'
import { HeaderCell, SortableHeaderCell } from './HeaderCell'
import { SORTABLE_ATTRIBUTES, DEFAULT_SORT } from 'drive/config/sort'

import styles from 'drive/styles/filelist.styl'

const FileListHeader = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
  thumbnailSizeBig,
  toggleThumbnailSize
}) => {
  const { t } = useI18n()
  const actualSort = sort || DEFAULT_SORT
  return (
    <div
      className={classNames(
        styles['fil-content-head'],
        styles['fil-content-row-head']
      )}
    >
      <div
        className={classNames(
          styles['fil-content-header'],
          styles['fil-content-file-select']
        )}
      />
      {SORTABLE_ATTRIBUTES.map((props, index) => {
        if (!canSort) {
          return <HeaderCell {...props} t={t} key={index} />
        }
        const isActive = actualSort && actualSort.attribute === props.attr
        return (
          <SortableHeaderCell
            key={`key_cell_${index}`}
            {...props}
            t={t}
            order={isActive ? actualSort.order : null}
            onSort={(attr, order) => onFolderSort(folderId, attr, order)}
          />
        )
      })}
      <div
        className={classNames(
          styles['fil-content-header'],
          styles['fil-content-size']
        )}
      >
        {t('table.head_size')}
      </div>
      <div
        className={classNames(
          styles['fil-content-header'],
          styles['fil-content-header-status']
        )}
      >
        {t('table.head_status')}
      </div>
      <div
        className={classNames(
          styles['fil-content-header'],
          styles['fil-content-header-action']
        )}
      >
        {/** in order to not display this button in a MoveModal for instance */}
        {canSort && (
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
        )}
      </div>
    </div>
  )
}

export default FileListHeader

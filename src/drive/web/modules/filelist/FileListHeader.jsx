import React from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import {
  TableHead,
  TableHeader,
  TableRow
} from 'cozy-ui/transpiled/react/Table'

import iconList from 'assets/icons/icon-list.svg'
import iconListMin from 'assets/icons/icon-list-min.svg'
import HeaderCell from './HeaderCell'
import { SORTABLE_ATTRIBUTES, DEFAULT_SORT } from 'config/sort'

import styles from 'styles/filelist.styl'

const FileListHeader = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
  thumbnailSizeBig,
  toggleThumbnailSize,
  extraColumns
}) => {
  const { t } = useI18n()
  const actualSort = sort || DEFAULT_SORT

  return (
    <TableHead className={styles['fil-content-head']}>
      <TableRow className={styles['fil-content-row-head']}>
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-file-select']
          )}
        />
        {SORTABLE_ATTRIBUTES.map(
          ({ label, attr, css, defaultOrder }, index) => {
            if (!canSort) {
              return <HeaderCell key={index} label={label} css={css} />
            }
            const isActive = actualSort && actualSort.attribute === attr
            return (
              <HeaderCell
                key={`key_cell_${index}`}
                label={label}
                attr={attr}
                css={css}
                defaultOrder={defaultOrder}
                order={isActive ? actualSort.order : null}
                onSort={(attr, order) => onFolderSort(folderId, attr, order)}
              />
            )
          }
        )}
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-size']
          )}
        >
          {t('table.head_size')}
        </TableHeader>
        {extraColumns &&
          extraColumns.map(column => (
            <column.HeaderComponent key={column.label} />
          ))}
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-status']
          )}
        >
          {t('table.head_status')}
        </TableHeader>
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-sharing-shortcut']
          )}
        />
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-action']
          )}
        >
          {/** in order to not display this button in a MoveModal for instance */}
          {canSort && (
            <Button
              variant="text"
              onClick={() => {
                toggleThumbnailSize()
              }}
              label={
                <Icon
                  icon={thumbnailSizeBig ? iconListMin : iconList}
                  size={17}
                  label={t('table.head_thumbnail_size')}
                />
              }
              aria-label={t('table.head_thumbnail_size')}
            />
          )}
        </TableHeader>
      </TableRow>
    </TableHead>
  )
}

export default FileListHeader

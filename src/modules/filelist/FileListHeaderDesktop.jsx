import cx from 'classnames'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import {
  TableHead,
  TableHeader,
  TableRow
} from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import HeaderCell from './HeaderCell'

import styles from '@/styles/filelist.styl'

import iconListMin from '@/assets/icons/icon-list-min.svg'
import iconList from '@/assets/icons/icon-list.svg'
import { SORTABLE_ATTRIBUTES, DEFAULT_SORT } from '@/config/sort'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme';

const FileListHeaderDesktop = ({
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
  const isTwake = isTwakeTheme()

  return (
    <TableHead className={styles['fil-content-head']}>
      <TableRow className={styles['fil-content-row-head']}>
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-file-select'],
            { [styles['u-capitalize']]: isTwake }
          )}
        />
        {SORTABLE_ATTRIBUTES.map(
          ({ label, attr, css, defaultOrder }, index) => {
            if (!canSort) {
              return <HeaderCell key={index} label={label} css={css} className={isTwake ? [styles['u-capitalize']] : ''} />
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
                className={isTwake ? [styles['u-capitalize']] : ''}
              />
            )
          }
        )}
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-size'],
            { [styles['u-capitalize']]: isTwake }
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
            styles['fil-content-header-status'],
            { [styles['u-capitalize']]: isTwake }
          )}
        >
          {t('table.head_status')}
        </TableHeader>
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-sharing-shortcut'],
            { [styles['u-capitalize']]: isTwake }
          )}
        />
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-action'],
            { [styles['u-capitalize']]: isTwake }
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

export { FileListHeaderDesktop }
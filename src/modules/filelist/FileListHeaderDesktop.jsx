import cx from 'classnames'
import React from 'react'

import {
  TableHead,
  TableHeader,
  TableRow
} from 'cozy-ui/transpiled/react/deprecated/Table'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import HeaderCell from './HeaderCell'

import styles from '@/styles/filelist.styl'

import { SORTABLE_ATTRIBUTES, DEFAULT_SORT } from '@/config/sort'

const FileListHeaderDesktop = ({
  folderId,
  canSort,
  sort,
  onFolderSort,
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
            styles['fil-content-file-select'],
            { [styles['fil-content-header--capitalize']]: isTwakeTheme() }
          )}
        />
        {SORTABLE_ATTRIBUTES.map(
          ({ label, attr, css, defaultOrder }, index) => {
            if (!canSort) {
              return (
                <HeaderCell
                  key={index}
                  label={label}
                  css={css}
                  className={
                    isTwakeTheme()
                      ? [styles['fil-content-header--capitalize']]
                      : ''
                  }
                />
              )
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
                className={
                  isTwakeTheme()
                    ? [styles['fil-content-header--capitalize']]
                    : ''
                }
              />
            )
          }
        )}
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-size'],
            { [styles['fil-content-header--capitalize']]: isTwakeTheme() }
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
            { [styles['fil-content-header--capitalize']]: isTwakeTheme() }
          )}
        >
          {t('table.head_status')}
        </TableHeader>
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-sharing-shortcut'],
            { [styles['fil-content-header--capitalize']]: isTwakeTheme() }
          )}
        />
        <TableHeader
          className={cx(
            styles['fil-content-header'],
            styles['fil-content-header-action'],
            { [styles['fil-content-header--capitalize']]: isTwakeTheme() }
          )}
        >
          {/** Empty header cell for actions column */}
        </TableHeader>
      </TableRow>
    </TableHead>
  )
}

export { FileListHeaderDesktop }

import cx from 'classnames'
import React, { useCallback } from 'react'

import { TableHeader } from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from 'styles/filelist.styl'

const HeaderCell = ({
  label,
  css,
  attr,
  order = null,
  defaultOrder,
  onSort
}) => {
  const { t } = useI18n()
  const sortCallback = useCallback(
    () =>
      onSort &&
      onSort(attr, order ? (order === 'asc' ? 'desc' : 'asc') : defaultOrder),
    [onSort, attr, order, defaultOrder]
  )
  return (
    <TableHeader
      onClick={sortCallback}
      className={cx(
        styles['fil-content-header'],
        styles[`fil-content-${css}`],
        {
          [styles['fil-content-header-sortableasc']]:
            onSort && order === null && defaultOrder === 'asc',
          [styles['fil-content-header-sortabledesc']]:
            onSort && order === null && defaultOrder === 'desc',
          [styles['fil-content-header-sortasc']]: onSort && order === 'asc',
          [styles['fil-content-header-sortdesc']]: onSort && order === 'desc'
        }
      )}
    >
      {t(`table.head_${label}`)}
    </TableHeader>
  )
}

export default HeaderCell

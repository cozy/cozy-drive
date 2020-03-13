import React from 'react'
import cx from 'classnames'
import { useI18n } from 'cozy-ui/react/I18n'
import styles from 'drive/styles/filelist.styl'

export const HeaderCell = ({ label, css }) => {
  const { t } = useI18n()
  return (
    <div
      className={cx(styles['fil-content-header'], styles[`fil-content-${css}`])}
    >
      {t(`table.head_${label}`)}
    </div>
  )
}

export const SortableHeaderCell = ({
  label,
  attr,
  css,
  order = null,
  defaultOrder,
  onSort
}) => {
  const { t } = useI18n()
  return (
    <div
      onClick={() =>
        onSort(attr, order ? (order === 'asc' ? 'desc' : 'asc') : defaultOrder)
      }
      className={cx(
        styles['fil-content-header'],
        styles[`fil-content-${css}`],
        {
          [styles['fil-content-header-sortableasc']]:
            order === null && defaultOrder === 'asc',
          [styles['fil-content-header-sortabledesc']]:
            order === null && defaultOrder === 'desc',
          [styles['fil-content-header-sortasc']]: order === 'asc',
          [styles['fil-content-header-sortdesc']]: order === 'desc'
        }
      )}
    >
      {t(`table.head_${label}`)}
    </div>
  )
}

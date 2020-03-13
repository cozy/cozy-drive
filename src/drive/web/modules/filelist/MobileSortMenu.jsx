import React from 'react'
import cx from 'classnames'
import { useI18n } from 'cozy-ui/react/I18n'
import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import { MenuItem } from 'cozy-ui/transpiled/react/Menu'
import styles from 'drive/styles/filelist.styl'
import { SORTABLE_ATTRIBUTES } from 'drive/config/sort'

const MobileSortMenu = ({ sort, onSort, onClose }) => {
  const { t } = useI18n()
  return (
    <ActionMenu onClose={onClose}>
      <div className={styles['fil-sort-menu']}>
        {SORTABLE_ATTRIBUTES.map(({ attr }) => [
          { attr, order: 'asc' },
          { attr, order: 'desc' }
        ])
          .reduce((acc, val) => [...acc, ...val], [])
          .map(({ attr, order }) => (
            <MenuItem
              key={`key_${attr}_${order}`}
              className={cx(styles['fil-sort-menu-item'], {
                [styles['fil-sort-menu-item-selected']]:
                  sort.order === order && sort.attribute === attr
              })}
              onClick={() => {
                onSort(attr, order)
                onClose()
              }}
            >
              {t(`table.mobile.head_${attr}_${order}`)}
            </MenuItem>
          ))}
      </div>
    </ActionMenu>
  )
}

export default MobileSortMenu

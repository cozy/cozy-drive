import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import ActionMenuWrapper from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuWrapper'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Radio from 'cozy-ui/transpiled/react/Radios'

import { SORTABLE_ATTRIBUTES } from 'config/sort'

const MobileSortMenu = ({ sort, onSort, onClose }) => {
  const { t } = useI18n()
  return (
    <ActionMenuWrapper open onClose={onClose}>
      {SORTABLE_ATTRIBUTES.map(({ attr }) => [
        { attr, order: 'asc' },
        { attr, order: 'desc' }
      ])
        .reduce((acc, val) => [...acc, ...val], [])
        .map(({ attr, order }) => {
          const labelId = `sort_by_${attr}_${order}`
          return (
            <ActionMenuItem
              key={`key_${attr}_${order}`}
              onClick={() => {
                onSort(attr, order)
                onClose()
              }}
            >
              <ListItemIcon>
                <Radio
                  checked={sort.order === order && sort.attribute === attr}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={t(`table.mobile.head_${attr}_${order}`)}
              />
            </ActionMenuItem>
          )
        })}
    </ActionMenuWrapper>
  )
}

export default MobileSortMenu

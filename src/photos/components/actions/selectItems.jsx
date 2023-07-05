import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import CheckboxIcon from 'cozy-ui/transpiled/react/Icons/Checkbox'

const selectItems = onSelect => () => ({
  name: 'selectItems',
  action: onSelect,
  Component: forwardRef(function SelectItems(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={CheckboxIcon} />
        </ListItemIcon>
        <ListItemText primary={t('Toolbar.menu.select_items')} />
      </ActionMenuItem>
    )
  })
})

export default selectItems
